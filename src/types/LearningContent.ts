// =====================================================
// DLTJ2.1
// BATCH 1
// FILE: src/types/LearningContent.ts
// =====================================================

import type { Chapter } from "./Chapter";
import type { Lesson } from "./Lesson";
import type { Technology } from "./Technology";

/**
 * Complete learning content for one technology.
 *
 * This structure connects:
 *
 * Technology
 *     ↓
 * Chapters
 *     ↓
 * Lessons
 */
export interface LearningContent {
  /**
   * Technology configuration.
   */
  technology: Technology;

  /**
   * Chapters belonging to the technology.
   */
  chapters: Chapter[];

  /**
   * Lessons belonging to the technology.
   */
  lessons: Lesson[];
}

/**
 * Learning data returned to the Learning UI.
 */
export interface TechnologyLearningData {
  technology: Technology;

  chapters: Chapter[];

  lessons: Lesson[];
}