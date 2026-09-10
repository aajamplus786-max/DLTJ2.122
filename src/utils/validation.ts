// =====================================================
// DLTJ2.1
// STEP 2 — BATCH 2
// FILE: src/utils/validation.ts
// =====================================================

// =====================================================
// MOBILE NORMALIZATION
// =====================================================

export function normalizeMobile(
  mobile: string
): string {
  return mobile
    .replace(/\s+/g, "")
    .replace(/[-()]/g, "")
    .trim();
}

// =====================================================
// MOBILE VALIDATION
// =====================================================

export function validateMobile(
  mobile: string
): string | null {
  const normalized =
    normalizeMobile(mobile);

  if (!normalized) {
    return "Mobile number is required.";
  }

  // India mobile number:
  // 10 digits starting with 6, 7, 8 or 9
  const indianMobile =
    /^[6-9][0-9]{9}$/;

  if (!indianMobile.test(normalized)) {
    return "Enter a valid 10-digit mobile number.";
  }

  return null;
}

// =====================================================
// NAME VALIDATION
// =====================================================

export function validateName(
  name: string
): string | null {
  const value = name.trim();

  if (!value) {
    return "Name is required.";
  }

  if (value.length < 2) {
    return "Name must contain at least 2 characters.";
  }

  if (value.length > 60) {
    return "Name must not exceed 60 characters.";
  }

  const namePattern =
    /^[A-Za-z ]+$/;

  if (!namePattern.test(value)) {
    return "Name can contain letters and spaces only.";
  }

  return null;
}

// =====================================================
// PASSWORD VALIDATION
// =====================================================

export function validatePassword(
  password: string
): string | null {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  if (password.length > 128) {
    return "Password must not exceed 128 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  return null;
}

// =====================================================
// OTP VALIDATION
// =====================================================

export function validateOTP(
  otp: string
): string | null {
  const value = otp.trim();

  if (!value) {
    return "OTP is required.";
  }

  if (!/^[0-9]{6}$/.test(value)) {
    return "OTP must contain exactly 6 digits.";
  }

  return null;
}