// =====================================================
// DLTJ2.1
// STEP 2 — BATCH 2
// FILE: src/services/otpService.ts
// =====================================================

import {
  generateRandomOTP,
} from "../utils/encryption";

import {
  validateOTP,
} from "../utils/validation";

import {
  getPendingOTP,
  savePendingOTP,
  clearPendingOTP,
} from "./storageService";

// =====================================================
// SECURITY CONSTANTS
// =====================================================

export const OTP_DURATION =
  1000 * 60;

export const MAX_OTP_ATTEMPTS = 5;

// =====================================================
// CREATE OTP
// =====================================================

export async function createOTP(
  userId: string,
  mobile: string
): Promise<{
  success: boolean;
  message: string;
  otp?: string;
}> {
  const code =
    generateRandomOTP();

  const now =
    Date.now();

  const pendingOTP = {
    userId,
    mobile,
    code,
    createdAt: now,
    expiresAt:
      now + OTP_DURATION,
    attempts: 0,
  };

  savePendingOTP(
    pendingOTP
  );

  // ---------------------------------------------------
  // DEVELOPMENT ONLY
  // ---------------------------------------------------
  //
  // Real production application should send this OTP
  // through a verified SMS provider/backend.
  //
  console.info(
    `[DLTJ2.1 DEV OTP] ${mobile}: ${code}`
  );

  return {
    success: true,
    message:
      "OTP generated successfully.",
    otp: code,
  };
}

// =====================================================
// VERIFY OTP
// =====================================================

export async function verifyOTPCode(
  otp: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const validationError =
    validateOTP(otp);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  const pending =
    getPendingOTP();

  if (!pending) {
    return {
      success: false,
      message:
        "OTP verification session expired.",
    };
  }

  // ---------------------------------------------------
  // EXPIRATION
  // ---------------------------------------------------

  if (
    Date.now() >=
    pending.expiresAt
  ) {
    clearPendingOTP();

    return {
      success: false,
      message:
        "OTP has expired. Please request a new OTP.",
    };
  }

  // ---------------------------------------------------
  // MAX ATTEMPTS
  // ---------------------------------------------------

  if (
    pending.attempts >=
    MAX_OTP_ATTEMPTS
  ) {
    clearPendingOTP();

    return {
      success: false,
      message:
        "Too many incorrect OTP attempts. Please request a new OTP.",
    };
  }

  // ---------------------------------------------------
  // CHECK OTP
  // ---------------------------------------------------

  if (
    otp.trim() !==
    pending.code
  ) {
    savePendingOTP({
      ...pending,
      attempts:
        pending.attempts + 1,
    });

    const remaining =
      Math.max(
        0,
        MAX_OTP_ATTEMPTS -
          (pending.attempts + 1)
      );

    return {
      success: false,
      message:
        remaining > 0
          ? `Incorrect OTP. ${remaining} attempt(s) remaining.`
          : "Incorrect OTP. Please request a new OTP.",
    };
  }

  // ---------------------------------------------------
  // SUCCESS
  // ---------------------------------------------------

  clearPendingOTP();

  return {
    success: true,
    message:
      "OTP verified successfully.",
  };
}

// =====================================================
// OTP STATUS
// =====================================================

export function getOTPRemainingTime(): number {
  const pending =
    getPendingOTP();

  if (!pending) {
    return 0;
  }

  const remaining =
    pending.expiresAt -
    Date.now();

  if (remaining <= 0) {
    clearPendingOTP();

    return 0;
  }

  return remaining;
}

// =====================================================
// OTP EXPIRED
// =====================================================

export function isOTPExpired(
  expiresAt: number
): boolean {
  return Date.now() >= expiresAt;
}

// =====================================================
// CLEAR OTP
// =====================================================

export function cancelOTP(): void {
  clearPendingOTP();
}