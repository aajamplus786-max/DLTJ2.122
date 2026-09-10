// =====================================================
// DLTJ2.1
// STEP 2 — BATCH 3
// FILE: src/services/securityService.ts
// =====================================================

import {
  clearSession,
  getSession,
  getUsers,
  saveUsers,
} from "./storageService";

// =====================================================
// SESSION SECURITY
// =====================================================

export const SESSION_DURATION =
  1000 * 60 * 60 * 24;

// =====================================================
// OTP SECURITY
// =====================================================

export const OTP_DURATION =
  1000 * 60;

export const MAX_OTP_ATTEMPTS = 5;

// =====================================================
// LOGIN LOCK SECURITY
// =====================================================

export const MAX_LOGIN_ATTEMPTS = 7;

export const LOGIN_LOCK_DURATION =
  1000 *
  60 *
  60 *
  75;

// =====================================================
// SESSION VALIDATION
// =====================================================

export function isSessionValid(): boolean {
  const session =
    getSession();

  if (!session) {
    return false;
  }

  if (
    !session.expiresAt ||
    Date.now() >=
      session.expiresAt
  ) {
    clearSession();

    return false;
  }

  return true;
}

// =====================================================
// REMAINING SESSION TIME
// =====================================================

export function getRemainingSessionTime(): number {
  const session =
    getSession();

  if (!session) {
    return 0;
  }

  return Math.max(
    0,
    session.expiresAt -
      Date.now()
  );
}

// =====================================================
// ACCOUNT LOCK CHECK
// =====================================================

export function isAccountLocked(
  lockedUntil: number | null
): boolean {
  if (!lockedUntil) {
    return false;
  }

  return Date.now() < lockedUntil;
}

// =====================================================
// REMAINING LOCK TIME
// =====================================================

export function getRemainingLockTime(
  lockedUntil: number | null
): number {
  if (!lockedUntil) {
    return 0;
  }

  return Math.max(
    0,
    lockedUntil -
      Date.now()
  );
}

// =====================================================
// REGISTER FAILED LOGIN
// =====================================================

export function recordFailedLogin(
  userId: string
): void {
  const users =
    getUsers();

  const updatedUsers =
    users.map((user) => {
      if (user.id !== userId) {
        return user;
      }

      const attempts =
        (user.failedLoginAttempts ?? 0) +
        1;

      if (
        attempts >=
        MAX_LOGIN_ATTEMPTS
      ) {
        return {
          ...user,
          failedLoginAttempts:
            attempts,
          lockedUntil:
            Date.now() +
            LOGIN_LOCK_DURATION,
        };
      }

      return {
        ...user,
        failedLoginAttempts:
          attempts,
      };
    });

  saveUsers(updatedUsers);
}

// =====================================================
// RESET FAILED LOGIN COUNT
// =====================================================

export function resetFailedLogin(
  userId: string
): void {
  const users =
    getUsers();

  const updatedUsers =
    users.map((user) =>
      user.id === userId
        ? {
            ...user,
            failedLoginAttempts: 0,
            lockedUntil: null,
          }
        : user
    );

  saveUsers(updatedUsers);
}

// =====================================================
// OTP EXPIRATION
// =====================================================

export function isOTPExpired(
  expiresAt: number
): boolean {
  return Date.now() >=
    expiresAt;
}