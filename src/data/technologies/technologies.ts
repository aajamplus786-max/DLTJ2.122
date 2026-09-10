// =====================================================
// DLTJ2.1
// BATCH 1
// FILE: src/data/technologies/technologies.ts
// =====================================================

import type {
  Technology,
  TechnologySection,
} from "../../types/Technology";

/**
 * =====================================================
 * DEFAULT TECHNOLOGY CONFIGURATION
 * =====================================================
 *
 * IMPORTANT:
 *
 * This is the initial configuration.
 *
 * Later Admin can control:
 *
 * - Technology
 * - Section
 * - Display order
 * - Availability
 *
 * Users cannot modify this configuration.
 */
export const technologies: Technology[] = [
  {
    id: "html",
    name: "HTML",
    shortName: "HTML",
    description: "Learn HTML from the basics to advanced concepts.",
    icon: "html",
    section: "web",
    displayOrder: 1,
    totalChapters: 41,
    available: true,
  },

  {
    id: "css",
    name: "CSS",
    shortName: "CSS",
    description: "Learn CSS from basic styling to advanced layouts.",
    icon: "css",
    section: "web",
    displayOrder: 2,
    totalChapters: 52,
    available: true,
  },

  {
    id: "javascript",
    name: "JavaScript",
    shortName: "JS",
    description:
      "Learn JavaScript from fundamentals to advanced concepts.",
    icon: "javascript",
    section: "programming",
    displayOrder: 3,
    totalChapters: 46,
    available: true,
  },

  {
    id: "java",
    name: "Java",
    shortName: "Java",
    description:
      "Learn Java programming from fundamentals to advanced concepts.",
    icon: "java",
    section: "programming",
    displayOrder: 4,
    totalChapters: 22,
    available: true,
  },

  {
    id: "mysql",
    name: "MySQL",
    shortName: "SQL",
    description:
      "Learn databases, DBMS, RDBMS and SQL step by step.",
    icon: "mysql",
    section: "database",
    displayOrder: 5,
    totalChapters: 0,
    available: true,
  },

  {
    id: "python",
    name: "Python",
    shortName: "Python",
    description:
      "Learn Python programming from basics to practical concepts.",
    icon: "python",
    section: "programming",
    displayOrder: 6,
    totalChapters: 14,
    available: true,
  },

  {
    id: "c",
    name: "C",
    shortName: "C",
    description:
      "Learn the fundamentals of C programming.",
    icon: "c",
    section: "programming",
    displayOrder: 7,
    totalChapters: 0,
    available: true,
  },

  {
    id: "cpp",
    name: "C++",
    shortName: "C++",
    description:
      "Learn C++ programming from fundamentals to advanced concepts.",
    icon: "cpp",
    section: "programming",
    displayOrder: 8,
    totalChapters: 0,
    available: true,
  },

  {
    id: "react",
    name: "React",
    shortName: "React",
    description:
      "Learn React from fundamentals to advanced concepts.",
    icon: "react",
    section: "framework",
    displayOrder: 9,
    totalChapters: 23,
    available: true,
  },

  {
    id: "spring",
    name: "Spring",
    shortName: "Spring",
    description:
      "Learn Spring framework concepts step by step.",
    icon: "spring",
    section: "framework",
    displayOrder: 10,
    totalChapters: 0,
    available: true,
  },

  {
    id: "typescript",
    name: "TypeScript",
    shortName: "TS",
    description:
      "Learn TypeScript from basics to advanced types.",
    icon: "typescript",
    section: "programming",
    displayOrder: 11,
    totalChapters: 6,
    available: true,
  },
];

/**
 * =====================================================
 * GET AVAILABLE TECHNOLOGIES
 * =====================================================
 */
export function getAvailableTechnologies(): Technology[] {
  return [...technologies]
    .filter((technology) => technology.available)
    .sort(
      (a, b) =>
        a.displayOrder - b.displayOrder
    );
}

/**
 * =====================================================
 * GET TECHNOLOGY BY ID
 * =====================================================
 */
export function getTechnologyById(
  technologyId: string
): Technology | undefined {
  return technologies.find(
    (technology) =>
      technology.id === technologyId
  );
}

/**
 * =====================================================
 * GET TECHNOLOGIES BY SECTION
 * =====================================================
 */
export function getTechnologiesBySection(
  section: TechnologySection
): Technology[] {
  return [...technologies]
    .filter(
      (technology) =>
        technology.available &&
        technology.section === section
    )
    .sort(
      (a, b) =>
        a.displayOrder - b.displayOrder
    );
}