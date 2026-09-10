// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 14
// FILE: src/types/Security.ts
// DATE: 2026-08-31
// =====================================================

export type SecurityRole =
  | "user"
  | "admin";

export type Permission =
  | "read"
  | "write"
  | "execute"
  | "share"
  | "admin";

export interface SecurityUser {
  id: string;
  mobile: string;
  role: SecurityRole;
  mobileVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil: number | null;
}

export interface SecuritySession {
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  revokedAt: number | null;
}

export interface SecurityToken {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface ShareSecurity {
  projectId: string;
  ownerId: string;
  permission:
    | "view"
    | "edit";
  active: boolean;
  createdAt: number;
  expiresAt: number | null;
}

export interface RateLimitState {
  key: string;
  attempts: number;
  windowStartedAt: number;
  blockedUntil: number | null;
}