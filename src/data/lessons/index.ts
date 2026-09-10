// =====================================================
// DLTJ2.1
// BATCH 4
// FILE: src/data/lessons/index.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

import { htmlLessons } from "./htmlLessons";
import { cssLessons } from "./cssLessons";
import { javascriptLessons } from "./javascriptLessons";
import { javaLessons } from "./javaLessons";
import { mysqlLessons } from "./mysqlLessons";
import { pythonLessons } from "./pythonLessons";
import { cLessons } from "./cLessons";
import { cppLessons } from "./cppLessons";
import { reactLessons } from "./reactLessons";
import { springLessons } from "./springLessons";
import { typescriptLessons } from "./typescriptLessons";

// =====================================================
// ALL LESSONS
// =====================================================

export const allLessons: Lesson[] = [
  ...htmlLessons,
  ...cssLessons,
  ...javascriptLessons,
  ...javaLessons,
  ...mysqlLessons,
  ...pythonLessons,
  ...cLessons,
  ...cppLessons,
  ...reactLessons,
  ...springLessons,
  ...typescriptLessons,
];

// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================
//
// Existing services may import `lessons`.
// Keep this alias so we do not break those files.
// =====================================================

export const lessons = allLessons;

// =====================================================
// GET AVAILABLE LESSONS
// =====================================================

export function getAvailableLessons(): Lesson[] {
  return [...allLessons]
    .filter(
      (lesson) =>
        lesson.available !== false
    )
    .sort(
      (a, b) =>
        (a.displayOrder ?? 0) -
        (b.displayOrder ?? 0)
    );
}

// =====================================================
// GET LESSON BY ID
// =====================================================

export function getLessonById(
  lessonId: string
): Lesson | undefined {
  return allLessons.find(
    (lesson) =>
      lesson.id === lessonId
  );
}

// =====================================================
// GET LESSONS BY TECHNOLOGY
// =====================================================

export function getLessonsByTechnology(
  technologyId: string
): Lesson[] {
  return [...allLessons]
    .filter(
      (lesson) =>
        lesson.available !== false &&
        lesson.technologyId === technologyId
    )
    .sort(
      (a, b) =>
        (a.displayOrder ?? 0) -
        (b.displayOrder ?? 0)
    );
}

// =====================================================
// GET LESSONS BY CHAPTER
// =====================================================

export function getLessonsByChapter(
  technologyId: string,
  chapterId: string
): Lesson[] {
  return [...allLessons]
    .filter(
      (lesson) =>
        lesson.available !== false &&
        lesson.technologyId === technologyId &&
        lesson.chapterId === chapterId
    )
    .sort(
      (a, b) =>
        (a.displayOrder ?? 0) -
        (b.displayOrder ?? 0)
    );
}