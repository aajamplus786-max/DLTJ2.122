// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 14
// FILE: server/src/routes/shareRoutes.ts
// DATE: 2026-08-31
// =====================================================

import {
  Router,
} from "express";

import {
  createShareController,
  getProjectSharesController,
  revokeShareController,
} from "../controllers/shareController";

const router =
  Router();

router.post(
  "/",
  createShareController,
);

router.get(
  "/project/:projectId",
  getProjectSharesController,
);

router.delete(
  "/:shareId",
  revokeShareController,
);

export default router;