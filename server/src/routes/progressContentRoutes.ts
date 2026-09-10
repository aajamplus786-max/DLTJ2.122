// =====================================================
// DLTJ2.10
// PROGRESS CONTENT ROUTES
// FILE: server/src/routes/progressContentRoutes.ts
// UPDATED: 2026-09-06
// LOCATION: E:\DLTJ2.122\server\src\routes\progressContentRoutes.ts
// =====================================================

import {
  Router,
} from "express";

import {
  getProgress,
  saveProgressController,
  completeLessonController,
  completeChapterController,
  savePracticeController,
  saveChapterTestController,
  saveFinalTestController,
  getLockState,
} from "../controllers/progressContentController";

// =====================================================
// ROUTER
// =====================================================

const router =
  Router();

// =====================================================
// LOCK STATE
// IMPORTANT: BEFORE /:userId
// =====================================================

router.get(
  "/state/check",
  getLockState,
);

// =====================================================
// LESSON COMPLETION
// =====================================================

router.post(
  "/lesson",
  completeLessonController,
);

// =====================================================
// CHAPTER COMPLETION
// =====================================================

router.post(
  "/chapter",
  completeChapterController,
);

// =====================================================
// PRACTICE
// =====================================================

router.post(
  "/practice",
  savePracticeController,
);

// =====================================================
// CHAPTER TEST
// =====================================================

router.post(
  "/chapter-test",
  saveChapterTestController,
);

// =====================================================
// FINAL TEST
// =====================================================

router.post(
  "/final-test",
  saveFinalTestController,
);

// =====================================================
// SAVE GENERIC PROGRESS
// =====================================================

router.post(
  "/",
  saveProgressController,
);

// =====================================================
// GET USER PROGRESS
// IMPORTANT: LAST
// =====================================================

router.get(
  "/:userId",
  getProgress,
);

// =====================================================
// EXPORT
// =====================================================

export default router;