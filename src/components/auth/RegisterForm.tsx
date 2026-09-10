// =====================================================
// DLTJ2.1
// STEP 2 — BATCH 3
// FILE: src/components/auth/RegisterForm.tsx
// =====================================================

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  validateMobile,
  validateName,
  validatePassword,
} from "../../utils/validation";

// =====================================================
// PROPS
// =====================================================

interface RegisterFormProps {
  onSuccess?: () => void;

  onLogin?: () => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function RegisterForm({
  onSuccess,
  onLogin,
}: RegisterFormProps) {
  const {
    register,
  } = useAuth();

  // ===================================================
  // FORM STATE
  // ===================================================

  const [name, setName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  // ===================================================
  // SUBMIT
  // ===================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------------------------
    // CLIENT VALIDATION
    // -----------------------------------------------

    const nameError =
      validateName(name);

    if (nameError) {
      setError(
        nameError
      );
      return;
    }

    const mobileError =
      validateMobile(
        mobile
      );

    if (mobileError) {
      setError(
        mobileError
      );
      return;
    }

    const passwordError =
      validatePassword(
        password
      );

    if (passwordError) {
      setError(
        passwordError
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    // -----------------------------------------------
    // REGISTER
    // -----------------------------------------------

    setLoading(true);

    try {
      const result =
        await register({
          name,
          mobile,
          password,
          confirmPassword,
        });

      if (!result.success) {
        setError(
          result.message
        );
        return;
      }

      setSuccess(
        result.message
      );

      setName("");
      setMobile("");
      setPassword("");
      setConfirmPassword("");

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-form"
      noValidate
    >
      {/* =============================================
          NAME
      ============================================== */}

      <div className="auth-field">
        <label htmlFor="register-name">
          Full Name
        </label>

        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value
            )
          }
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={loading}
        />
      </div>

      {/* =============================================
          MOBILE
      ============================================== */}

      <div className="auth-field">
        <label htmlFor="register-mobile">
          Mobile Number
        </label>

        <input
          id="register-mobile"
          type="tel"
          value={mobile}
          onChange={(event) =>
            setMobile(
              event.target.value
            )
          }
          placeholder="10-digit mobile number"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          disabled={loading}
        />

        <small>
          OTP will be used to verify
          your mobile number.
        </small>
      </div>

      {/* =============================================
          PASSWORD
      ============================================== */}

      <div className="auth-field">
        <label htmlFor="register-password">
          Password
        </label>

        <div className="auth-password-wrapper">
          <input
            id="register-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Create a strong password"
            autoComplete="new-password"
            disabled={loading}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (value) =>
                  !value
              )
            }
            disabled={loading}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>

        <small>
          Minimum 8 characters,
          including uppercase,
          lowercase and number.
        </small>
      </div>

      {/* =============================================
          CONFIRM PASSWORD
      ============================================== */}

      <div className="auth-field">
        <label htmlFor="register-confirm-password">
          Confirm Password
        </label>

        <div className="auth-password-wrapper">
          <input
            id="register-confirm-password"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={
              confirmPassword
            }
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={loading}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (value) =>
                  !value
              )
            }
            disabled={loading}
            aria-label={
              showConfirmPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showConfirmPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>
      </div>

      {/* =============================================
          ERROR
      ============================================== */}

      {error && (
        <div
          className="auth-message auth-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* =============================================
          SUCCESS
      ============================================== */}

      {success && (
        <div
          className="auth-message auth-success"
          role="status"
        >
          {success}
        </div>
      )}

      {/* =============================================
          REGISTER BUTTON
      ============================================== */}

      <button
        type="submit"
        className="auth-submit-button"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

      {/* =============================================
          LOGIN
      ============================================== */}

      {onLogin && (
        <div className="auth-switch">
          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={onLogin}
            disabled={loading}
          >
            Login
          </button>
        </div>
      )}
    </form>
  );
}