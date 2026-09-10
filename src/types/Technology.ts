// =====================================================
// DLTJ2.1
// BATCH 1
// FILE: src/types/Technology.ts
// =====================================================

/**
 * Technology Section
 *
 * Admin can decide where a technology appears.
 */
export type TechnologySection =
  | "web"
  | "programming"
  | "database"
  | "framework"
  | "other";

/**
 * Technology
 *
 * This is the main configuration contract for the
 * Learning system.
 *
 * IMPORTANT:
 * - Technology IDs are stable.
 * - section is Admin-controlled.
 * - displayOrder is Admin-controlled.
 * - Users only consume available technologies.
 */
export interface Technology {
  /**
   * Unique technology ID.
   *
   * Example:
   * html
   * css
   * javascript
   */
  id: string;

  /**
   * Full technology name.
   */
  name: string;

  /**
   * Short display name.
   */
  shortName: string;

  /**
   * Short description shown in cards.
   */
  description: string;

  /**
   * Icon identifier.
   */
  icon?: string;

  /**
   * Optional theme color.
   */
  color?: string;

  /**
   * Admin-controlled section.
   */
  section: TechnologySection;

  /**
   * Admin-controlled display order.
   */
  displayOrder: number;

  /**
   * Total configured chapters.
   */
  totalChapters: number;

  /**
   * Whether normal users can access it.
   */
  available: boolean;
}