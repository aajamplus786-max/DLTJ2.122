// =====================================================
// DLTJ2.1
// BATCH 2
// FILE: src/data/chapters/javascriptChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

/**
 * =====================================================
 * JAVASCRIPT CHAPTERS
 * =====================================================
 *
 * JavaScript currently has 46 configured chapters.
 */
export const javascriptChapters: Chapter[] =
  Array.from(
    { length: 46 },
    (_, index) => {
      const chapterNumber = index + 1;

      return {
        id: `javascript-chapter-${chapterNumber}`,
        technologyId: "javascript",
        chapterNumber,
        title: `JavaScript Chapter ${chapterNumber}`,
        description:
          `Learn JavaScript concept ${chapterNumber} step by step.`,
        displayOrder: chapterNumber,
        available: true,
      };
    }
  );