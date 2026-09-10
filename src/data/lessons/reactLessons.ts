// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/reactLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const reactLessons: Lesson[] = [
  {
    id: "react-lesson-1",
    chapterId: "react-chapter-1",
    technologyId: "react",
    title: "Introduction to React",
    introduction:
      "Learn what React is and understand the basic idea behind component-based user interfaces.",

    sections: [
      {
        id: "react-lesson-1-section-1",
        title: "What is React?",
        content:
          "React is a JavaScript library for building user interfaces using reusable components.",

        syntax: `function Welcome() {
  return <h1>Hello, React!</h1>;
}`,

        examples: [
          {
            id: "react-example-1",
            title: "Simple React Component",
            code: `function Welcome() {
  return <h1>Hello, React!</h1>;
}`,
            explanation:
              "A React component can return UI that React renders for the user.",
            realWorldUse:
              "React is widely used to build interactive web applications and reusable user interface components.",
          },
        ],

        importantPoints: [
          "React uses components.",
          "Components can be reused.",
          "React uses JSX in many projects.",
        ],

        commonMistakes: [
          "Using component names incorrectly.",
          "Forgetting to return JSX from a component.",
        ],

        bestPractices: [
          "Create small reusable components.",
          "Use meaningful component names.",
          "Keep component responsibilities clear.",
        ],

        realWorldUses: [
          "Web applications",
          "Dashboards",
          "Interactive interfaces",
          "Single-page applications",
        ],

        questions: [
          {
            id: "react-lesson-1-question-1",
            question: "What is React?",
            answer:
              "React is a JavaScript library used to build user interfaces using reusable components.",
            shortAnswer:
              "React is a JavaScript UI library.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what React is.",
      "Understand components.",
      "Create a simple React component.",
    ],

    keyPoints: [
      "React is component-based.",
      "Components are reusable UI building blocks.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];