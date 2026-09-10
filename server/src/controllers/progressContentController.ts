// =====================================================
// DLTJ2.10
// PROGRESS CONTENT CONTROLLER
// FILE: server/src/controllers/progressContentController.ts
// UPDATED: 2026-09-06
// LOCATION: E:\DLTJ2.122\server\src\controllers\progressContentController.ts
// =====================================================

import type {
  Request,
  Response,
} from "express";

import {
  getUserProgress,
  saveProgress,
  completeLesson,
  completeChapter,
  savePracticeProgress,
  saveChapterTestProgress,
  saveFinalTestProgress,
  isLessonCompleted,
  isChapterCompleted,
  hasPassedChapterTest,
  hasPassedFinalTest,
} from "../services/progressContentService";

// =====================================================
// GET USER PROGRESS
// =====================================================

export async function getProgress(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId =
      String(
        req.params.userId ??
        req.query.userId ??
        req.body?.userId ??
        "",
      ).trim();

    if (!userId) {
      res.status(400).json({
        success: false,
        message:
          "userId is required.",
      });
      return;
    }

    const progress =
      await getUserProgress(
        userId,
      );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "[PROGRESS GET ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load user progress.",
    });
  }
}

// =====================================================
// SAVE GENERIC PROGRESS
// =====================================================

export async function saveProgressController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      userId,
      technologyId,
      chapterId,
      lessonId,
      testId,
      progressType,
      completed,
      score,
      passed,
    } = req.body ?? {};

    if (
      !userId ||
      !technologyId ||
      !progressType
    ) {
      res.status(400).json({
        success: false,
        message:
          "userId, technologyId and progressType are required.",
      });
      return;
    }

    const result =
      await saveProgress({
        userId:
          String(userId),

        technologyId:
          String(technologyId),

        chapterId:
          chapterId == null
            ? null
            : String(chapterId),

        lessonId:
          lessonId == null
            ? null
            : String(lessonId),

        testId:
          testId == null
            ? null
            : String(testId),

        progressType,

        completed:
          completed !== false,

        score:
          score == null
            ? null
            : Number(score),

        passed:
          passed == null
            ? null
            : Boolean(passed),
      });

    res.json({
      success: true,
      progress: result,
    });
  } catch (error) {
    console.error(
      "[PROGRESS SAVE ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save progress.",
    });
  }
}

// =====================================================
// COMPLETE LESSON
// =====================================================

export async function completeLessonController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      userId,
      technologyId,
      chapterId,
      lessonId,
    } = req.body ?? {};

    if (
      !userId ||
      !technologyId ||
      !chapterId ||
      !lessonId
    ) {
      res.status(400).json({
        success: false,
        message:
          "userId, technologyId, chapterId and lessonId are required.",
      });
      return;
    }

    const progress =
      await completeLesson(
        String(userId),
        String(technologyId),
        String(chapterId),
        String(lessonId),
      );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "[LESSON COMPLETE ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to complete lesson.",
    });
  }
}

// =====================================================
// COMPLETE CHAPTER
// =====================================================

export async function completeChapterController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      userId,
      technologyId,
      chapterId,
    } = req.body ?? {};

    if (
      !userId ||
      !technologyId ||
      !chapterId
    ) {
      res.status(400).json({
        success: false,
        message:
          "userId, technologyId and chapterId are required.",
      });
      return;
    }

    const progress =
      await completeChapter(
        String(userId),
        String(technologyId),
        String(chapterId),
      );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "[CHAPTER COMPLETE ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to complete chapter.",
    });
  }
}

// =====================================================
// PRACTICE RESULT
// =====================================================

export async function savePracticeController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      userId,
      technologyId,
      chapterId,
      score,
    } = req.body ?? {};

    if (
      !userId ||
      !technologyId ||
      !chapterId
    ) {
      res.status(400).json({
        success: false,
        message:
          "userId, technologyId and chapterId are required.",
      });
      return;
    }

    const progress =
      await savePracticeProgress(
        String(userId),
        String(technologyId),
        String(chapterId),
        Number(score ?? 0),
      );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "[PRACTICE PROGRESS ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save practice progress.",
    });
  }
}

// =====================================================
// CHAPTER TEST RESULT
// =====================================================

export async function saveChapterTestController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      userId,
      technologyId,
      chapterId,
      testId,
      score,
      passed,
    } = req.body ?? {};

    if (
      !userId ||
      !technologyId ||
      !chapterId
    ) {
      res.status(400).json({
        success: false,
        message:
          "userId, technologyId and chapterId are required.",
      });
      return;
    }

    const progress =
      await saveChapterTestProgress(
        String(userId),
        String(technologyId),
        String(chapterId),
        testId == null
          ? null
          : String(testId),
        Number(score ?? 0),
        Boolean(passed),
      );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "[CHAPTER TEST PROGRESS ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save chapter test progress.",
    });
  }
}

// =====================================================
// FINAL TEST RESULT
// =====================================================

export async function saveFinalTestController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      userId,
      technologyId,
      testId,
      score,
      passed,
    } = req.body ?? {};

    if (
      !userId ||
      !technologyId
    ) {
      res.status(400).json({
        success: false,
        message:
          "userId and technologyId are required.",
      });
      return;
    }

    const progress =
      await saveFinalTestProgress(
        String(userId),
        String(technologyId),
        testId == null
          ? null
          : String(testId),
        Number(score ?? 0),
        Boolean(passed),
      );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "[FINAL TEST PROGRESS ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save final test progress.",
    });
  }
}

// =====================================================
// CHECK PROGRESS / LOCK STATE
// =====================================================

export async function getLockState(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId =
      String(
        req.query.userId ??
        "",
      ).trim();

    const technologyId =
      String(
        req.query.technologyId ??
        "",
      ).trim();

    const chapterId =
      req.query.chapterId == null
        ? ""
        : String(
            req.query.chapterId,
          ).trim();

    if (
      !userId ||
      !technologyId
    ) {
      res.status(400).json({
        success: false,
        message:
          "userId and technologyId are required.",
      });
      return;
    }

    const lessonId =
      req.query.lessonId == null
        ? ""
        : String(
            req.query.lessonId,
          ).trim();

    const [
      lessonCompleted,
      chapterCompleted,
      chapterTestPassed,
      finalTestPassed,
    ] =
      await Promise.all([
        lessonId && chapterId
          ? isLessonCompleted(
              userId,
              technologyId,
              chapterId,
              lessonId,
            )
          : false,

        chapterId
          ? isChapterCompleted(
              userId,
              technologyId,
              chapterId,
            )
          : false,

        chapterId
          ? hasPassedChapterTest(
              userId,
              technologyId,
              chapterId,
            )
          : false,

        hasPassedFinalTest(
          userId,
          technologyId,
        ),
      ]);

    res.json({
      success: true,
      lessonCompleted,
      chapterCompleted,
      chapterTestPassed,
      finalTestPassed,
    });
  } catch (error) {
    console.error(
      "[LOCK STATE ERROR]",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load lock state.",
    });
  }
}