// =====================================================
// DLTJ2.1
// CHAPTER DATA
// FILE: src/data/chapters/mysqlChapters.ts
// =====================================================

import type { Chapter } from "../../types/Chapter";

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

export const mysqlChapters: Chapter[] = titles.map(
  (title, index) => {
    const chapterNumber = index + 1;

    return {
      id: `mysql-${chapterNumber}`,
      technologyId: "mysql",
      chapterNumber,
      title,
      description: `Learn ${title} with database concepts and SQL examples.`,
      completed: false,
      displayOrder: chapterNumber,
      available: true,
    };
  }
);