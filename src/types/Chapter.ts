
// =====================================================
// DLTJ2.10
// TYPE
// FILE: src/types/Chapter.ts
// =====================================================

/**
 * Chapter
 *
 * A chapter belongs to one technology.
 *
 * displayOrder controls the UI order.
 * available controls whether the chapter can be shown
 * to the learner.
 */
export interface Chapter {
  /**
   * Unique chapter ID.
   *
   * Example:
   * html-chapter-1
   */
  id: string;

  /**
   * Parent technology ID.
   */
  technologyId: string;

  /**
   * Logical chapter number.
   *
   * Example:
   * 1, 2, 3...
   */
  chapterNumber: number;

  /**
   * Chapter title.
   */
  title: string;

  /**
   * Short chapter description.
   */
  description: string;

  /**
   * Admin-controlled display order.
   */
  displayOrder: number;

  /**
   * Whether the chapter is available
   * for learners.
   */
  available: boolean;

  /**
   * Optional learning objectives.
   */
  learningObjectives?: string[];

  /**
   * Runtime learning status.
   *
   * This is user-specific and should normally
   * be supplied by the progress system.
   */
  completed?: boolean;

  /**
   * Database/API active flag.
   *
   * Optional because existing frontend data may
   * still use `available`.
   */
  isActive?: boolean;

  /**
   * Record creation date/time.
   *
   * ISO 8601 string.
   */
  createdAt?: string;

  /**
   * Record last update date/time.
   *
   * ISO 8601 string.
   */
  updatedAt?: string;
}

