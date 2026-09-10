// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/typescriptLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const typescriptLessons: Lesson[] = [
  {
    id: "typescript-lesson-1",
    chapterId: "typescript-chapter-1",
    technologyId: "typescript",
    title: "Introduction to TypeScript",
    introduction:
      "Learn what TypeScript is and how static typing improves JavaScript development.",

    sections: [
      {
        id: "typescript-lesson-1-section-1",
        title: "What is TypeScript?",
        content:
          "TypeScript is a programming language that builds on JavaScript by adding static typing and other development features.",

        syntax: `let name: string = "Aajam";
let age: number = 20;`,

        examples: [
          {
            id: "typescript-example-1",
            title: "Typed Variables",
            code: `let name: string = "Aajam";
let age: number = 20;

console.log(name);
console.log(age);`,
            output: `Aajam
20`,
            explanation:
              "TypeScript allows developers to specify the expected type of a variable.",
            realWorldUse:
              "TypeScript is widely used for large JavaScript applications where maintainability and type safety are important.",
          },
        ],

        importantPoints: [
          "TypeScript is built on JavaScript.",
          "TypeScript supports static typing.",
          "TypeScript code is compiled to JavaScript.",
        ],

        commonMistakes: [
          "Assigning values that do not match the declared type.",
          "Assuming TypeScript types are available unchanged at runtime.",
        ],

        bestPractices: [
          "Use meaningful type definitions.",
          "Prefer clear and maintainable interfaces and types.",
        ],

        realWorldUses: [
          "Large web applications",
          "React applications",
          "Backend JavaScript projects",
          "Enterprise applications",
        ],

        questions: [
          {
            id: "typescript-lesson-1-question-1",
            question: "What is TypeScript?",
            answer:
              "TypeScript is a language based on JavaScript that adds static typing and other development features.",
            shortAnswer:
              "TypeScript is JavaScript with static typing and additional language features.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what TypeScript is.",
      "Understand static typing.",
      "Write basic typed variables.",
    ],

    keyPoints: [
      "TypeScript builds on JavaScript.",
      "TypeScript supports static typing.",
      "TypeScript is compiled to JavaScript.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];