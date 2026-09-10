// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// CONTENT IMPORT ROUTES
// FILE: server/src/routes/contentImportRoutes.ts
// DATE: 2026-09-07
// =====================================================

import {
    Router,
} from "express";

import {
    importContentController,
} from "../controllers/contentImportController";

const router =
    Router();

// =====================================================
// CONTENT IMPORT
// =====================================================

router.post(
    "/:technologyId",
    importContentController,
);

export default router;