// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/routes/executionRoutes.ts
// DATE: 2026-08-31
// =====================================================

import { Router } from "express";

import {
  executeCodeController,
  supportedLanguagesController,
} from "../controllers/executionController";

import {
  executionRateLimit,
} from "../middleware/rateLimitMiddleware";

import {
  validateExecutionRequest,
} from "../middleware/validationMiddleware";

const router = Router();

router.get(
  "/languages",
  supportedLanguagesController,
);

router.post(
  "/run",
  executionRateLimit,
  validateExecutionRequest,
  executeCodeController,
);

export default router;