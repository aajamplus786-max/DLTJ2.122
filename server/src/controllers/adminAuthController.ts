
// =====================================================
// DLTJ2.2
// ADMIN AUTHENTICATION CONTROLLER
// FILE: server/src/controllers/adminAuthController.ts
// =====================================================

import type {
  Request,
  Response,
} from "express";

import {
  loginAdmin,
  getAdminFromSession,
  logoutAdmin,
} from "../services/adminAuthService";

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
// ADMIN LOGIN
// =====================================================

export async function adminLogin(
  request: Request,
  response: Response,
) {
  try {
    const {
      username,
      password,
    } = request.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return response.status(400).json({
        success: false,
        message:
          "Username and password are required.",
      });
    }

    const result =
      await loginAdmin(
        username,
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
      "[ADMIN LOGIN ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      message:
        "Unable to sign in as administrator.",
    });
  }
}

// =====================================================
// ADMIN STATUS
// =====================================================

export async function adminStatus(
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
          "Admin authentication token is required.",
      });
    }

    const admin =
      await getAdminFromSession(
        token,
      );

    if (!admin) {
      return response.status(401).json({
        success: false,
        authenticated: false,
        message:
          "Admin session is invalid or expired.",
      });
    }

    return response.status(200).json({
      success: true,
      authenticated: true,
      admin,
    });
  } catch (error) {
    console.error(
      "[ADMIN STATUS ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      authenticated: false,
      message:
        "Unable to check admin authentication status.",
    });
  }
}

// =====================================================
// ADMIN LOGOUT
// =====================================================

export async function adminLogout(
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
          "Admin authentication token is required.",
      });
    }

    await logoutAdmin(
      token,
    );

    return response.status(200).json({
      success: true,
      message:
        "Admin logged out successfully.",
    });
  } catch (error) {
    console.error(
      "[ADMIN LOGOUT ERROR]",
      error,
    );

    return response.status(500).json({
      success: false,
      message:
        "Unable to logout administrator.",
    });
  }
}
