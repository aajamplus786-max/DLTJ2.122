// =====================================================
// DLTJ2.2
// USER AUTHENTICATION MODELS
// FILE: server/src/models/User.ts
// =====================================================

export interface User {
  id: string;

  name: string;

  mobile: string;

  passwordHash: string;

  createdAt: string;

  mobileVerified: boolean;

  failedLoginAttempts: number;

  lockedUntil: number | null;
}

// =====================================================
// AUTH SESSION
// =====================================================

export interface AuthSession {
  token: string;

  userId: string;

  mobile: string;

  createdAt: number;

  expiresAt: number;
}

// =====================================================
// PENDING OTP
// =====================================================

export interface PendingLoginOTP {
  userId: string;

  mobile: string;

  code: string;

  createdAt: number;

  expiresAt: number;

  attempts: number;
}