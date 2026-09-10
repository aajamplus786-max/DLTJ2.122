// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/cppLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const cppLessons: Lesson[] = [
  {
    id: "cpp-lesson-1",
    chapterId: "cpp-chapter-1",
    technologyId: "cpp",
    title: "Introduction to C++",
    introduction:
      "Learn the fundamentals of C++ and understand its basic program structure.",

    sections: [
      {
        id: "cpp-lesson-1-section-1",
        title: "What is C++?",
        content:
          "C++ is a general-purpose programming language that supports procedural, object-oriented, and other programming techniques.",

        syntax: `#include <iostream>

int main() {
    std::cout << "Hello, C++!";
    return 0;
}`,

        examples: [
          {
            id: "cpp-example-1",
            title: "First C++ Program",
            code: `#include <iostream>

int main() {
    std::cout << "Hello, C++!";
    return 0;
}`,
            output: `Hello, C++!`,
            explanation:
              "std::cout is used to send output to the console. The main() function is the entry point of the program.",
            realWorldUse:
              "C++ is used in game development, system software, desktop applications, and performance-critical software.",
          },
        ],

        importantPoints: [
          "C++ supports object-oriented programming.",
          "C++ is a compiled language.",
          "C++ provides high performance and fine-grained control.",
        ],

        commonMistakes: [
          "Forgetting the semicolon.",
          "Incorrectly using namespaces.",
        ],

        bestPractices: [
          "Use meaningful names.",
          "Prefer clear and maintainable class designs.",
        ],

        realWorldUses: [
          "Game development",
          "System software",
          "Desktop applications",
          "High-performance applications",
        ],

        questions: [
          {
            id: "cpp-lesson-1-question-1",
            question: "What is C++?",
            answer:
              "C++ is a general-purpose programming language that supports object-oriented and other programming paradigms.",
            shortAnswer:
              "C++ is a general-purpose programming language.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what C++ is.",
      "Understand the basic C++ program structure.",
      "Write a simple C++ program.",
    ],

    keyPoints: [
      "C++ supports object-oriented programming.",
      "C++ is compiled.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];