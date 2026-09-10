
// =====================================================
// DLTJ2.1
// STEP F — UTILITY HELPERS
// FILE: src/utils/helpers.ts
// =====================================================

import type {
  Chapter,
} from "../types/Chapter";

import type {
  TechnologyProgress,
} from "../types/Progress";

import {
  getProgress,
} from "../services/progressService";

import {
  hasTestPassed,
} from "../services/testService";

// =====================================================
// CHAPTER COMPLETED
// =====================================================

export function isChapterCompleted(
  chapterId: string,
  progress: TechnologyProgress,
): boolean {
  return (
    progress.completedChapters?.includes(
      chapterId,
    ) ?? false
  );
}

// =====================================================
// COMPLETED COUNT
// =====================================================

export function getCompletedCount(
  chapters: Chapter[],
  progress: TechnologyProgress,
): number {
  return chapters.filter(
    (chapter) =>
      isChapterCompleted(
        chapter.id,
        progress,
      ),
  ).length;
}

// =====================================================
// CHAPTER UNLOCKED
// =====================================================
//
// Chapter 1
//   -> Always unlocked
//
// Chapter 2-5
//   -> Previous chapter completed
//
// Chapter 6
//   -> Previous chapters completed
//      AND Test 1 passed
//
// Chapter 11
//   -> Previous chapters completed
//      AND Test 2 passed
//
// Chapter 16
//   -> Previous chapters completed
//      AND Test 3 passed
//
// =====================================================

export function isChapterUnlocked(
  chapter: Chapter,
  chapters: Chapter[],
): boolean {

  // ---------------------------------------------------
  // CHAPTER 1
  // ---------------------------------------------------

  if (
    chapter.chapterNumber === 1
  ) {
    return true;
  }

  // ---------------------------------------------------
  // GET STORED PROGRESS
  // ---------------------------------------------------

  const storedProgress =
    getProgress(
      chapter.technologyId,
    );

  // ---------------------------------------------------
  // TECHNOLOGY PROGRESS
  // ---------------------------------------------------
  //
  // TechnologyProgress only contains the fields
  // defined in types/Progress.ts.
  //
  // Do not add LearningProgress-only fields here.
  //
  // ---------------------------------------------------

  const progress =
    storedProgress as unknown as TechnologyProgress;

  // ---------------------------------------------------
  // FIND PREVIOUS CHAPTER
  // ---------------------------------------------------

  const previousChapter =
    chapters.find(
      (item) =>
        item.chapterNumber ===
        chapter.chapterNumber - 1,
    );

  if (!previousChapter) {
    return false;
  }

  // ---------------------------------------------------
  // PREVIOUS CHAPTER COMPLETED
  // ---------------------------------------------------

  const previousCompleted =
    isChapterCompleted(
      previousChapter.id,
      progress,
    );

  if (!previousCompleted) {
    return false;
  }

  // ---------------------------------------------------
  // TEST GATE
  // ---------------------------------------------------

  if (
    (
      chapter.chapterNumber - 1
    ) % 5 === 0
  ) {

    const testNumber =
      Math.floor(
        (
          chapter.chapterNumber - 1
        ) / 5,
      );

    const testId =
      `${chapter.technologyId}-test-${testNumber}`;

    const testPassed =
      hasTestPassed(
        testId,
      );

    if (!testPassed) {
      return false;
    }
  }

  return true;
}

// =====================================================
// NEXT CHAPTER
// =====================================================

export function getNextChapter(
  chapter: Chapter,
  chapters: Chapter[],
): Chapter | undefined {

  return chapters.find(
    (item) =>
      item.chapterNumber ===
      chapter.chapterNumber + 1,
  );
}

// =====================================================
// PREVIOUS CHAPTER
// =====================================================

export function getPreviousChapter(
  chapter: Chapter,
  chapters: Chapter[],
): Chapter | undefined {

  return chapters.find(
    (item) =>
      item.chapterNumber ===
      chapter.chapterNumber - 1,
  );
}

// =====================================================
// TECHNOLOGY PROGRESS
// =====================================================

export function calculateTechnologyProgress(
  chapters: Chapter[],
  progress: TechnologyProgress,
): number {

  if (
    chapters.length === 0
  ) {
    return 0;
  }

  const completed =
    getCompletedCount(
      chapters,
      progress,
    );

  return Math.round(
    (
      completed /
      chapters.length
    ) *
    100,
  );
}

// =====================================================
// FORMAT TIME
// =====================================================

export function formatTime(
  totalSeconds: number,
): string {

  const safeSeconds =
    Math.max(
      0,
      Math.floor(
        totalSeconds,
      ),
    );

  const minutes =
    Math.floor(
      safeSeconds / 60,
    )
      .toString()
      .padStart(2, "0");

  const seconds =
    (
      safeSeconds % 60
    )
      .toString()
      .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

// =====================================================
// SAFE NUMBER
// =====================================================

export function safeNumber(
  value: unknown,
  fallback = 0,
): number {

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return value;
}

// =====================================================
// CLAMP
// =====================================================

export function clamp(
  value: number,
  min: number,
  max: number,
): number {

  return Math.min(
    Math.max(
      value,
      min,
    ),
    max,
  );
}
