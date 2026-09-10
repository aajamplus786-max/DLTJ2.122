// =====================================================
// DLTJ2.2
// ADMIN ROUTE GUARD
// FILE: src/components/auth/AdminGuard.tsx
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE_URL =
  "http://localhost:3000";

// =====================================================
// ADMIN SESSION KEY
// =====================================================

export const ADMIN_SESSION_KEY =
  "dltj_admin_token";

// =====================================================
// PROPS
// =====================================================

interface AdminGuardProps {
  children: ReactNode;
}

// =====================================================
// ADMIN GUARD
// =====================================================

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const [
    checking,
    setChecking,
  ] = useState(true);

  const [
    authenticated,
    setAuthenticated,
  ] = useState(false);

  // ===================================================
  // CHECK ADMIN SESSION
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      const token =
        localStorage.getItem(
          ADMIN_SESSION_KEY,
        );

      // -----------------------------------------------
      // NO TOKEN
      // -----------------------------------------------

      if (!token) {
        if (mounted) {
          setAuthenticated(false);
          setChecking(false);
        }

        return;
      }

      // -----------------------------------------------
      // CHECK TOKEN WITH BACKEND
      // -----------------------------------------------

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/admin/auth/status`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        const result =
          await response.json();

        // ---------------------------------------------
        // INVALID SESSION
        // ---------------------------------------------

        if (
          !response.ok ||
          !result.success ||
          !result.authenticated
        ) {
          localStorage.removeItem(
            ADMIN_SESSION_KEY,
          );

          if (mounted) {
            setAuthenticated(false);
          }
        } else {
          // -------------------------------------------
          // VALID SESSION
          // -------------------------------------------

          if (mounted) {
            setAuthenticated(true);
          }
        }
      } catch {
        // ---------------------------------------------
        // SERVER / NETWORK ERROR
        // ---------------------------------------------

        localStorage.removeItem(
          ADMIN_SESSION_KEY,
        );

        if (mounted) {
          setAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    void checkAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // CHECKING
  // ===================================================

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        Checking administrator access...
      </div>
    );
  }

  // ===================================================
  // NOT AUTHENTICATED
  // ===================================================

  if (!authenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // ===================================================
  // AUTHENTICATED
  // ===================================================

  return <>{children}</>;
}