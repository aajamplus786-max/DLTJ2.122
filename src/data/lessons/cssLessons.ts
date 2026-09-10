// =====================================================
// DLTJ2.1
// BATCH 4
// FILE: src/data/lessons/cssLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

/**
 * =====================================================
 * CSS LESSONS
 * =====================================================
 *
 * Initial CSS learning foundation.
 *
 * More CSS lessons will be added in the later
 * Lesson Data batches.
 */
export const cssLessons: Lesson[] = [
  {
    id: "css-lesson-1",
    chapterId: "css-chapter-1",
    technologyId: "css",

    title: "Introduction to CSS",

    introduction:
      "Learn what CSS is, why it is used, and how CSS controls the presentation of HTML content.",

    sections: [
      {
        id: "css-lesson-1-section-1",

        title: "What is CSS?",

        content:
          "CSS stands for Cascading Style Sheets. It is used to control the appearance and layout of HTML elements.",

        explanation:
          "HTML provides the structure of a webpage while CSS controls presentation such as colors, fonts, spacing, borders and layout.",

        importantPoints: [
          "CSS stands for Cascading Style Sheets.",
          "CSS controls webpage presentation.",
          "CSS can style HTML elements.",
          "CSS can control layout and spacing."
        ],

        commonMistakes: [
          "Using invalid CSS property names.",
          "Forgetting the semicolon between declarations.",
          "Writing selectors incorrectly."
        ],

        bestPractices: [
          "Use meaningful class names.",
          "Keep CSS organized.",
          "Avoid unnecessary repeated styles."
        ],

        examples: [
          {
            id: "css-example-1",
            title: "Basic CSS",

            code: `p {
  color: blue;
}`,

            explanation:
              "This rule selects paragraph elements and changes their text color."
          }
        ]
      },

      {
        id: "css-lesson-1-section-2",

        title: "CSS Syntax",

        content:
          "A CSS rule normally contains a selector followed by declarations inside curly braces.",

        syntax:
          `selector {
  property: value;
}`,

        examples: [
          {
            id: "css-example-2",
            title: "CSS Selector and Declaration",

            code: `h1 {
  font-size: 32px;
}`,

            explanation:
              "The h1 selector targets heading elements. The font-size property changes their text size."
          }
        ],

        importantPoints: [
          "A selector identifies the elements to style.",
          "A property identifies what should change.",
          "A value specifies how the property should be applied."
        ]
      }
    ],

    learningObjectives: [
      "Understand what CSS means.",
      "Understand why CSS is used.",
      "Understand basic CSS syntax.",
      "Write a simple CSS rule."
    ],

    keyPoints: [
      "CSS controls webpage presentation.",
      "CSS works with HTML.",
      "CSS rules contain selectors and declarations."
    ],

    interviewQuestions: [
      {
        id: "css-lesson-1-question-1",
        question: "What does CSS stand for?",
        answer:
          "CSS stands for Cascading Style Sheets.",
        shortAnswer:
          "Cascading Style Sheets",
        difficulty: "beginner"
      },
      {
        id: "css-lesson-1-question-2",
        question: "Why is CSS used?",
        answer:
          "CSS is used to control the appearance, styling and layout of webpage content.",
        shortAnswer:
          "For styling and layout.",
        difficulty: "beginner"
      }
    ],

    practiceAvailable: true,

    available: true,

    displayOrder: 1
  }
];