
// =====================================================
// DLTJ2.2
// USER AUTHENTICATION CONTROLLER
// FILE: server/src/controllers/authController.ts
// =====================================================

import type {
  Request,
  Response,
} from "express";

import {
  registerUser,
  loginUser,
  verifyLoginOTP,
  getUserById,
  getUserFromSession,
  logoutUser,
} from "../services/authService";

import {
  resendOTP,
} from "../services/otpService";

// =====================================================
// HELPERS
// =====================================================

function getBearerToken(
  request: Request,
): string | null {
  const authorization =
    request.headers.authorization;

  if (!authorization) {
    return null;
  }

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return null;
  }

  const token =
    authorization
      .slice(7)
      .trim();

  return token || null;
}

// =====================================================
// REGISTER
// =====================================================

export async function register(
  request: Request,
  response: Response,
) {
  try {
    const {
      name,
      mobile,
      password,
    } = request.body ?? {};

    if (
      typeof name !== "string" ||
      typeof mobile !== "string" ||
      typeof password !== "string"
    ) {
      return response.status(400).json({
        success: false,
        message:
          "Name, mobile number and password are required.",
      });
    }

    const result =
      await registerUser(
        name,
        mobile,
        password,
      );

    if (!result.success) {
      return response.status(400).json(
        result,
      );
    }

    return response.status(201).json(
      result,
    );
  } catch (error) {
    console.error(
      "[AUTH REGISTER ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      message:
        "Unable to create account. Please try again.",
    });
  }
}

// =====================================================
// LOGIN
// =====================================================

export async function login(
  request: Request,
  response: Response,
) {
  try {
    const {
      mobile,
      password,
    } = request.body ?? {};

    if (
      typeof mobile !== "string" ||
      typeof password !== "string"
    ) {
      return response.status(400).json({
        success: false,
        message:
          "Mobile number and password are required.",
      });
    }

    const result =
      await loginUser(
        mobile,
        password,
      );

    if (!result.success) {
      return response.status(401).json(
        result,
      );
    }

    return response.status(200).json(
      result,
    );
  } catch (error) {
    console.error(
      "[AUTH LOGIN ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      message:
        "Unable to sign in. Please try again.",
    });
  }
}

// =====================================================
// VERIFY OTP
// =====================================================

export async function verifyOTP(
  request: Request,
  response: Response,
) {
  try {
    const {
      userId,
      otp,
    } = request.body ?? {};

    if (
      typeof userId !== "string" ||
      typeof otp !== "string"
    ) {
      return response.status(400).json({
        success: false,
        message:
          "User ID and OTP are required.",
      });
    }

    const result =
      await verifyLoginOTP(
        userId,
        otp,
      );

    if (!result.success) {
      return response.status(400).json(
        result,
      );
    }

    return response.status(200).json(
      result,
    );
  } catch (error) {
    console.error(
      "[AUTH OTP ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      message:
        "Unable to verify OTP. Please try again.",
    });
  }
}

// =====================================================
// RESEND OTP
// =====================================================

export async function resend(
  request: Request,
  response: Response,
) {
  try {
    const {
      userId,
    } = request.body ?? {};

    if (
      typeof userId !== "string"
    ) {
      return response.status(400).json({
        success: false,
        message:
          "User ID is required.",
      });
    }

    const user =
      await getUserById(
        userId,
      );

    if (!user) {
      return response.status(404).json({
        success: false,
        message:
          "User account was not found.",
      });
    }

    const result =
      await resendOTP(
        user.id,
        user.mobile,
      );

    return response.status(200).json(
      result,
    );
  } catch (error) {
    console.error(
      "[AUTH RESEND OTP ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      message:
        "Unable to resend OTP. Please try again.",
    });
  }
}

// =====================================================
// STATUS
// =====================================================

export async function status(
  request: Request,
  response: Response,
) {
  try {
    const token =
      getBearerToken(
        request,
      );

    if (!token) {
      return response.status(401).json({
        success: false,
        authenticated: false,
        message:
          "Authentication token is required.",
      });
    }

    const user =
      await getUserFromSession(
        token,
      );

    if (!user) {
      return response.status(401).json({
        success: false,
        authenticated: false,
        message:
          "Session is invalid or expired.",
      });
    }

    return response.status(200).json({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error(
      "[AUTH STATUS ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      authenticated: false,
      message:
        "Unable to check authentication status.",
    });
  }
}

// =====================================================
// LOGOUT
// =====================================================

export async function logout(
  request: Request,
  response: Response,
) {
  try {
    const token =
      getBearerToken(
        request,
      );

    if (!token) {
      return response.status(401).json({
        success: false,
        message:
          "Authentication token is required.",
      });
    }

    await logoutUser(
      token,
    );

    return response.status(200).json({
      success: true,
      message:
        "Logged out successfully.",
    });
  } catch (error) {
    console.error(
      "[AUTH LOGOUT ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      message:
        "Unable to logout. Please try again.",
    });
  }
}
