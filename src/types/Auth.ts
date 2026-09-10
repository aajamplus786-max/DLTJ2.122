
// =====================================================
// DLTJ2.9
// AUTH TYPES
// FILE: src/types/Auth.ts
// =====================================================

// =====================================================
// REGISTER DATA
// =====================================================

export interface RegisterData {
  name: string;

  mobile: string;

  password: string;

  confirmPassword: string;
}

// =====================================================
// LOGIN CREDENTIALS
// =====================================================

export interface LoginCredentials {
  mobile: string;

  password: string;
}

// =====================================================
// AUTH CONTEXT VALUE
// =====================================================

export interface AuthContextValue {
  user: import("./User").User | null;

  session: import("./User").Session | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  // ===================================================
  // LOGIN
  // ===================================================

  login: (
    mobile: string,
    password: string
  ) => Promise<{
    success: boolean;

    message: string;

    requiresOTP?: boolean;

    userId?: string;

    otp?: string;

    expiresAt?: number;
  }>;

  // ===================================================
  // REGISTER
  // ===================================================

  register: (
    data: RegisterData
  ) => Promise<{
    success: boolean;

    message: string;

    userId?: string;

    otp?: string;

    expiresAt?: number;
  }>;

  // ===================================================
  // VERIFY OTP
  // ===================================================

  verifyOTP: (
    otp: string
  ) => Promise<{
    success: boolean;

    message: string;
  }>;

  // ===================================================
  // RESEND OTP
  // ===================================================

  resendOTP: () => Promise<{
    success: boolean;

    message: string;

    otp?: string;

    expiresAt?: number;
  }>;

  // ===================================================
  // LOGOUT
  // ===================================================

  logout: () => void;
}
