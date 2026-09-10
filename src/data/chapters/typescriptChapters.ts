// =====================================================
// DLTJ2.1
// BATCH 4
// FILE: src/data/chapters/typescriptChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

/**
 * =====================================================
 * TYPESCRIPT CHAPTERS
 * =====================================================
 *
 * TypeScript currently has 6 configured chapters.
 */
export const typescriptChapters: Chapter[] =
  Array.from(
    { length: 6 },
    (_, index) => {
      const chapterNumber = index + 1;

      return {
        id: `typescript-chapter-${chapterNumber}`,
        technologyId: "typescript",
        chapterNumber,
        title: `TypeScript Chapter ${chapterNumber}`,
        description:
          `Learn TypeScript concept ${chapterNumber} step by step.`,
        displayOrder: chapterNumber,
        available: true,
      };
    }
  );