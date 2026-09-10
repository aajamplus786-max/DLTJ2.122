// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/cLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const cLessons: Lesson[] = [
  {
    id: "c-lesson-1",
    chapterId: "c-chapter-1",
    technologyId: "c",
    title: "Introduction to C",
    introduction:
      "Learn the fundamentals of the C programming language and understand its basic program structure.",

    sections: [
      {
        id: "c-lesson-1-section-1",
        title: "What is C?",
        content:
          "C is a general-purpose programming language widely used for system programming, embedded development, and performance-oriented software.",

        syntax: `#include <stdio.h>

int main() {
    printf("Hello, C!");
    return 0;
}`,

        examples: [
          {
            id: "c-example-1",
            title: "First C Program",
            code: `#include <stdio.h>

int main() {
    printf("Hello, C!");
    return 0;
}`,
            output: `Hello, C!`,
            explanation:
              "The printf() function displays text. The main() function is the starting point of the program.",
            realWorldUse:
              "C is commonly used in operating systems, embedded systems, and performance-sensitive software.",
          },
        ],

        importantPoints: [
          "C is a compiled programming language.",
          "The main() function is the entry point of a standard C program.",
          "C provides low-level memory and system control.",
        ],

        commonMistakes: [
          "Forgetting the semicolon.",
          "Using incorrect header files.",
        ],

        bestPractices: [
          "Use meaningful variable names.",
          "Initialize variables appropriately.",
          "Keep functions focused.",
        ],

        realWorldUses: [
          "Operating systems",
          "Embedded systems",
          "System software",
          "Performance-oriented applications",
        ],

        questions: [
          {
            id: "c-lesson-1-question-1",
            question: "What is C?",
            answer:
              "C is a general-purpose programming language commonly used for system and performance-oriented programming.",
            shortAnswer:
              "C is a general-purpose programming language.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what C is.",
      "Understand the basic C program structure.",
      "Write a simple C program.",
    ],

    keyPoints: [
      "C is a compiled language.",
      "main() is the standard program entry point.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];