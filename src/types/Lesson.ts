// =====================================================
// DLTJ2.1
// BATCH 1
// FILE: src/types/Lesson.ts
// =====================================================

/**
 * Example inside a lesson section.
 */
export interface LessonExample {
  id: string;

  title: string;

  /**
   * Example source code.
   */
  code: string;

  /**
   * Optional expected output.
   */
  output?: string;

  /**
   * Explanation of the example.
   */
  explanation: string;

  /**
   * Optional real-world use.
   */
  realWorldUse?: string;
}

/**
 * Knowledge / interview question.
 */
export interface LessonQuestion {
  id: string;

  question: string;

  answer: string;

  shortAnswer?: string;

  difficulty?: "beginner" | "intermediate" | "advanced";
}

/**
 * Hands-on practice.
 */
export interface LessonPractice {
  id: string;

  title: string;

  instruction: string;

  starterCode?: string;

  expectedResult?: string;

  solutionExplanation?: string;
}

/**
 * Individual lesson section.
 */
export interface LessonSection {
  id: string;

  title: string;

  /**
   * Main explanation.
   */
  content: string;

  /**
   * Optional syntax.
   */
  syntax?: string;

  /**
   * Code examples.
   */
  examples?: LessonExample[];

  /**
   * Detailed explanation.
   */
  explanation?: string;

  /**
   * Important points.
   */
  importantPoints?: string[];

  /**
   * Common mistakes.
   */
  commonMistakes?: string[];

  /**
   * Best practices.
   */
  bestPractices?: string[];

  /**
   * Real-world usage.
   */
  realWorldUses?: string[];

  /**
   * Related questions.
   */
  questions?: LessonQuestion[];

  /**
   * Practice activities.
   */
  practice?: LessonPractice[];
}

/**
 * Lesson.
 */
export interface Lesson {
  /**
   * Unique lesson ID.
   */
  id: string;

  /**
   * Parent chapter.
   */
  chapterId: string;

  /**
   * Parent technology.
   */
  technologyId: string;

  /**
   * Lesson title.
   */
  title: string;

  /**
   * Introduction.
   */
  introduction: string;

  /**
   * Complete lesson sections.
   */
  sections: LessonSection[];

  /**
   * Learning objectives.
   */
  learningObjectives?: string[];

  /**
   * Key points.
   */
  keyPoints?: string[];

  /**
   * Overall interview questions.
   */
  interviewQuestions?: LessonQuestion[];

  /**
   * Whether hands-on practice exists.
   */
  practiceAvailable: boolean;

  /**
   * Whether users can access this lesson.
   */
  available: boolean;

  /**
   * Admin-controlled lesson order.
   */
  displayOrder: number;
}