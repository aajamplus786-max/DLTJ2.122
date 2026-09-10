// =====================================================
// DLTJ2.1
// BATCH 2
// FILE: src/data/chapters/cssChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

/**
 * =====================================================
 * CSS CHAPTERS
 * =====================================================
 *
 * CSS currently has 52 configured chapters.
 */
export const cssChapters: Chapter[] = Array.from(
  { length: 52 },
  (_, index) => {
    const chapterNumber = index + 1;

    return {
      id: `css-chapter-${chapterNumber}`,
      technologyId: "css",
      chapterNumber,
      title: `CSS Chapter ${chapterNumber}`,
      description:
        `Learn CSS concept ${chapterNumber} step by step.`,
      displayOrder: chapterNumber,
      available: true,
    };
  }
);