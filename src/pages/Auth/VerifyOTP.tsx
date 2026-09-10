// =====================================================
// DLTJ2.1
// STEP 2
// FILE: src/pages/Auth/VerifyOTP.tsx
// =====================================================

import OTPVerification from "../../components/auth/OTPVerification";

import "./Auth.css";

export default function VerifyOTP() {
  return (
    <main className="auth-page">
      <div className="auth-background">

        <div className="auth-brand">
          <div className="auth-brand-logo">
            D
          </div>

          <div>
            <strong>DLTJ</strong>
            <span>
              My Dev Learn Journey
            </span>
          </div>
        </div>

        <OTPVerification />

        <p className="auth-copyright">
          DLTJ 2.1 • Secure Verification
        </p>

      </div>
    </main>
  );
}