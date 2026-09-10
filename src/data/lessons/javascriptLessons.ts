// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/javascriptLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const javascriptLessons: Lesson[] = [
  {
    id: "javascript-lesson-1",
    chapterId: "javascript-chapter-1",
    technologyId: "javascript",
    title: "Introduction to JavaScript",
    introduction:
      "Learn what JavaScript is, why it is used, and how it works in modern web development.",

    sections: [
      {
        id: "javascript-lesson-1-section-1",
        title: "What is JavaScript?",
        content:
          "JavaScript is a programming language mainly used to make web pages interactive and dynamic.",

        syntax: `console.log("Hello, JavaScript!");`,

        examples: [
          {
            id: "javascript-example-1",
            title: "First JavaScript Program",
            code: `console.log("Hello, JavaScript!");`,
            output: `Hello, JavaScript!`,
            explanation:
              "The console.log() method displays information in the browser console.",
            realWorldUse:
              "Developers use console.log() frequently while debugging JavaScript applications.",
          },
        ],

        importantPoints: [
          "JavaScript adds behavior and interactivity to web pages.",
          "JavaScript can run in web browsers.",
          "JavaScript is also used on servers through environments such as Node.js.",
        ],

        commonMistakes: [
          "Confusing JavaScript with Java.",
          "Forgetting that JavaScript is case-sensitive.",
        ],

        bestPractices: [
          "Use meaningful variable and function names.",
          "Keep JavaScript code readable and organized.",
        ],

        realWorldUses: [
          "Interactive websites",
          "Web applications",
          "Server-side applications",
          "Browser-based tools",
        ],

        questions: [
          {
            id: "javascript-lesson-1-question-1",
            question: "What is JavaScript?",
            answer:
              "JavaScript is a programming language used to create dynamic and interactive web experiences.",
            shortAnswer:
              "JavaScript is used to add behavior and interactivity to web applications.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand the purpose of JavaScript.",
      "Understand where JavaScript can run.",
      "Write a basic JavaScript statement.",
    ],

    keyPoints: [
      "JavaScript is case-sensitive.",
      "JavaScript is widely used for web development.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];