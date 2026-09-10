
// =====================================================
// DLTJ2.2
// ADMIN AUTHENTICATION MODELS
// FILE: server/src/models/Admin.ts
// =====================================================

export interface Admin {
  id: string;

  username: string;

  passwordHash: string;

  createdAt: string;

  active: boolean;
}

// =====================================================
// ADMIN SESSION
// =====================================================

export interface AdminSession {
  token: string;

  adminId: string;

  username: string;

  createdAt: number;

  expiresAt: number;
}
