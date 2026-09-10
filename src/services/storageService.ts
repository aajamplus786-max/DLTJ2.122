
// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 13
// FILE: src/services/storageService.ts
// DATE: 2026-08-31
// =====================================================

import type {
  PendingOTP,
  Session,
  User,
} from "../types/User";

// =====================================================
// STORAGE KEYS
// =====================================================

const USERS_KEY =
  "dltj21_users";

const SESSION_KEY =
  "dltj21_session";

const PENDING_OTP_KEY =
  "dltj21_pending_otp";

// =====================================================
// GENERIC STORAGE
// =====================================================

export function saveStorage<T>(
  key: string,
  value: T,
): boolean {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value),
    );

    return true;
  } catch {
    return false;
  }
}

// =====================================================
// LOAD STORAGE
// =====================================================

export function loadStorage<T>(
  key: string,
  fallback: T,
): T {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// =====================================================
// REMOVE STORAGE
// =====================================================

export function removeStorage(
  key: string,
): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors.
  }
}

// =====================================================
// USERS
// =====================================================

export function getUsers(): User[] {
  return loadStorage<User[]>(
    USERS_KEY,
    [],
  );
}

export function saveUsers(
  users: User[],
): boolean {
  return saveStorage<User[]>(
    USERS_KEY,
    users,
  );
}

// =====================================================
// SESSION
// =====================================================

export function getSession():
  Session | null {
  return loadStorage<Session | null>(
    SESSION_KEY,
    null,
  );
}

export function saveSession(
  session: Session,
): boolean {
  return saveStorage<Session>(
    SESSION_KEY,
    session,
  );
}

export function clearSession(): void {
  removeStorage(
    SESSION_KEY,
  );
}

// =====================================================
// PENDING OTP
// =====================================================

export function getPendingOTP():
  PendingOTP | null {
  return loadStorage<
    PendingOTP | null
  >(
    PENDING_OTP_KEY,
    null,
  );
}

export function savePendingOTP(
  pendingOTP: PendingOTP,
): boolean {
  return saveStorage<PendingOTP>(
    PENDING_OTP_KEY,
    pendingOTP,
  );
}

export function clearPendingOTP(): void {
  removeStorage(
    PENDING_OTP_KEY,
  );
}

// =====================================================
// WORKING TOOL STORAGE
// =====================================================

const WORKING_TOOL_PREFIX =
  "dltj2-working-tool:";

export function clearWorkingToolStorage(): void {
  const keys: string[] = [];

  try {
    for (
      let index = 0;
      index < localStorage.length;
      index += 1
    ) {
      const key =
        localStorage.key(index);

      if (
        key &&
        key.startsWith(
          WORKING_TOOL_PREFIX,
        )
      ) {
        keys.push(key);
      }
    }

    keys.forEach(
      (key) => {
        localStorage.removeItem(
          key,
        );
      },
    );
  } catch {
    // Ignore storage errors.
  }
}

// =====================================================
// CLEAR ALL DLTJ AUTH DATA
// =====================================================

export function clearAuthStorage(): void {
  removeStorage(
    USERS_KEY,
  );

  removeStorage(
    SESSION_KEY,
  );

  removeStorage(
    PENDING_OTP_KEY,
  );
}
