export interface UserProfileSummary {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  hasPasskey: boolean;
  hasPin: boolean;
  createdAt: string;
}

export interface SessionStatus {
  authenticated: boolean;
  user?: UserProfileSummary;
  expiresAt?: string;
}

export interface PinVerifyRequest {
  pin: string;
}

export interface PinSetupRequest {
  pin: string;
  currentPin?: string;
}
