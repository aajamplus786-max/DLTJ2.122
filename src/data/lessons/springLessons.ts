// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/springLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const springLessons: Lesson[] = [
  {
    id: "spring-lesson-1",
    chapterId: "spring-chapter-1",
    technologyId: "spring",
    title: "Introduction to Spring",
    introduction:
      "Learn the fundamentals of the Spring framework and understand its role in Java application development.",

    sections: [
      {
        id: "spring-lesson-1-section-1",
        title: "What is Spring?",
        content:
          "Spring is a Java framework that provides infrastructure and tools for building maintainable and scalable applications.",

        syntax: `@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring!";
    }
}`,

        examples: [
          {
            id: "spring-example-1",
            title: "Simple Spring Controller",
            code: `@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring!";
    }
}`,
            output: `Hello, Spring!`,
            explanation:
              "A Spring REST controller can handle HTTP requests and return application data.",
            realWorldUse:
              "Spring is widely used for backend services, REST APIs, enterprise applications, and web applications.",
          },
        ],

        importantPoints: [
          "Spring is built for Java applications.",
          "Spring supports dependency injection.",
          "Spring Boot simplifies Spring application development.",
        ],

        commonMistakes: [
          "Using annotations incorrectly.",
          "Mixing configuration responsibilities unnecessarily.",
        ],

        bestPractices: [
          "Keep controllers focused on request handling.",
          "Separate business logic into appropriate services.",
        ],

        realWorldUses: [
          "REST APIs",
          "Backend applications",
          "Enterprise systems",
          "Microservices",
        ],

        questions: [
          {
            id: "spring-lesson-1-question-1",
            question: "What is Spring?",
            answer:
              "Spring is a Java framework used to build maintainable and scalable applications.",
            shortAnswer:
              "Spring is a Java application framework.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what Spring is.",
      "Understand the purpose of Spring.",
      "Understand a basic Spring controller.",
    ],

    keyPoints: [
      "Spring is a Java framework.",
      "Spring supports dependency injection.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];