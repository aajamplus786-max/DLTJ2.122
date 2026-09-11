
// =====================================================
// DLTJ2.10
// HIDDEN ADMIN LOGIN
// FILE: src/pages/Admin/AdminLogin.tsx
// UPDATED: 2026-09-11
// LOCATION: F:\DLTJ2.122\src\pages\Admin\AdminLogin.tsx
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ADMIN_SESSION_KEY,
} from "../../components/auth/AdminGuard";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// ADMIN LOGIN
// =====================================================

export default function AdminLogin() {
  const navigate =
    useNavigate();

  // ===================================================
  // FORM STATE
  // ===================================================

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  // ===================================================
  // CHECK EXISTING ADMIN SESSION
  // ===================================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        ADMIN_SESSION_KEY,
      );

    if (token) {
      navigate(
        "/admin",
        {
          replace: true,
        },
      );
    }
  }, [
    navigate,
  ]);

  // ===================================================
  // SUBMIT
  // ===================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    // -----------------------------------------------
    // USERNAME VALIDATION
    // -----------------------------------------------

    if (!username.trim()) {
      setError(
        "Username is required.",
      );

      return;
    }

    // -----------------------------------------------
    // PASSWORD VALIDATION
    // -----------------------------------------------

    if (!password) {
      setError(
        "Password is required.",
      );

      return;
    }

    setLoading(true);

    // =================================================
    // ADMIN LOGIN API
    // =================================================

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/admin/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username:
                username.trim(),

              password,
            }),
          },
        );

      const result =
        await response.json();

      // -----------------------------------------------
      // LOGIN FAILED
      // -----------------------------------------------

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.message ??
            result.error ??
            "Invalid administrator credentials.",
        );

        return;
      }

      // -----------------------------------------------
      // SAVE ADMIN SESSION
      // -----------------------------------------------

      if (!result.token) {
        setError(
          "Admin login succeeded, but no session token was received.",
        );

        return;
      }

      localStorage.setItem(
        ADMIN_SESSION_KEY,
        result.token,
      );

      // -----------------------------------------------
      // OPEN ADMIN DASHBOARD
      // -----------------------------------------------

      navigate(
        "/admin",
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "[DLTJ ADMIN LOGIN]",
        error,
      );

      setError(
        "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, #eef2ff, #f8fafc)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "16px",
          background:
            "rgba(255,255,255,0.96)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.15)",
          boxSizing: "border-box",
        }}
      >
        {/* ===========================================
            HEADER
        ============================================ */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <small
            style={{
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            DLTJ 2.10
          </small>

          <h1
            style={{
              margin:
                "8px 0",
            }}
          >
            Administrator Login
          </h1>

          <p
            style={{
              margin: 0,
              color: "#666",
            }}
          >
            Restricted administrator access.
          </p>
        </div>

        {/* ===========================================
            ERROR
        ============================================ */}

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "8px",
              background:
                "#fee2e2",
              color:
                "#991b1b",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* ===========================================
            USERNAME
        ============================================ */}

        <label
          style={{
            display: "block",
            marginBottom: "16px",
            fontWeight: 600,
          }}
        >
          Username

          <input
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value,
              )
            }
            autoComplete="username"
            disabled={loading}
            placeholder="Enter admin username"
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing:
                "border-box",
              fontSize: "15px",
            }}
          />
        </label>

        {/* ===========================================
            PASSWORD
        ============================================ */}

        <label
          style={{
            display: "block",
            marginBottom: "20px",
            fontWeight: 600,
          }}
        >
          Password

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            autoComplete="current-password"
            disabled={loading}
            placeholder="Enter admin password"
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing:
                "border-box",
              fontSize: "15px",
            }}
          />
        </label>

        {/* ===========================================
            LOGIN BUTTON
        ============================================ */}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "8px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            fontSize: "15px",
            fontWeight: 700,
            opacity: loading
              ? 0.7
              : 1,
          }}
        >
          {loading
            ? "Signing in..."
            : "Admin Login"}
        </button>
      </form>
    </main>
  );
}
