// =====================================================
// DLTJ2.1
// BATCH 2
// FILE: src/data/chapters/javaChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

/**
 * =====================================================
 * JAVA CHAPTERS
 * =====================================================
 *
 * Java currently has 22 configured chapters.
 */
export const javaChapters: Chapter[] = Array.from(
  { length: 22 },
  (_, index) => {
    const chapterNumber = index + 1;

    return {
      id: `java-chapter-${chapterNumber}`,
      technologyId: "java",
      chapterNumber,
      title: `Java Chapter ${chapterNumber}`,
      description:
        `Learn Java concept ${chapterNumber} step by step.`,
      displayOrder: chapterNumber,
      available: true,
    };
  }
);