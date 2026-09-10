// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/data/lessons/mysqlLessons.ts
// =====================================================

import type { Lesson } from "../../types/Lesson";

export const mysqlLessons: Lesson[] = [
  {
    id: "mysql-lesson-1",
    chapterId: "mysql-chapter-1",
    technologyId: "mysql",
    title: "Introduction to MySQL",
    introduction:
      "Learn the fundamentals of databases and understand the role of MySQL in application development.",

    sections: [
      {
        id: "mysql-lesson-1-section-1",
        title: "What is MySQL?",
        content:
          "MySQL is a relational database management system used to store, organize, retrieve, and manage structured data.",

        syntax: `CREATE DATABASE school;`,

        examples: [
          {
            id: "mysql-example-1",
            title: "Creating a Database",
            code: `CREATE DATABASE school;`,
            output:
              "Database created successfully.",
            explanation:
              "The CREATE DATABASE statement creates a new database.",
            realWorldUse:
              "Applications use databases to store information such as users, products, orders, and transactions.",
          },
        ],

        importantPoints: [
          "MySQL is a relational database management system.",
          "SQL is used to communicate with MySQL.",
          "Data is commonly organized using tables.",
        ],

        commonMistakes: [
          "Forgetting the semicolon at the end of SQL statements.",
          "Using an incorrect table or database name.",
        ],

        bestPractices: [
          "Use clear database and table names.",
          "Back up important database data.",
        ],

        realWorldUses: [
          "Web applications",
          "Business applications",
          "Customer management systems",
          "Billing systems",
        ],

        questions: [
          {
            id: "mysql-lesson-1-question-1",
            question: "What is MySQL?",
            answer:
              "MySQL is a relational database management system used to store and manage structured data.",
            shortAnswer:
              "MySQL is a relational database management system.",
            difficulty: "beginner",
          },
        ],
      },
    ],

    learningObjectives: [
      "Understand what MySQL is.",
      "Understand databases and tables.",
      "Write a basic SQL database statement.",
    ],

    keyPoints: [
      "MySQL is an RDBMS.",
      "SQL is used to work with MySQL.",
    ],

    practiceAvailable: false,
    available: true,
    displayOrder: 1,
  },
];