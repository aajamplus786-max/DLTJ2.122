
// =====================================================
// DLTJ2.2
// ADMIN AUTH ROUTES
// FILE: server/src/routes/adminAuthRoutes.ts
// =====================================================

import {
  Router,
} from "express";

import {
  adminLogin,
  adminStatus,
  adminLogout,
} from "../controllers/adminAuthController";

const router =
  Router();

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post(
  "/login",
  adminLogin,
);

// =====================================================
// ADMIN STATUS
// =====================================================

router.get(
  "/status",
  adminStatus,
);

// =====================================================
// ADMIN LOGOUT
// =====================================================

router.post(
  "/logout",
  adminLogout,
);

export default router;
