// =====================================================
// DLTJ2.1
// CHAPTER DATA
// FILE: src/data/chapters/mysqlChapters.ts
// =====================================================

import type { Chapter } from "../../../types/Chapter";
// =====================================================
// MYSQL CHAPTER TITLES
// =====================================================

const titles = [
  "What is Database?",
  "What is Data?",
  "Types of Databases",
  "What is DBMS?",
  "Characteristics of Database Management System",
  "Database Structure",
  "Data Model",
  "Type of Data Model",
  "What is a Relational Database (RDBMS)?",
  "Type of Relationships",
  "Difference between DBMS and RDBMS",
  "Introduction to SQL",
  "Components of SQL",
  "SQL Datatypes",
  "SQL Constraints",
];

// =====================================================
// MYSQL CHAPTERS
// =====================================================

export const mysqlChapters: Chapter[] = titles.map(
  (title, index) => {
    const chapterNumber = index + 1;

    return {
      id: `mysql-chapter-${chapterNumber}`,

      technologyId: "mysql",

      chapterNumber,

      title,

      description:
        `Learn ${title} with database concepts and SQL examples.`,

      displayOrder: chapterNumber,

      available: true,

      completed: false,
    };
  }
);