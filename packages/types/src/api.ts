export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | unknown[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  requestId?: string;
  timestamp: string;
}

export interface HealthCheckData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  environment: string;
  uptime: number;
  services: {
    database?: 'connected' | 'disconnected' | 'pending';
    storage?: 'configured' | 'pending';
    ai?: 'configured' | 'pending';
  };
}
