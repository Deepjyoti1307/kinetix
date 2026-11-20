import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/server';
import type { PasskeyCredential } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
import {
  verifyPin,
  hashPin,
  generateSessionToken,
  hashSessionToken,
  calculateLockout,
} from '../utils/security.js';

// In-memory challenge store (per user/session)
const challengesStore = new Map<string, { challenge: string; timestamp: number }>();

function cleanOldChallenges(): void {
  const now = Date.now();
  for (const [key, val] of challengesStore.entries()) {
    if (now - val.timestamp > 5 * 60 * 1000) {
      challengesStore.delete(key);
    }
  }
}

export class AuthService {
  private rpName = 'Kinetix Fitness Telemetry';
  private getRpId(): string {
    try {
      const url = new URL(env.CLIENT_ORIGIN);
      return url.hostname;
    } catch {
      return 'localhost';
    }
  }

  private getExpectedOrigin(): string {
    return env.CLIENT_ORIGIN;
  }

  // --------------------------------------------------------------------------
  // Owner Verification & Lookup
  // --------------------------------------------------------------------------
  async getOwner() {
    return await prisma.user.findFirst({
      where: { role: 'OWNER' },
      include: {
        pinCredential: true,
        passkeys: true,
        profile: true,
      },
    });
  }

  // --------------------------------------------------------------------------
  // WebAuthn Passkey - Registration (Primary)
  // --------------------------------------------------------------------------
  async generatePasskeyRegistrationOptions(userId: string) {
    cleanOldChallenges();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { passkeys: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const excludeCredentials = user.passkeys.map((p: PasskeyCredential) => ({
      id: p.credentialId,
      transports: p.transports as AuthenticatorTransportFuture[],
    }));

    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.getRpId(),
      userID: new Uint8Array(Buffer.from(user.id)),
      userName: user.email,
      userDisplayName: user.name,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    challengesStore.set(`reg:${user.id}`, {
      challenge: options.challenge,
      timestamp: Date.now(),
    });

    return options;
  }

  async verifyPasskeyRegistration(userId: string, response: RegistrationResponseJSON) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const expected = challengesStore.get(`reg:${user.id}`);
    if (!expected) throw new Error('Registration challenge expired or not found');

    const verification: VerifiedRegistrationResponse = await verifyRegistrationResponse({
      response,
      expectedChallenge: expected.challenge,
      expectedOrigin: this.getExpectedOrigin(),
      expectedRPID: this.getRpId(),
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new Error('WebAuthn registration verification failed');
    }

    challengesStore.delete(`reg:${user.id}`);

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Save Passkey to database
    return await prisma.passkeyCredential.create({
      data: {
        userId: user.id,
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
      },
    });
  }

  // --------------------------------------------------------------------------
  // WebAuthn Passkey - Authentication (Primary)
  // --------------------------------------------------------------------------
  async generatePasskeyAuthOptions() {
    cleanOldChallenges();
    const owner = await this.getOwner();
    if (!owner) throw new Error('System owner account not provisioned');

    const allowCredentials = owner.passkeys.map((p: PasskeyCredential) => ({
      id: p.credentialId,
      transports: p.transports as AuthenticatorTransportFuture[],
    }));

    const options = await generateAuthenticationOptions({
      rpID: this.getRpId(),
      allowCredentials,
      userVerification: 'preferred',
    });

    challengesStore.set(`auth:${owner.id}`, {
      challenge: options.challenge,
      timestamp: Date.now(),
    });

    return { options, userId: owner.id };
  }

  async verifyPasskeyAuthentication(
    response: AuthenticationResponseJSON,
    userAgent?: string,
    ipAddress?: string
  ) {
    const owner = await this.getOwner();
    if (!owner) throw new Error('System owner account not provisioned');

    const expected = challengesStore.get(`auth:${owner.id}`);
    if (!expected) throw new Error('Authentication challenge expired or not found');

    const credential = owner.passkeys.find(
      (p: PasskeyCredential) => p.credentialId === response.id
    );

    if (!credential) {
      throw new Error('Unknown passkey credential');
    }

    const verification: VerifiedAuthenticationResponse = await verifyAuthenticationResponse({
      response,
      expectedChallenge: expected.challenge,
      expectedOrigin: this.getExpectedOrigin(),
      expectedRPID: this.getRpId(),
      credential: {
        id: credential.credentialId,
        publicKey: new Uint8Array(credential.publicKey),
        counter: Number(credential.counter),
        transports: credential.transports as AuthenticatorTransportFuture[],
      },
    });

    if (!verification.verified) {
      throw new Error('Passkey verification failed');
    }

    challengesStore.delete(`auth:${owner.id}`);

    // Update credential counter
    await prisma.passkeyCredential.update({
      where: { id: credential.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    // Issue session token
    return await this.createSession(owner.id, userAgent, ipAddress);
  }

  // --------------------------------------------------------------------------
  // Secondary Fallback - Recovery PIN
  // --------------------------------------------------------------------------
  async verifyPinAuthentication(pin: string, userAgent?: string, ipAddress?: string) {
    const owner = await this.getOwner();
    if (!owner || !owner.pinCredential) {
      throw new Error('Owner or PIN credential not provisioned');
    }

    const pinCred = owner.pinCredential;
    const now = new Date();

    // Check if account is currently locked out
    if (pinCred.lockedUntil && pinCred.lockedUntil > now) {
      const waitSeconds = Math.ceil((pinCred.lockedUntil.getTime() - now.getTime()) / 1000);
      throw new Error(`Security lockout active. Try again in ${waitSeconds} seconds.`);
    }

    // Verify PIN against salted Argon2id hash
    const isValid = await verifyPin(pin, pinCred.pinHash, pinCred.salt);

    if (!isValid) {
      const nextFailures = pinCred.failedAttempts + 1;
      const { lockedUntil } = calculateLockout(nextFailures);

      await prisma.pinCredential.update({
        where: { id: pinCred.id },
        data: {
          failedAttempts: nextFailures,
          lockedUntil,
          lastAttemptAt: now,
        },
      });

      if (nextFailures >= 5) {
        throw new Error('Maximum attempts exceeded. 15-minute security lockout initiated.');
      } else if (nextFailures >= 3) {
        throw new Error('Multiple failed attempts. Gated for 60 seconds.');
      } else {
        throw new Error(`Invalid PIN. ${5 - nextFailures} attempts remaining.`);
      }
    }

    // Success: Reset failed attempts & issue session
    await prisma.pinCredential.update({
      where: { id: pinCred.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastAttemptAt: now,
      },
    });

    return await this.createSession(owner.id, userAgent, ipAddress);
  }

  async updatePin(userId: string, newPin: string) {
    const { hash, salt } = await hashPin(newPin);
    return await prisma.pinCredential.upsert({
      where: { userId },
      create: {
        userId,
        pinHash: hash,
        salt,
      },
      update: {
        pinHash: hash,
        salt,
        failedAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  // --------------------------------------------------------------------------
  // Session Lifecycle
  // --------------------------------------------------------------------------
  async createSession(userId: string, userAgent?: string, ipAddress?: string) {
    const rawToken = generateSessionToken();
    const tokenHash = hashSessionToken(rawToken);

    // 14-day session expiration
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        userId,
        tokenHash,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return { token: rawToken, expiresAt };
  }

  async validateSession(rawToken: string) {
    const tokenHash = hashSessionToken(rawToken);

    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            profile: true,
            passkeys: { select: { id: true, createdAt: true, deviceType: true } },
            pinCredential: { select: { id: true, updatedAt: true } },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      }
      return null;
    }

    return session;
  }

  async revokeSession(rawToken: string) {
    const tokenHash = hashSessionToken(rawToken);
    return await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }
}

export const authService = new AuthService();
