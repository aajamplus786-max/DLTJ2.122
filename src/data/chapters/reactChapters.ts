// =====================================================
// DLTJ2.1
// BATCH 3
// FILE: src/data/chapters/reactChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

/**
 * =====================================================
 * REACT CHAPTERS
 * =====================================================
 *
 * React currently has 23 configured chapters.
 */
export const reactChapters: Chapter[] = Array.from(
  { length: 23 },
  (_, index) => {
    const chapterNumber = index + 1;

    return {
      id: `react-chapter-${chapterNumber}`,
      technologyId: "react",
      chapterNumber,
      title: `React Chapter ${chapterNumber}`,
      description:
        `Learn React concept ${chapterNumber} step by step.`,
      displayOrder: chapterNumber,
      available: true,
    };
  }
);