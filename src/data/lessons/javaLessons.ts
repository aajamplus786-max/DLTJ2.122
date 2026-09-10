// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/javaLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const javaLessons: Lesson[] = [
  {
    id: "java-lesson-1",
    chapterId: "java-chapter-1",
    technologyId: "java",
    title: "Introduction to Java",
    introduction:
      "Learn the fundamentals of Java and understand why Java is widely used in software development.",

    sections: [
      {
        id: "java-lesson-1-section-1",
        title: "What is Java?",
        content:
          "Java is a general-purpose, object-oriented programming language designed to build reliable and portable applications.",

        syntax: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,

        examples: [
          {
            id: "java-example-1",
            title: "First Java Program",
            code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
            output: `Hello, Java!`,
            explanation:
              "The main() method is the entry point of a standard Java application. System.out.println() prints text to the console.",
            realWorldUse:
              "Java is used in enterprise applications, backend systems, Android-related development, and many large-scale software systems.",
          },
        ],

        importantPoints: [
          "Java is object-oriented.",
          "Java programs are compiled into bytecode.",
          "The JVM executes Java bytecode.",
        ],

        commonMistakes: [
          "Using incorrect capitalization.",
          "Forgetting the main method in a basic console application.",
        ],

        bestPractices: [
          "Use meaningful class and variable names.",
          "Keep classes focused on clear responsibilities.",
        ],

        realWorldUses: [
          "Enterprise applications",
          "Backend systems",
          "Desktop applications",
          "Large-scale software",
        ],

        questions: [
          {
            id: "java-lesson-1-question-1",
            question: "What is Java?",
            answer:
              "Java is a general-purpose, object-oriented programming language used to develop many types of applications.",
            shortAnswer:
              "Java is an object-oriented programming language.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what Java is.",
      "Understand the basic Java program structure.",
      "Write a simple Java program.",
    ],

    keyPoints: [
      "Java is object-oriented.",
      "Java uses the JVM to execute bytecode.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];