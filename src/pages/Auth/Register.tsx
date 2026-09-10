// =====================================================
// DLTJ2.1
// STEP 2
// FILE: src/pages/Auth/Register.tsx
// =====================================================

import {
  useNavigate,
} from "react-router-dom";

import RegisterForm from "../../components/auth/RegisterForm";

import "./Auth.css";

// =====================================================
// COMPONENT
// =====================================================

export default function Register() {
  const navigate =
    useNavigate();

  // ===================================================
  // REGISTRATION SUCCESS
  // ===================================================

  const handleSuccess = () => {
    navigate(
      "/verify-otp",
      {
        replace: true,
      }
    );
  };

  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = () => {
    navigate(
      "/login"
    );
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="auth-page">

      <div className="auth-background">

        {/* =============================================
            BRAND
        ============================================== */}

        <div className="auth-brand">

          <div className="auth-brand-logo">
            D
          </div>

          <div>
            <strong>
              DLTJ
            </strong>

            <span>
              My Dev Learn Journey
            </span>
          </div>

        </div>

        {/* =============================================
            REGISTER FORM
        ============================================== */}

        <RegisterForm
          onSuccess={
            handleSuccess
          }
          onLogin={
            handleLogin
          }
        />

        {/* =============================================
            COPYRIGHT
        ============================================== */}

        <p className="auth-copyright">
          DLTJ 2.1 • Secure Learning
        </p>

      </div>

    </main>
  );
}