// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// QUESTION CONTENT ROUTES
// FILE: server/src/routes/questionContentRoutes.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

import { Router } from "express";

import {
    getQuestion,
    getChapterQuestions,
    getTechnologyQuestions,
    createQuestionController,
    updateQuestionController,
    deleteQuestionController,
} from "../controllers/questionContentController";

const router = Router();

// =====================================================
// QUESTION ROUTES
// =====================================================

router.get(
    "/technology/:technologyId",
    getTechnologyQuestions,
);

router.get(
    "/chapter/:chapterId",
    getChapterQuestions,
);

router.post(
    "/",
    createQuestionController,
);

router.get(
    "/:id",
    getQuestion,
);

router.put(
    "/:id",
    updateQuestionController,
);

router.delete(
    "/:id",
    deleteQuestionController,
);

export default router;