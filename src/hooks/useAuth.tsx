
// =====================================================
// DLTJ2.10
// USER AUTH FRONTEND
// FILE: src/hooks/useAuth.tsx
// DATE: 11-09-2026
// =====================================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AuthContextValue,
  RegisterData,
} from "../types/Auth";

import type {
  Session,
  User,
} from "../types/User";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// STORAGE KEYS
// =====================================================

const TOKEN_KEY =
  "dltj2_auth_token";

const PENDING_USER_KEY =
  "dltj2_pending_user_id";

const PENDING_MOBILE_KEY =
  "dltj2_pending_mobile";

const PENDING_OTP_KEY =
  "dltj2_pending_otp";

// =====================================================
// API RESPONSE
// =====================================================

interface ApiResponse {
  success: boolean;

  message: string;

  authenticated?: boolean;

  requiresOTP?: boolean;

  userId?: string;

  token?: string;

  user?: User;

  session?: Session;

  expiresAt?: number;

  // DEV MODE ONLY
  otp?: string;
}

// =====================================================
// AUTH CONTEXT
// =====================================================

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

// =====================================================
// API REQUEST
// =====================================================

async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse> {
  const token =
    localStorage.getItem(
      TOKEN_KEY,
    );

  const headers: HeadersInit = {
    "Content-Type":
      "application/json",

    ...(options.headers ?? {}),
  };

  if (token) {
    (
      headers as Record<
        string,
        string
      >
    ).Authorization =
      `Bearer ${token}`;
  }

  const response =
    await fetch(
      `${API_BASE}${endpoint}`,
      {
        ...options,
        headers,
      },
    );

  let data: ApiResponse;

  try {
    data =
      (await response.json()) as ApiResponse;
  } catch {
    return {
      success: false,
      message:
        "Invalid server response.",
    };
  }

  if (!response.ok) {
    return {
      ...data,
      success: false,
    };
  }

  return data;
}

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [session, setSession] =
    useState<Session | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // ===================================================
  // RESTORE LOGIN SESSION
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const token =
        localStorage.getItem(
          TOKEN_KEY,
        );

      if (!token) {
        if (mounted) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const result =
          await apiRequest(
            "/auth/status",
          );

        if (
          result.success &&
          result.authenticated &&
          result.user
        ) {
          if (!mounted) {
            return;
          }

          setUser(
            result.user,
          );

          if (result.session) {
            setSession(
              result.session,
            );
          }
        } else {
          localStorage.removeItem(
            TOKEN_KEY,
          );

          if (mounted) {
            setUser(null);
            setSession(null);
          }
        }
      } catch {
        // Keep token if server
        // is temporarily unavailable.
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // LOGIN
  // ===================================================

  async function login(
    mobile: string,
    password: string,
  ) {
    const result =
      await apiRequest(
        "/auth/login",
        {
          method: "POST",

          body: JSON.stringify({
            mobile,
            password,
          }),
        },
      );

    // -------------------------------------------------
    // OTP REQUIRED
    // -------------------------------------------------

    if (
      result.success &&
      result.requiresOTP
    ) {
      if (result.userId) {
        localStorage.setItem(
          PENDING_USER_KEY,
          result.userId,
        );
      }

      localStorage.setItem(
        PENDING_MOBILE_KEY,
        mobile,
      );

      // DEV OTP
      if (result.otp) {
        localStorage.setItem(
          PENDING_OTP_KEY,
          result.otp,
        );
      }
    }

    // -------------------------------------------------
    // DIRECT LOGIN
    // -------------------------------------------------

    if (
      result.success &&
      result.token &&
      result.user
    ) {
      localStorage.setItem(
        TOKEN_KEY,
        result.token,
      );

      setUser(
        result.user,
      );

      if (result.session) {
        setSession(
          result.session,
        );
      }
    }

    return {
      success:
        result.success,

      message:
        result.message,

      requiresOTP:
        result.requiresOTP,

      userId:
        result.userId,

      otp:
        result.otp,
    };
  }

  // ===================================================
  // REGISTER
  // ===================================================

  async function register(
    data: RegisterData,
  ) {
    const result =
      await apiRequest(
        "/auth/register",
        {
          method: "POST",

          body: JSON.stringify(data),
        },
      );

    // -------------------------------------------------
    // STORE OTP VERIFICATION DATA
    // -------------------------------------------------

    if (
      result.success
    ) {
      if (result.userId) {
        localStorage.setItem(
          PENDING_USER_KEY,
          result.userId,
        );
      }

      localStorage.setItem(
        PENDING_MOBILE_KEY,
        data.mobile,
      );

      // DEV OTP
      if (result.otp) {
        localStorage.setItem(
          PENDING_OTP_KEY,
          result.otp,
        );
      }
    }

    return {
      success:
        result.success,

      message:
        result.message,

      userId:
        result.userId,

      otp:
        result.otp,
    };
  }

  // ===================================================
  // VERIFY OTP
  // ===================================================

  async function verifyOTP(
    otp: string,
  ) {
    const userId =
      localStorage.getItem(
        PENDING_USER_KEY,
      );

    if (!userId) {
      return {
        success: false,

        message:
          "Login verification session expired.",
      };
    }

    const result =
      await apiRequest(
        "/auth/verify-otp",
        {
          method: "POST",

          body: JSON.stringify({
            userId,
            otp,
          }),
        },
      );

    // -------------------------------------------------
    // OTP SUCCESS
    // -------------------------------------------------

    if (
      result.success &&
      result.token
    ) {
      localStorage.setItem(
        TOKEN_KEY,
        result.token,
      );

      if (result.user) {
        setUser(
          result.user,
        );
      }

      if (result.session) {
        setSession(
          result.session,
        );
      }

      localStorage.removeItem(
        PENDING_USER_KEY,
      );

      localStorage.removeItem(
        PENDING_MOBILE_KEY,
      );

      localStorage.removeItem(
        PENDING_OTP_KEY,
      );
    }

    return {
      success:
        result.success,

      message:
        result.message,
    };
  }

  // ===================================================
  // RESEND OTP
  // ===================================================

  async function resendOTP() {
    const userId =
      localStorage.getItem(
        PENDING_USER_KEY,
      );

    const mobile =
      localStorage.getItem(
        PENDING_MOBILE_KEY,
      );

    if (
      !userId ||
      !mobile
    ) {
      return {
        success: false,

        message:
          "Login verification session expired.",
      };
    }

    const result =
      await apiRequest(
        "/auth/resend-otp",
        {
          method: "POST",

          body: JSON.stringify({
            userId,
            mobile,
          }),
        },
      );

    // -------------------------------------------------
    // STORE NEW DEV OTP
    // -------------------------------------------------

    if (
      result.success &&
      result.otp
    ) {
      localStorage.setItem(
        PENDING_OTP_KEY,
        result.otp,
      );
    }

    return {
      success:
        result.success,

      message:
        result.message,

      otp:
        result.otp,
    };
  }

  // ===================================================
  // LOGOUT
  // ===================================================

  async function logout() {
    try {
      await apiRequest(
        "/auth/logout",
        {
          method: "POST",
        },
      );
    } catch {
      // Ignore logout
      // network errors.
    }

    localStorage.removeItem(
      TOKEN_KEY,
    );

    localStorage.removeItem(
      PENDING_USER_KEY,
    );

    localStorage.removeItem(
      PENDING_MOBILE_KEY,
    );

    localStorage.removeItem(
      PENDING_OTP_KEY,
    );

    setUser(null);

    setSession(null);
  }

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,

        session,

        isAuthenticated:
          Boolean(user),

        isLoading,

        login,

        register,

        verifyOTP,

        resendOTP,

        logout,
      }),

      [
        user,
        session,
        isLoading,
      ],
    );

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth():
  AuthContextValue {
  const context =
    useContext(
      AuthContext,
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}
