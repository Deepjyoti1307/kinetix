import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../../services/auth.service.js';
import { requireAuth, SESSION_COOKIE_NAME } from '../../middleware/auth.js';
import { ApiResponse, SessionStatus } from '@kinetix/types';
import { env } from '../../config/env.js';

const router = Router();

const isProduction = env.NODE_ENV === 'production';

function setSessionCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: expiresAt,
    path: '/',
  });
}

// ----------------------------------------------------------------------------
// Session Status & Logout
// ----------------------------------------------------------------------------
router.get('/session', async (req: Request, res: Response<ApiResponse<SessionStatus>>) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    res.status(200).json({
      success: true,
      data: { authenticated: false },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const session = await authService.validateSession(token);
  if (!session) {
    res.clearCookie(SESSION_COOKIE_NAME);
    res.status(200).json({
      success: true,
      data: { authenticated: false },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        hasPasskey: session.user.passkeys.length > 0,
        hasPin: Boolean(session.user.pinCredential),
        createdAt: session.user.createdAt.toISOString(),
      },
      expiresAt: session.expiresAt.toISOString(),
    },
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

router.post('/logout', async (req: Request, res: Response<ApiResponse>) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (token) {
    await authService.revokeSession(token);
  }
  res.clearCookie(SESSION_COOKIE_NAME);
  res.status(200).json({
    success: true,
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------------------------------
// WebAuthn Passkeys (Primary Flow)
// ----------------------------------------------------------------------------
router.get('/webauthn/auth-options', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { options } = await authService.generatePasskeyAuthOptions();
    res.status(200).json({
      success: true,
      data: options,
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'WEBAUTHN_OPTIONS_ERROR', message: error.message },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
});

router.post('/webauthn/auth-verify', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const { token, expiresAt } = await authService.verifyPasskeyAuthentication(
      req.body,
      userAgent,
      ipAddress
    );

    setSessionCookie(res, token, expiresAt);

    res.status(200).json({
      success: true,
      data: { message: 'Biometric Passkey verified successfully' },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: { code: 'WEBAUTHN_VERIFY_FAILED', message: error.message },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/webauthn/register-options', requireAuth, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const user = req.user!;
    const options = await authService.generatePasskeyRegistrationOptions(user.id);
    res.status(200).json({
      success: true,
      data: options,
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'WEBAUTHN_REG_OPTIONS_ERROR', message: error.message },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
});

router.post('/webauthn/register-verify', requireAuth, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const user = req.user!;
    await authService.verifyPasskeyRegistration(user.id, req.body);
    res.status(200).json({
      success: true,
      data: { message: 'Passkey registered to your account successfully' },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'WEBAUTHN_REG_FAILED', message: error.message },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
});

// ----------------------------------------------------------------------------
// Secondary PIN Fallback (Recovery Flow)
// ----------------------------------------------------------------------------
const pinSchema = z.object({
  pin: z.string().min(4).max(12),
});

router.post('/pin/verify', async (req: Request, res: Response<ApiResponse>) => {
  const parsed = pinSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_PIN_FORMAT', message: 'PIN must be between 4 and 12 digits' },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const { token, expiresAt } = await authService.verifyPinAuthentication(
      parsed.data.pin,
      userAgent,
      ipAddress
    );

    setSessionCookie(res, token, expiresAt);

    res.status(200).json({
      success: true,
      data: { message: 'PIN verified successfully' },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const isLockout = error.message.includes('lockout') || error.message.includes('Gated');
    res.status(isLockout ? 429 : 401).json({
      success: false,
      error: {
        code: isLockout ? 'PIN_LOCKED_OUT' : 'INVALID_PIN',
        message: error.message,
      },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
});

router.post('/pin/change', requireAuth, async (req: Request, res: Response<ApiResponse>) => {
  const parsed = pinSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_PIN_FORMAT', message: 'New PIN must be between 4 and 12 digits' },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  await authService.updatePin(req.user!.id, parsed.data.pin);

  res.status(200).json({
    success: true,
    data: { message: 'Security PIN updated successfully' },
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

export default router;
