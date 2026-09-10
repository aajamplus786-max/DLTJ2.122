// =====================================================
// DLTJ2.1
// STEP 2 — BATCH 2
// FILE: src/types/User.ts
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

export interface Session {
  userId: string;

  mobile: string;

  loginAt: number;

  expiresAt: number;
}

export interface PendingOTP {
  userId: string;

  mobile: string;

  code: string;

  createdAt: number;

  expiresAt: number;

  attempts: number;
}