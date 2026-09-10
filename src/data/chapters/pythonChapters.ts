// =====================================================
// DLTJ2.1
// BATCH 3
// FILE: src/data/chapters/pythonChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

/**
 * =====================================================
 * PYTHON CHAPTERS
 * =====================================================
 *
 * Python currently has 14 configured chapters.
 */
export const pythonChapters: Chapter[] = Array.from(
  { length: 14 },
  (_, index) => {
    const chapterNumber = index + 1;

    return {
      id: `python-chapter-${chapterNumber}`,
      technologyId: "python",
      chapterNumber,
      title: `Python Chapter ${chapterNumber}`,
      description:
        `Learn Python concept ${chapterNumber} step by step.`,
      displayOrder: chapterNumber,
      available: true,
    };
  }
);