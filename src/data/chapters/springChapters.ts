// =====================================================
// DLTJ2.1
// CHAPTER DATA
// FILE: src/data/chapters/springChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

// =====================================================
// SPRING CHAPTER TITLES
// =====================================================

const titles = [
  "Introduction to Spring",
  "Spring Environment Setup",
  "Spring Core",
  "Dependency Injection",
  "Spring Beans",
  "Spring Configuration",
  "Spring MVC",
  "Spring Boot",
  "REST API with Spring Boot",
  "Spring Data JPA",
];

// =====================================================
// SPRING CHAPTERS
// =====================================================

export const springChapters: Chapter[] = titles.map(
  (title, index) => {
    const chapterNumber = index + 1;

    return {
      id: `spring-chapter-${chapterNumber}`,

      technologyId: "spring",

      chapterNumber,

      title,

      description:
        `Learn ${title} with Spring examples and explanations.`,

      displayOrder: chapterNumber,

      available: true,

      completed: false,
    };
  }
);