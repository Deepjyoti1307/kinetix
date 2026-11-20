import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { ApiResponse } from '@kinetix/types';
import { User, Session, Profile } from '@prisma/client';

export interface AuthenticatedUser extends User {
  profile?: Profile | null;
  passkeys?: { id: string; createdAt: Date; deviceType: string | null }[];
  hasPin?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      sessionRecord?: Session;
    }
  }
}

export const SESSION_COOKIE_NAME = 'kinetix_session';

export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token =
    req.cookies?.[SESSION_COOKIE_NAME] ||
    req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    next();
    return;
  }

  try {
    const session = await authService.validateSession(token);
    if (session) {
      req.user = {
        ...session.user,
        hasPin: Boolean(session.user.pinCredential),
      };
      req.sessionRecord = session;
    }
  } catch (error) {
    console.error('Session validation error in optionalAuth:', error);
  }

  next();
}

export async function requireAuth(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  const token =
    req.cookies?.[SESSION_COOKIE_NAME] ||
    req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication session required to access this resource',
      },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    const session = await authService.validateSession(token);
    if (!session) {
      res.clearCookie(SESSION_COOKIE_NAME);
      res.status(401).json({
        success: false,
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Your session has expired or is invalid. Please authenticate again.',
        },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    req.user = {
      ...session.user,
      hasPin: Boolean(session.user.pinCredential),
    };
    req.sessionRecord = session;
    next();
  } catch (error) {
    console.error('requireAuth middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_INTERNAL_ERROR',
        message: 'Failed to verify session security state',
      },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    });
  }
}
