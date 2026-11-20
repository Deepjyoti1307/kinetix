import { Router, Request, Response } from 'express';
import { ApiResponse, HealthCheckData } from '@kinetix/types';
import { env } from '../../config/env.js';

const router = Router();

router.get('/health', (req: Request, res: Response<ApiResponse<HealthCheckData>>) => {
  const healthData: HealthCheckData = {
    status: 'healthy',
    version: '0.1.0',
    environment: env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    services: {
      database: env.DATABASE_URL ? 'connected' : 'pending',
      storage: env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'pending',
      ai: env.GEMINI_API_KEY ? 'configured' : 'pending',
    },
  };

  res.status(200).json({
    success: true,
    data: healthData,
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

export default router;
