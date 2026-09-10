// =====================================================
// DLTJ2.1
// STEP 2
// FILE: src/components/auth/AuthGuard.tsx
// =====================================================

import type { ReactNode } from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const location = useLocation();

  const auth = useAuth();

  const {
    isAuthenticated,
    isLoading,
  } = auth;

  if (isLoading) {
    return (
      <div className="auth-loading">
        Checking secure session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <>{children}</>;
}