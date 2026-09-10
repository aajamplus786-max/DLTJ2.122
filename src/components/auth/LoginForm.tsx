// =====================================================
// DLTJ2.2
// USER LOGIN
// FILE: src/components/auth/LoginForm.tsx
// =====================================================

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [mobile, setMobile] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanMobile =
      mobile.replace(/\D/g, "");

    if (
      cleanMobile.length !== 10
    ) {
      setError(
        "Enter a valid 10-digit mobile number.",
      );
      return;
    }

    if (!password) {
      setError(
        "Password is required.",
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await login(
          cleanMobile,
          password,
        );

      if (!result.success) {
        setError(
          result.message,
        );
        return;
      }

      if (
        result.requiresOTP
      ) {
        navigate(
          "/verify-otp",
          {
            replace: true,
          },
        );
        return;
      }

      navigate("/", {
        replace: true,
      });
    } catch {
      setError(
        "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="auth-title">
        <span>
          DLTJ 2.2
        </span>

        <h1>
          Welcome Back
        </h1>

        <p>
          Sign in to continue your
          learning journey.
        </p>
      </div>

      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <label>
        Mobile Number

        <input
          type="tel"
          value={mobile}
          onChange={(event) => {
            setMobile(
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 10),
            );
          }}
          placeholder="Enter 10-digit mobile number"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          disabled={loading}
          required
        />
      </label>

      <label>
        Password

        <input
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={loading}
          required
        />
      </label>

      <button
        type="submit"
        className="auth-primary-button"
        disabled={loading}
      >
        {loading
          ? "Checking..."
          : "Continue"}
      </button>

      <p className="auth-footer-text">
        Don't have an account?{" "}

        <Link to="/register">
          Create Account
        </Link>
      </p>
    </form>
  );
}