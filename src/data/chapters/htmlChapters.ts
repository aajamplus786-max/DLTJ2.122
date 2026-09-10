// =====================================================
// DLTJ2.1
// BATCH 2
// FILE: src/data/chapters/htmlChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

/**
 * =====================================================
 * HTML CHAPTERS
 * =====================================================
 *
 * HTML currently has 41 configured chapters.
 *
 * Detailed lesson content will be connected through
 * htmlLessons.ts in the Lesson Data batches.
 */
export const htmlChapters: Chapter[] = Array.from(
  { length: 41 },
  (_, index) => {
    const chapterNumber = index + 1;

    return {
      id: `html-chapter-${chapterNumber}`,
      technologyId: "html",
      chapterNumber,
      title: `HTML Chapter ${chapterNumber}`,
      description:
        `Learn HTML concept ${chapterNumber} step by step.`,
      displayOrder: chapterNumber,
      available: true,
    };
  }
);