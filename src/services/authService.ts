// =====================================================
// DLTJ2.1
// STEP 2 — BATCH 3
// FILE: src/services/authService.ts
// =====================================================

import type {
  LoginCredentials,
  RegisterData,
} from "../types/Auth";

import type {
  Session,
  User,
} from "../types/User";

import {
  generateRandomId,
  hashText,
  verifyHash,
} from "../utils/encryption";

import {
  normalizeMobile,
  validateMobile,
  validateName,
  validatePassword,
} from "../utils/validation";

import {
  createOTP,
} from "./otpService";

import {
  SESSION_DURATION,
  isAccountLocked,
  recordFailedLogin,
  resetFailedLogin,
} from "./securityService";

import {
  clearSession,
  getSession,
  getUsers,
  saveSession,
  saveUsers,
} from "./storageService";

// =====================================================
// REGISTER USER
// =====================================================

export async function registerUser(
  data: RegisterData
): Promise<{
  success: boolean;
  message: string;
  userId?: string;
}> {
  // ---------------------------------------------------
  // NAME
  // ---------------------------------------------------

  const nameError =
    validateName(data.name);

  if (nameError) {
    return {
      success: false,
      message: nameError,
    };
  }

  // ---------------------------------------------------
  // MOBILE
  // ---------------------------------------------------

  const mobile =
    normalizeMobile(data.mobile);

  const mobileError =
    validateMobile(mobile);

  if (mobileError) {
    return {
      success: false,
      message: mobileError,
    };
  }

  // ---------------------------------------------------
  // PASSWORD
  // ---------------------------------------------------

  const passwordError =
    validatePassword(data.password);

  if (passwordError) {
    return {
      success: false,
      message: passwordError,
    };
  }

  // ---------------------------------------------------
  // CONFIRM PASSWORD
  // ---------------------------------------------------

  if (
    data.password !==
    data.confirmPassword
  ) {
    return {
      success: false,
      message:
        "Passwords do not match.",
    };
  }

  // ---------------------------------------------------
  // EXISTING ACCOUNT
  // ---------------------------------------------------

  const users: User[] =
    getUsers();

  const existingUser:
    User | undefined =
    users.find(
      (user: User) =>
        user.mobile === mobile
    );

  if (existingUser) {
    return {
      success: false,
      message:
        "An account with this mobile number already exists.",
    };
  }

  // ---------------------------------------------------
  // HASH PASSWORD
  // ---------------------------------------------------

  const passwordHash =
    await hashText(
      data.password
    );

  // ---------------------------------------------------
  // CREATE USER
  // ---------------------------------------------------

  const user: User = {
    id: generateRandomId(),

    name: data.name.trim(),

    mobile,

    passwordHash,

    createdAt:
      new Date().toISOString(),

    mobileVerified: false,

    failedLoginAttempts: 0,

    lockedUntil: null,
  };

  // ---------------------------------------------------
  // SAVE USER
  // ---------------------------------------------------

  const saved =
    saveUsers([
      ...users,
      user,
    ]);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to save account data.",
    };
  }

  // ---------------------------------------------------
  // CREATE REGISTRATION OTP
  // ---------------------------------------------------

  const otpResult =
    await createOTP(
      user.id,
      user.mobile
    );

  if (!otpResult.success) {
    return {
      success: false,
      message:
        "Account created, but OTP could not be generated. Please try again.",
    };
  }

  // ---------------------------------------------------
  // SUCCESS
  // ---------------------------------------------------

  return {
    success: true,
    message:
      "Registration successful. OTP sent for verification.",
    userId: user.id,
  };
}

// =====================================================
// LOGIN USER
// =====================================================

