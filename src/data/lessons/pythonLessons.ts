// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/pythonLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const pythonLessons: Lesson[] = [
  {
    id: "python-lesson-1",
    chapterId: "python-chapter-1",
    technologyId: "python",
    title: "Introduction to Python",
    introduction:
      "Learn the basics of Python and understand why it is widely used in programming and software development.",

    sections: [
      {
        id: "python-lesson-1-section-1",
        title: "What is Python?",
        content:
          "Python is a high-level programming language known for its readable syntax and wide range of applications.",

        syntax: `print("Hello, Python!")`,

        examples: [
          {
            id: "python-example-1",
            title: "First Python Program",
            code: `print("Hello, Python!")`,
            output: `Hello, Python!`,
            explanation:
              "The print() function displays text or values as output.",
            realWorldUse:
              "Python is used in web development, automation, data analysis, artificial intelligence, and many other areas.",
          },
        ],

        importantPoints: [
          "Python has readable syntax.",
          "Python supports multiple programming styles.",
          "Python has a large standard library and ecosystem.",
        ],

        commonMistakes: [
          "Using incorrect indentation.",
          "Forgetting that Python is case-sensitive.",
        ],

        bestPractices: [
          "Use meaningful names.",
          "Keep indentation consistent.",
          "Write simple and readable code.",
        ],

        realWorldUses: [
          "Automation",
          "Web development",
          "Data analysis",
          "Artificial intelligence",
        ],

        questions: [
          {
            id: "python-lesson-1-question-1",
            question: "What is Python?",
            answer:
              "Python is a high-level programming language used for many types of software development.",
            shortAnswer:
              "Python is a high-level programming language.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what Python is.",
      "Understand basic Python syntax.",
      "Write a simple Python program.",
    ],

    keyPoints: [
      "Python has simple and readable syntax.",
      "Indentation is important in Python.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];