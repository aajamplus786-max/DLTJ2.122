// =====================================================
// DLTJ2.2
// USER AUTHENTICATION MODEL
// FILE: server/src/models/User.ts
// DATE: 2026-09-01
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