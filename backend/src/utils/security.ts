import * as argon2 from '@node-rs/argon2';
import crypto from 'crypto';

export async function hashPin(pin: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.randomBytes(16).toString('hex');
  // Hash with salt combined
  const hash = await argon2.hash(`${salt}:${pin}`, {
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    outputLen: 32,
    parallelism: 1,
  });
  return { hash, salt };
}

export async function verifyPin(pin: string, storedHash: string, salt: string): Promise<boolean> {
  try {
    return await argon2.verify(storedHash, `${salt}:${pin}`);
  } catch (error) {
    console.error('Argon2 PIN verification failed:', error);
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function calculateLockout(failedAttempts: number): { lockedUntil: Date | null; delaySeconds: number } {
  if (failedAttempts >= 5) {
    // 15-minute temporary lockout
    const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    return { lockedUntil, delaySeconds: 15 * 60 };
  }
  if (failedAttempts >= 3) {
    // 60-second delay
    const lockedUntil = new Date(Date.now() + 60 * 1000);
    return { lockedUntil, delaySeconds: 60 };
  }
  return { lockedUntil: null, delaySeconds: 0 };
}
