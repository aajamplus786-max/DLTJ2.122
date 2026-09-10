// =====================================================
// DLTJ2.9
// USER OTP VERIFICATION
// FILE: src/components/auth/OTPVerification.tsx
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
  useAuth,
} from "../../hooks/useAuth";

import SecurityTimer from "./SecurityTimer";

// =====================================================
// CONSTANTS
// =====================================================

const PENDING_OTP_KEY =
  "dltj2_pending_otp";

const OTP_DURATION =
  1000 * 60 * 5;

// =====================================================
// OTP VERIFICATION
// =====================================================

export default function OTPVerification() {
  const navigate =
    useNavigate();

  const {
    verifyOTP,
    resendOTP,
    isAuthenticated,
  } = useAuth();

  // ===================================================
  // STATE
  // ===================================================

  const [otp, setOtp] =
    useState("");

  const [devOTP, setDevOTP] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [expiresAt, setExpiresAt] =
    useState(
      Date.now() + OTP_DURATION,
    );

  // ===================================================
  // LOAD OTP
  // ===================================================

  useEffect(() => {
    const savedOTP =
      localStorage.getItem(
        PENDING_OTP_KEY,
      );

    if (savedOTP) {
      setDevOTP(savedOTP);
    }
  }, []);

  // ===================================================
  // AUTHENTICATION REDIRECT
  // ===================================================

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  // ===================================================
  // VERIFY OTP
  // ===================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    // -------------------------------------------------
    // OTP VALIDATION
    // -------------------------------------------------

    if (otp.length !== 6) {
      setError(
        "Enter the 6-digit OTP.",
      );

      return;
    }

    setLoading(true);

    try {
      const result =
        await verifyOTP(otp);

      if (!result.success) {
        setError(
          result.message,
        );

        return;
      }

      // ------------------------------------------------
      // OTP VERIFIED
      // ------------------------------------------------

      localStorage.removeItem(
        PENDING_OTP_KEY,
      );

      setDevOTP("");

      navigate("/", {
        replace: true,
      });
    } catch {
      setError(
        "Unable to verify OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // RESEND OTP
  // ===================================================

  async function handleResend() {
    setError("");
    setMessage("");

    setLoading(true);

    try {
      const result =
        await resendOTP();

      if (!result.success) {
        setError(
          result.message,
        );

        return;
      }

      // ------------------------------------------------
      // CLEAR OLD INPUT
      // ------------------------------------------------

      setOtp("");

      // ------------------------------------------------
      // READ NEW OTP FROM LOCAL STORAGE
      // ------------------------------------------------

      const savedOTP =
        localStorage.getItem(
          PENDING_OTP_KEY,
        );

      if (savedOTP) {
        setDevOTP(savedOTP);
      } else {
        setDevOTP("");
      }

      // ------------------------------------------------
      // RESET TIMER
      // ------------------------------------------------

      setExpiresAt(
        Date.now() + OTP_DURATION,
      );

      setMessage(
        "A new OTP has been generated.",
      );
    } catch {
      setError(
        "Unable to resend OTP. Please try again.",
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
      className="auth-form"
      onSubmit={handleSubmit}
      noValidate
    >

      {/* =================================================
          TITLE
      ================================================= */}

      <div className="auth-title">

        <span>
          SECURITY VERIFICATION
        </span>

        <h1>
          Verify OTP
        </h1>

        <p>
          Enter the 6-digit verification
          code sent to your mobile number.
        </p>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (
        <div
          className="auth-success"
          role="status"
        >
          {message}
        </div>
      )}

      {/* =================================================
          DEV OTP BOX
      ================================================= */}

      {devOTP && (
        <div
          className="auth-success"
          role="status"
          style={{
            textAlign: "center",
            marginBottom: "16px",
            padding: "16px",
          }}
        >

          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            DEV OTP
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "6px",
            }}
          >
            {devOTP}
          </div>

          <div
            style={{
              fontSize: "11px",
              marginTop: "8px",
            }}
          >
            Testing mode — SMS is not connected.
          </div>

        </div>
      )}

      {/* =================================================
          OTP INPUT
      ================================================= */}

      <label>
        Verification Code

        <input
          className="otp-input"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(event) => {
            const value =
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

            setOtp(value);
          }}
          placeholder="000000"
          autoComplete="one-time-code"
          disabled={loading}
          required
        />

      </label>

      {/* =================================================
          TIMER
      ================================================= */}

      <div className="otp-timer">
        Code expires in{" "}

        <SecurityTimer
          expiresAt={expiresAt}
        />

      </div>

      {/* =================================================
          VERIFY BUTTON
      ================================================= */}

      <button
        type="submit"
        className="auth-primary-button"
        disabled={
          loading ||
          otp.length !== 6
        }
      >
        {loading
          ? "Verifying..."
          : "Verify & Login"}
      </button>

      {/* =================================================
          RESEND BUTTON
      ================================================= */}

      <button
        type="button"
        className="auth-secondary-button"
        onClick={handleResend}
        disabled={loading}
      >
        {loading
          ? "Please wait..."
          : "Resend OTP"}
      </button>

      {/* =================================================
          BACK TO LOGIN
      ================================================= */}

      <button
        type="button"
        className="auth-text-button"
        onClick={() =>
          navigate("/login")
        }
        disabled={loading}
      >
        Back to Login
      </button>

    </form>
  );
}