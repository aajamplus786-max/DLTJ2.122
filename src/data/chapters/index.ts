
// =====================================================
// DLTJ2.1
// CHAPTER REGISTRY
// FILE: src/data/chapters/index.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

// =====================================================
// TECHNOLOGY CHAPTER DATA
// =====================================================

import { htmlChapters } from "./htmlChapters";
import { cssChapters } from "./cssChapters";
import { javascriptChapters } from "./javascriptChapters";
import { javaChapters } from "./javaChapters";
import { mysqlChapters } from "./mysqlChapters";
import { pythonChapters } from "./pythonChapters";
import { cChapters } from "./cChapters";
import { cppChapters } from "./cppChapters";
import { reactChapters } from "./reactChapters";
import { springChapters } from "./springChapters";
import { typescriptChapters } from "./typescriptChapters";

// =====================================================
// ALL CHAPTERS
// =====================================================

export const allChapters: Chapter[] = [
  ...htmlChapters,
  ...cssChapters,
  ...javascriptChapters,
  ...javaChapters,
  ...mysqlChapters,
  ...pythonChapters,
  ...cChapters,
  ...cppChapters,
  ...reactChapters,
  ...springChapters,
  ...typescriptChapters,
];

// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

export const chapters: Chapter[] = allChapters;

// =====================================================
// GET ALL CHAPTERS
// =====================================================

export function getAllChapters(): Chapter[] {
  return [...allChapters];
}

// =====================================================
// GET AVAILABLE CHAPTERS
// =====================================================

export function getAvailableChapters(): Chapter[] {
  return allChapters.filter(
    (chapter) => chapter.available !== false,
  );
}

// =====================================================
// GET CHAPTER BY ID
// =====================================================

export function getChapterById(
  chapterId: string,
): Chapter | undefined {
  return allChapters.find(
    (chapter) => chapter.id === chapterId,
  );
}

// =====================================================
// GET CHAPTERS BY TECHNOLOGY
// =====================================================

export function getChaptersByTechnology(
  technologyId: string,
): Chapter[] {
  return allChapters.filter(
    (chapter) =>
      chapter.available !== false &&
      chapter.technologyId === technologyId,
  );
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default allChapters;
