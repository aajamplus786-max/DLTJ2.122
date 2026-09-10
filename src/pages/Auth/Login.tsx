
// =====================================================
// DLTJ2.10
// USER LOGIN PAGE
// FILE: src/pages/Auth/Login.tsx
// DATE: 2026-09-08
// =====================================================

import {
  useState,
  type DragEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";

import logo from "../../images/logo.png";

import "./Auth.css";

const ADMIN_KEY = "MYAATHIL";

export default function Login() {

  const navigate = useNavigate();

  const [isDragging, setIsDragging] =
    useState(false);

  const [showAdminKey, setShowAdminKey] =
    useState(false);

  const [adminKey, setAdminKey] =
    useState("");

  const [adminError, setAdminError] =
    useState("");

  // =====================================================
  // FIRST PAGE
  // =====================================================

  const handleFirstPage = () => {

    window.location.href =
      "/firstpage.html";

  };

  // =====================================================
  // ADMIN DRAG START
  // =====================================================

  const handleDragStart = (
    event: DragEvent<HTMLImageElement>,
  ) => {

    setIsDragging(true);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      "DLTJ-ADMIN-ACCESS",
    );

  };

  // =====================================================
  // ADMIN DRAG END
  // =====================================================

  const handleDragEnd = () => {

    setIsDragging(false);

  };

  // =====================================================
  // ADMIN DROP
  // =====================================================

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {

    event.preventDefault();

    setIsDragging(false);

    setShowAdminKey(true);

    setAdminError("");

    setTimeout(() => {

      document
        .getElementById(
          "admin-hidden-key",
        )
        ?.focus();

    }, 50);

  };

  // =====================================================
  // ADMIN KEY SUBMIT
  // =====================================================

  const handleAdminKeySubmit = () => {

    if (
      adminKey.trim() ===
      ADMIN_KEY
    ) {

      navigate(
        "/admin/login",
        {
          replace: true,
        },
      );

      return;

    }

    setAdminError(
      "Invalid access key.",
    );

    setAdminKey("");

  };

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <main className="auth-page">

      <div className="auth-background">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="auth-brand">

          <img
            src={logo}
            alt="DLTJ Logo"
            className={`auth-brand-logo-image ${
              isDragging
                ? "auth-logo-dragging"
                : ""
            }`}
            draggable
            onDragStart={
              handleDragStart
            }
            onDragEnd={
              handleDragEnd
            }
            title="WELCOME TO MY LEARN JOURNEY KEEP LEARN"
          />

        </div>

        {/* =================================================
            USER LOGIN FORM
        ================================================= */}

        <LoginForm />

        {/* =================================================
            APP TITLE
        ================================================= */}

        <div className="auth-brand-title">

          My Dev Learn Journey

        </div>

        {/* =================================================
            FIRST PAGE BUTTON
        ================================================= */}

        <button
          type="button"
          className="first-page-button"
          onClick={handleFirstPage}
        >
          ← FIRST PAGE
        </button>

        {/* =================================================
            ADMIN DROP AREA
        ================================================= */}

        <div
          className={`admin-drop-area ${
            isDragging
              ? "admin-drop-area-active"
              : ""
          } ${
            showAdminKey
              ? "admin-drop-area-open"
              : ""
          }`}
          onDragOver={(
            event,
          ) => {

            event.preventDefault();

            event.dataTransfer.dropEffect =
              "move";

          }}
          onDrop={handleDrop}
        >

          {!showAdminKey && (

            <span>
              AAJAMTHURINJI
            </span>

          )}

          {showAdminKey && (

            <div className="admin-hidden-access">

              <span className="admin-hidden-label">

                Administrator Access

              </span>

              <input
                id="admin-hidden-key"
                type="password"
                value={adminKey}
                onChange={(
                  event,
                ) => {

                  setAdminKey(
                    event.target.value,
                  );

                  setAdminError("");

                }}
                onKeyDown={(
                  event,
                ) => {

                  if (
                    event.key ===
                    "Enter"
                  ) {

                    handleAdminKeySubmit();

                  }

                }}
                placeholder="Enter access key"
                autoComplete="off"
              />

              <button
                type="button"
                onClick={
                  handleAdminKeySubmit
                }
              >
                Continue
              </button>

              {adminError && (

                <p className="admin-hidden-error">

                  {adminError}

                </p>

              )}

            </div>

          )}

        </div>

        {/* =================================================
            COPYRIGHT
        ================================================= */}

        <p className="auth-copyright">

          DLTJ 2.10 • Secure Learning

        </p>

      </div>

    </main>

  );

}
