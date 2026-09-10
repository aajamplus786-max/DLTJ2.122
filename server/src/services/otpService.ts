
// =====================================================
// DLTJ2.2
// USER OTP SERVICE
// FILE: server/src/services/otpService.ts
// =====================================================

import crypto from "node:crypto";

import type {
  PendingLoginOTP,
} from "../models/User";

// =====================================================
// CONSTANTS
// =====================================================

export const OTP_DURATION =
  1000 * 60 * 5;

export const MAX_OTP_ATTEMPTS = 5;

// =====================================================
// IN-MEMORY OTP STORAGE
// =====================================================

const pendingOTPs =
  new Map<string, PendingLoginOTP>();

// =====================================================
// GENERATE OTP
// =====================================================

function generateOTP(): string {
  return String(
    crypto.randomInt(
      100000,
      1000000,
    ),
  );
}

// =====================================================
// CREATE OTP
// =====================================================

export async function createOTP(
  userId: string,
  mobile: string,
) {
  const code =
    generateOTP();

  const now =
    Date.now();

  const pendingOTP:
    PendingLoginOTP = {
    userId,
    mobile,
    code,
    createdAt: now,
    expiresAt:
      now + OTP_DURATION,
    attempts: 0,
  };

  pendingOTPs.set(
    userId,
    pendingOTP,
  );

  // ---------------------------------------------------
  // DEVELOPMENT MODE
  // Real SMS provider will be connected later.
  // ---------------------------------------------------

  console.info(
    `[DLTJ2.2 DEV OTP] ${mobile}: ${code}`,
  );

  return {
    success: true,
    message:
      "OTP generated successfully.",

    // DEV ONLY
    // This allows the frontend OTP page
    // to display the generated OTP.
    otp: code,

    expiresAt:
      pendingOTP.expiresAt,
  };
}

// =====================================================
// VERIFY OTP
// =====================================================

export async function verifyOTPCode(
  userId: string,
  otp: string,
) {
  const pending =
    pendingOTPs.get(userId);

  if (!pending) {
    return {
      success: false,
      message:
        "OTP verification session expired.",
    };
  }

  // ---------------------------------------------------
  // OTP EXPIRY
  // ---------------------------------------------------

  if (
    Date.now() >=
    pending.expiresAt
  ) {
    pendingOTPs.delete(
      userId,
    );

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
    pendingOTPs.delete(
      userId,
    );

    return {
      success: false,
      message:
        "Too many incorrect OTP attempts. Please request a new OTP.",
    };
  }

  // ---------------------------------------------------
  // VERIFY CODE
  // ---------------------------------------------------

  if (
    otp.trim() !==
    pending.code
  ) {
    pending.attempts += 1;

    pendingOTPs.set(
      userId,
      pending,
    );

    const remaining =
      Math.max(
        0,
        MAX_OTP_ATTEMPTS -
          pending.attempts,
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
  // OTP VERIFIED
  // ---------------------------------------------------

  pendingOTPs.delete(
    userId,
  );

  return {
    success: true,
    message:
      "OTP verified successfully.",
  };
}

// =====================================================
// RESEND OTP
// =====================================================

export async function resendOTP(
  userId: string,
  mobile: string,
) {
  return createOTP(
    userId,
    mobile,
  );
}

// =====================================================
// CLEAR OTP
// =====================================================

export function clearOTP(
  userId: string,
): void {
  pendingOTPs.delete(
    userId,
  );
}
