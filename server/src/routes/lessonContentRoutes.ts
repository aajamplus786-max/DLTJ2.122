// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// LESSON CONTENT ROUTES
// FILE: server/src/routes/lessonContentRoutes.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

import { Router } from "express";

import {
    getLessons,
    getLesson,
    createLessonController,
    updateLessonController,
    deleteLessonController,
    reorderLessonController,
} from "../controllers/lessonContentController";

const router = Router();

// =====================================================
// LESSON ROUTES
// =====================================================

router.get(
    "/chapter/:chapterId",
    getLessons,
);

router.post(
    "/",
    createLessonController,
);

router.put(
    "/chapter/:chapterId/reorder",
    reorderLessonController,
);

router.get(
    "/:id",
    getLesson,
);

router.put(
    "/:id",
    updateLessonController,
);

router.delete(
    "/:id",
    deleteLessonController,
);

export default router;