export async function loginUser(
  credentials: LoginCredentials
): Promise<{
  success: boolean;
  message: string;
  requiresOTP?: boolean;
}> {
  // ---------------------------------------------------
  // MOBILE
  // ---------------------------------------------------

  const mobile =
    normalizeMobile(
      credentials.mobile
    );

  const mobileError =
    validateMobile(mobile);

  if (mobileError) {
    return {
      success: false,
      message: mobileError,
    };
  }

  // ---------------------------------------------------
  // PASSWORD
  // ---------------------------------------------------

  if (!credentials.password) {
    return {
      success: false,
      message:
        "Password is required.",
    };
  }

  // ---------------------------------------------------
  // FIND USER
  // ---------------------------------------------------

  const users: User[] =
    getUsers();

  const user:
    User | undefined =
    users.find(
      (item: User) =>
        item.mobile === mobile
    );

  if (!user) {
    return {
      success: false,
      message:
        "Invalid mobile number or password.",
    };
  }

  // ---------------------------------------------------
  // ACCOUNT LOCK
  // ---------------------------------------------------

  if (
    isAccountLocked(
      user.lockedUntil
    )
  ) {
    const remaining =
      Math.ceil(
        (
          (user.lockedUntil ?? 0) -
          Date.now()
        ) /
          (1000 * 60 * 60)
      );

    return {
      success: false,
      message:
        `Account locked due to too many failed login attempts. Try again in approximately ${remaining} hour(s).`,
    };
  }

  // ---------------------------------------------------
  // CLEAR EXPIRED LOCK
  // ---------------------------------------------------

  if (
    user.lockedUntil &&
    Date.now() >=
      user.lockedUntil
  ) {
    resetFailedLogin(
      user.id
    );
  }

  // ---------------------------------------------------
  // VERIFY PASSWORD
  // ---------------------------------------------------

  const passwordCorrect =
    await verifyHash(
      credentials.password,
      user.passwordHash
    );

  if (!passwordCorrect) {
    recordFailedLogin(
      user.id
    );

    const updated =
      getUsers().find(
        (item: User) =>
          item.id === user.id
      );

    if (
      updated?.lockedUntil &&
      isAccountLocked(
        updated.lockedUntil
      )
    ) {
      return {
        success: false,
        message:
          "Too many failed login attempts. Your account is locked for 75 hours.",
      };
    }

    const attempts =
      updated?.failedLoginAttempts ??
      user.failedLoginAttempts;

    const remaining =
      Math.max(
        0,
        7 - attempts
      );

    return {
      success: false,
      message:
        remaining > 0
          ? `Invalid mobile number or password. ${remaining} attempt(s) remaining.`
          : "Invalid mobile number or password.",
    };
  }

  // ---------------------------------------------------
  // PASSWORD CORRECT
  // ---------------------------------------------------

  resetFailedLogin(
    user.id
  );

  // ---------------------------------------------------
  // CREATE LOGIN OTP
  // ---------------------------------------------------

  await createOTP(
    user.id,
    user.mobile
  );

  // ---------------------------------------------------
  // STORE PENDING LOGIN MOBILE
  // ---------------------------------------------------

  sessionStorage.setItem(
    "dltj21_pending_mobile",
    mobile
  );

  return {
    success: true,
    message:
      "Password verified. OTP required.",
    requiresOTP: true,
  };
}

// =====================================================
// CREATE SESSION
// =====================================================

export function createSession(
  user: User
): Session {
  const now =
    Date.now();

  const session: Session = {
    userId: user.id,

    mobile: user.mobile,

    loginAt: now,

    expiresAt:
      now +
      SESSION_DURATION,
  };

  saveSession(
    session
  );

  return session;
}

// =====================================================
// GET AUTHENTICATED USER
// =====================================================

export function getAuthenticatedUser():
  User | null {
  const session =
    getSession();

  if (!session) {
    return null;
  }

  if (
    !session.expiresAt ||
    Date.now() >=
      session.expiresAt
  ) {
    clearSession();

    return null;
  }

  const users =
    getUsers();

  const user:
    User | undefined =
    users.find(
      (item: User) =>
        item.id ===
        session.userId
    );

  return user ?? null;
}

// =====================================================
// LOGOUT
// =====================================================

export function logoutUser(): void {
  clearSession();
}