// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 15
// FILE: server/src/routes/deploymentRoutes.ts
// DATE: 2026-08-31
// =====================================================

import {
  Router,
} from "express";

import {
  createDeploymentController,
  getDeploymentStatusController,
  cancelDeploymentController,
} from "../controllers/deploymentController";

// =====================================================
// ROUTER
// =====================================================

const router =
  Router();

// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  createDeploymentController,
);

// =====================================================
// STATUS
// =====================================================

router.get(
  "/:deploymentId",
  getDeploymentStatusController,
);

// =====================================================
// CANCEL
// =====================================================

router.post(
  "/:deploymentId/cancel",
  cancelDeploymentController,
);

export default router;