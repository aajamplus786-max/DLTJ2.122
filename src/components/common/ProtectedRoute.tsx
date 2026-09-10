// =====================================================
// DLTJ2.1
// STEP 2
// FILE: src/components/common/ProtectedRoute.tsx
// =====================================================

import type { ReactNode } from "react";

import AuthGuard from "../auth/AuthGuard";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}