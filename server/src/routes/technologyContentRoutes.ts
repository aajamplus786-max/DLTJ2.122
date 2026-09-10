
// =====================================================
// FILE: server/src/routes/technologyContentRoutes.ts
// PROJECT: DLTJ2.10 Dynamic Learning System
// DATE: 2026-09-07
// LOCATION: server/src/routes
// =====================================================

import { Router } from "express";

import {
    getTechnologies,
    getTechnology,
    createTechnologyController,
    updateTechnologyController,
    deleteTechnologyController,
    reorderTechnologyController,
} from "../controllers/technologyContentController";

const router = Router();

// =====================================================
// GET ALL TECHNOLOGIES
// =====================================================

router.get(
    "/",
    getTechnologies
);

// =====================================================
// CREATE TECHNOLOGY
// =====================================================

router.post(
    "/",
    createTechnologyController
);

// =====================================================
// REORDER TECHNOLOGIES
// =====================================================

router.put(
    "/reorder",
    reorderTechnologyController
);

// =====================================================
// GET SINGLE TECHNOLOGY
// =====================================================

router.get(
    "/:id",
    getTechnology
);

// =====================================================
// UPDATE TECHNOLOGY
// =====================================================

router.put(
    "/:id",
    updateTechnologyController
);

// =====================================================
// DELETE TECHNOLOGY
// =====================================================

router.delete(
    "/:id",
    deleteTechnologyController
);

export default router;
