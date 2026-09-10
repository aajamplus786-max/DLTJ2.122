// =====================================================
// DLTJ2.1
// BATCH 4
// FILE: src/data/lessons/htmlLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

/**
 * =====================================================
 * HTML LESSONS
 * =====================================================
 *
 * Initial HTML learning foundation.
 *
 * Detailed HTML curriculum can be expanded without
 * changing the Lesson type or Learning UI.
 */
export const htmlLessons: Lesson[] = [
  {
    id: "html-lesson-1",
    chapterId: "html-chapter-1",
    technologyId: "html",

    title: "Introduction to HTML",

    introduction:
      "Learn what HTML is, why it is used, and how an HTML document is structured.",

    sections: [
      {
        id: "html-lesson-1-section-1",

        title: "What is HTML?",

        content:
          "HTML stands for HyperText Markup Language. It is the standard markup language used to structure content on web pages.",

        explanation:
          "HTML defines the structure of a webpage using elements such as headings, paragraphs, links, images, lists, forms and other semantic elements.",

        importantPoints: [
          "HTML is a markup language.",
          "HTML is used to structure webpage content.",
          "HTML documents are made using elements.",
          "Browsers read HTML and display the resulting webpage."
        ],

        commonMistakes: [
          "Thinking HTML is a programming language.",
          "Using incorrect opening or closing tags.",
          "Ignoring the basic document structure."
        ],

        bestPractices: [
          "Use meaningful semantic elements.",
          "Keep HTML properly indented.",
          "Use valid and readable markup."
        ],

        examples: [
          {
            id: "html-example-1",
            title: "Basic HTML Element",
            code: `<h1>Hello World</h1>`,
            output: "Hello World",
            explanation:
              "The h1 element represents a top-level heading."
          }
        ]
      },

      {
        id: "html-lesson-1-section-2",

        title: "Basic HTML Document",

        content:
          "A basic HTML document contains a document type declaration, html element, head section and body section.",

        syntax:
          `<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  Content
</body>
</html>`,

        examples: [
          {
            id: "html-example-2",
            title: "Basic HTML Page",

            code: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is my webpage.</p>
</body>
</html>`,

            explanation:
              "The document contains the standard HTML structure. The head contains page metadata and the body contains visible webpage content."
          }
        ],

        importantPoints: [
          "DOCTYPE declares the HTML document type.",
          "html is the root element.",
          "head contains metadata.",
          "body contains visible page content."
        ]
      }
    ],

    learningObjectives: [
      "Understand what HTML means.",
      "Understand the purpose of HTML.",
      "Understand the basic HTML document structure.",
      "Create a simple HTML document."
    ],

    keyPoints: [
      "HTML structures webpage content.",
      "HTML uses elements.",
      "A basic HTML page has html, head and body sections."
    ],

    interviewQuestions: [
      {
        id: "html-lesson-1-question-1",
        question: "What does HTML stand for?",
        answer:
          "HTML stands for HyperText Markup Language.",
        shortAnswer:
          "HyperText Markup Language",
        difficulty: "beginner"
      },
      {
        id: "html-lesson-1-question-2",
        question: "Is HTML a programming language?",
        answer:
          "No. HTML is a markup language used to structure content on webpages.",
        shortAnswer:
          "No, HTML is a markup language.",
        difficulty: "beginner"
      }
    ],

    practiceAvailable: true,

    available: true,

    displayOrder: 1
  }
];