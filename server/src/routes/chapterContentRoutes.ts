// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// CHAPTER CONTENT ROUTES
// FILE: server/src/routes/chapterContentRoutes.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

import { Router } from "express";

import {
    getChapters,
    getChapter,
    createChapterController,
    updateChapterController,
    deleteChapterController,
    reorderChapterController,
} from "../controllers/chapterContentController";

const router = Router();

// =====================================================
// CHAPTER ROUTES
// =====================================================

router.get(
    "/technology/:technologyId",
    getChapters,
);

router.post(
    "/",
    createChapterController,
);

router.put(
    "/technology/:technologyId/reorder",
    reorderChapterController,
);

router.get(
    "/:id",
    getChapter,
);

router.put(
    "/:id",
    updateChapterController,
);

router.delete(
    "/:id",
    deleteChapterController,
);

export default router;