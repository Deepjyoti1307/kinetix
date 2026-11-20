import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@kinetix/types';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const requestId = req.id;
  const timestamp = new Date().toISOString();

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload validation failed',
        details: err.flatten(),
      },
      requestId,
      timestamp,
    });
    return;
  }

  console.error(`[Error] [RequestID: ${requestId}]`, err);

  const statusCode = (err as { status?: number }).status || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected internal server error occurred'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
    requestId,
    timestamp,
  });
}
