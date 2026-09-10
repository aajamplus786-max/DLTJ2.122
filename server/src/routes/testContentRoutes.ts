// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// TEST CONTENT ROUTES
// FILE: server/src/routes/testContentRoutes.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

import { Router } from "express";

import {
    getTest,
    getTechnologyTests,
    createTestController,
    updateTestController,
    deleteTestController,
    getTestQuestionsController,
    getTestQuestion,
    addQuestionToTestController,
    removeQuestionFromTestController,
    reorderTestQuestionsController,
} from "../controllers/testContentController";

const router = Router();

// =====================================================
// TEST ROUTES
// =====================================================

router.get(
    "/technology/:technologyId",
    getTechnologyTests,
);

router.post(
    "/",
    createTestController,
);

router.get(
    "/:testId/questions",
    getTestQuestionsController,
);

router.put(
    "/:testId/questions/reorder",
    reorderTestQuestionsController,
);

router.post(
    "/:testId/questions",
    addQuestionToTestController,
);

router.get(
    "/test-question/:id",
    getTestQuestion,
);

router.delete(
    "/test-question/:testQuestionId",
    removeQuestionFromTestController,
);

router.get(
    "/:id",
    getTest,
);

router.put(
    "/:id",
    updateTestController,
);

router.delete(
    "/:id",
    deleteTestController,
);

export default router;