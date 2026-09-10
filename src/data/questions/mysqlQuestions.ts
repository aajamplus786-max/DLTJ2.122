// =====================================================
// DLTJ2.1
// PHASE 2 — MYSQL QUESTIONS
// FILE: src/data/questions/mysqlQuestions.ts
// =====================================================

import {
  createQuestion,
} from "./index";

export const mysqlQuestions = [
  createQuestion("mysql", 1, 1, "What is MySQL?", ["A relational database system", "A browser", "A programming language", "An operating system"], 0),
  createQuestion("mysql", 1, 2, "Which command retrieves data?", ["SELECT", "GET", "FETCH", "READ"], 0),
  createQuestion("mysql", 1, 3, "Which command adds new rows?", ["INSERT", "ADD", "CREATE ROW", "APPEND"], 0),
  createQuestion("mysql", 2, 4, "Which command modifies existing data?", ["UPDATE", "MODIFY", "CHANGE", "ALTER DATA"], 0),
  createQuestion("mysql", 2, 5, "Which command removes rows?", ["DELETE", "REMOVE", "DROP ROW", "CLEAR"], 0),
  createQuestion("mysql", 3, 6, "Which command creates a database?", ["CREATE DATABASE", "NEW DATABASE", "MAKE DATABASE", "ADD DATABASE"], 0),
  createQuestion("mysql", 3, 7, "Which command creates a table?", ["CREATE TABLE", "NEW TABLE", "MAKE TABLE", "ADD TABLE"], 0),
  createQuestion("mysql", 4, 8, "Which clause filters rows?", ["WHERE", "FILTER", "HAVING", "SELECT"], 0),
  createQuestion("mysql", 4, 9, "Which clause sorts query results?", ["ORDER BY", "SORT BY", "GROUP BY", "ARRANGE BY"], 0),
  createQuestion("mysql", 5, 10, "Which clause groups rows?", ["GROUP BY", "GROUP", "ORDER BY", "COLLECT BY"], 0),
  createQuestion("mysql", 5, 11, "Which keyword removes duplicate results?", ["DISTINCT", "UNIQUE", "ONLY", "DEDUP"], 0),
  createQuestion("mysql", 6, 12, "Which constraint uniquely identifies a row?", ["PRIMARY KEY", "UNIQUE KEY", "IDENTIFIER", "ROW KEY"], 0),
  createQuestion("mysql", 6, 13, "Which constraint references another table?", ["FOREIGN KEY", "REFERENCE KEY", "LINK KEY", "TABLE KEY"], 0),
  createQuestion("mysql", 7, 14, "Which function counts rows?", ["COUNT()", "TOTAL()", "ROWS()", "NUMBER()"], 0),
  createQuestion("mysql", 7, 15, "Which function calculates an average?", ["AVG()", "MEAN()", "AVERAGE()", "MID()"], 0),
  createQuestion("mysql", 8, 16, "Which join returns matching rows from both tables?", ["INNER JOIN", "MATCH JOIN", "COMMON JOIN", "EQUAL JOIN"], 0),
  createQuestion("mysql", 8, 17, "Which join returns all rows from the left table?", ["LEFT JOIN", "LEFT OUTER ONLY", "LEFT MATCH", "OUTER LEFT"], 0),
  createQuestion("mysql", 9, 18, "Which command changes table structure?", ["ALTER TABLE", "CHANGE TABLE", "MODIFY TABLE", "UPDATE TABLE"], 0),
  createQuestion("mysql", 9, 19, "Which command removes a table?", ["DROP TABLE", "DELETE TABLE", "REMOVE TABLE", "CLEAR TABLE"], 0),
  createQuestion("mysql", 10, 20, "Which command commits a transaction?", ["COMMIT", "SAVE", "APPLY", "CONFIRM"], 0),
];