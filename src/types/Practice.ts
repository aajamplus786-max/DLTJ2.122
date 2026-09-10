// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/types/Practice.ts
// =====================================================

export type PracticeType =
  | "code"
  | "output"
  | "quiz"
  | "editor"
  | "exercise";

/**
 * Practice activity connected to a chapter.
 */
export interface Practice {
  id: string;

  /**
   * Technology that owns this practice.
   */
  technologyId?: string;

  /**
   * Chapter that owns this practice.
   */
  chapterId: string;

  /**
   * Optional lesson connection.
   */
  lessonId?: string;

  title: string;

  description: string;

  type: PracticeType;

  instructions: string[];

  starterCode?: string;

  expectedOutput?: string;

  /**
   * Optional explanation shown after practice.
   */
  explanation?: string;

  /**
   * Optional hints.
   */
  hints?: string[];

  /**
   * Whether the practice is available.
   */
  enabled: boolean;

  /**
   * Admin-controlled display order.
   */
  displayOrder?: number;
}