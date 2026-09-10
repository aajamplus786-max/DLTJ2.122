// =====================================================
// DLTJ2.10
// PROGRESS LOCK HELPERS
// FILE: src/utils/progressLock.ts
// UPDATED: 2026-09-06
// LOCATION: E:\DLTJ2.122\src\utils\progressLock.ts
// =====================================================

import {
  hasPassedChapterTest,
  hasPassedFinalTest,
  isChapterCompleted,
  isLessonCompleted,
} from "../services/progressService";

// =====================================================
// CHAPTER LOCK
// =====================================================
// First chapter = unlocked.
// Later chapters require previous chapter test pass.
// =====================================================

export function isChapterUnlocked(
  technologyId: string,
  chapterIndex: number,
  previousChapterId?: string,
  userId?: string,
): boolean {
  if (
    chapterIndex <= 0
  ) {
    return true;
  }

  if (
    !previousChapterId
  ) {
    return false;
  }

  return isChapterCompleted(
    technologyId,
    previousChapterId,
    userId,
  ) || hasPassedChapterTest(
    technologyId,
    previousChapterId,
    userId,
  );
}

// =====================================================
// CHAPTER TEST LOCK
// =====================================================

export function isChapterTestUnlocked(
  technologyId: string,
  chapterId: string,
  userId?: string,
): boolean {
  // Completed chapter/test is still accessible for result view,
  // but test itself should not require retake after passing.
  if (
    hasPassedChapterTest(
      technologyId,
      chapterId,
      userId,
    )
  ) {
    return true;
  }

  return isChapterCompleted(
    technologyId,
    chapterId,
    userId,
  );
}

// =====================================================
// CHAPTER TEST RETEST
// =====================================================

export function canRetakeChapterTest(
  technologyId: string,
  chapterId: string,
  userId?: string,
): boolean {
  return !hasPassedChapterTest(
    technologyId,
    chapterId,
    userId,
  );
}

// =====================================================
// FINAL TEST ACCESS
// =====================================================

export function isFinalTestUnlocked(
  technologyId: string,
  userId?: string,
): boolean {
  // The final test can be opened according to
  // application's chapter completion rules.
  // Once passed, it remains permanently completed.
  return !hasPassedFinalTest(
    technologyId,
    userId,
  );
}

// =====================================================
// FINAL TEST RETEST
// =====================================================

export function canRetakeFinalTest(
  technologyId: string,
  userId?: string,
): boolean {
  return !hasPassedFinalTest(
    technologyId,
    userId,
  );
}

// =====================================================
// LESSON LOCK
// =====================================================

export function isLessonUnlocked(
  technologyId: string,
  chapterId: string,
  lessonIndex: number,
  previousLessonId?: string,
  userId?: string,
): boolean {
  if (
    lessonIndex <= 0
  ) {
    return true;
  }

  if (
    !previousLessonId
  ) {
    return false;
  }

  return isLessonCompleted(
    technologyId,
    chapterId,
    previousLessonId,
    userId,
  );
}