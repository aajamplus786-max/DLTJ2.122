// =====================================================
// DLTJ2.0
// STEP 6.1
// FILE: src/data/practice.ts
// =====================================================

import type { Practice } from "../types/Practice";

// =====================================================
// PRACTICE DATA
// =====================================================

export const practiceData: Practice[] = [

  // ===================================================
  // HTML
  // ===================================================

  {
    id: "html-practice-1",
    chapterId: "html-1",
    title: "Create Your First HTML Page",
    description:
      "Create a basic HTML page containing a heading and a paragraph.",
    type: "code",
    instructions: [
      "Create an HTML document.",
      "Add an h1 heading.",
      "Add a paragraph below the heading.",
      "Use valid HTML structure.",
    ],
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>

  <!-- Write your HTML here -->

</body>
</html>`,
    expectedOutput:
      "A webpage containing a heading and a paragraph.",
    enabled: true,
  },

  // ===================================================
  // CSS
  // ===================================================

  {
    id: "css-practice-1",
    chapterId: "css-1",
    title: "Style a Heading",
    description:
      "Use CSS to change the appearance of a heading.",
    type: "code",
    instructions: [
      "Create an h1 element.",
      "Add a CSS rule for the h1.",
      "Change its font size.",
      "Change its text alignment.",
    ],
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* Write your CSS here */

  </style>
</head>
<body>

  <h1>Hello CSS</h1>

</body>
</html>`,
    expectedOutput:
      "A styled heading.",
    enabled: true,
  },

  // ===================================================
  // JAVASCRIPT
  // ===================================================

  {
    id: "javascript-practice-1",
    chapterId: "javascript-1",
    title: "Create Variables",
    description:
      "Create JavaScript variables and display their values.",
    type: "code",
    instructions: [
      "Create a variable named name.",
      "Store your name inside it.",
      "Create a variable named age.",
      "Store a number inside it.",
      "Print both variables using console.log().",
    ],
    starterCode: `let name = "";
let age = 0;

// Write your code here

console.log(name);
console.log(age);`,
    expectedOutput:
      "The name and age should be displayed.",
    enabled: true,
  },

  // ===================================================
  // JAVA
  // ===================================================

  {
    id: "java-practice-1",
    chapterId: "java-1",
    title: "Hello Java",
    description:
      "Write your first Java program and display a message.",
    type: "code",
    instructions: [
      "Create a class named Main.",
      "Create the main() method.",
      "Use System.out.println().",
      "Print Hello Java.",
    ],
    starterCode: `class Main {
    public static void main(String[] args) {

        // Write your code here

    }
}`,
    expectedOutput:
      "Hello Java",
    enabled: true,
  },

  // ===================================================
  // MYSQL
  // ===================================================

  {
    id: "mysql-practice-1",
    chapterId: "mysql-1",
    title: "Create a Database",
    description:
      "Write an SQL statement to create a database.",
    type: "code",
    instructions: [
      "Write a CREATE DATABASE statement.",
      "Use the database name school.",
      "End the SQL statement with a semicolon.",
    ],
    starterCode: `-- Write your SQL code here

`,
    expectedOutput:
      "Database school created.",
    enabled: true,
  },

  // ===================================================
  // PYTHON
  // ===================================================

  {
    id: "python-practice-1",
    chapterId: "python-1",
    title: "Python Variables",
    description:
      "Create variables in Python and print their values.",
    type: "code",
    instructions: [
      "Create a variable called name.",
      "Store your name in the variable.",
      "Create an age variable.",
      "Print both values.",
    ],
    starterCode: `name = ""
age = 0

# Write your code here

print(name)
print(age)`,
    expectedOutput:
      "The name and age should be displayed.",
    enabled: true,
  },

  // ===================================================
  // C
  // ===================================================

  {
    id: "c-practice-1",
    chapterId: "c-1",
    title: "Hello C",
    description:
      "Write a basic C program that prints a message.",
    type: "code",
    instructions: [
      "Include stdio.h.",
      "Create the main() function.",
      "Use printf().",
      "Print Hello C.",
    ],
    starterCode: `#include <stdio.h>

int main() {

    // Write your code here

    return 0;
}`,
    expectedOutput:
      "Hello C",
    enabled: true,
  },

  // ===================================================
  // C++
  // ===================================================

  {
    id: "cpp-practice-1",
    chapterId: "cpp-1",
    title: "Hello C++",
    description:
      "Write a basic C++ program that prints a message.",
    type: "code",
    instructions: [
      "Include iostream.",
      "Create the main() function.",
      "Use cout.",
      "Print Hello C++.",
    ],
    starterCode: `#include <iostream>
using namespace std;

int main() {

    // Write your code here

    return 0;
}`,
    expectedOutput:
      "Hello C++",
    enabled: true,
  },

  // ===================================================
  // REACT
  // ===================================================

  {
    id: "react-practice-1",
    chapterId: "react-1",
    title: "Create a React Component",
    description:
      "Create a simple React component that displays a heading.",
    type: "editor",
    instructions: [
      "Create a functional React component.",
      "Return JSX.",
      "Display a heading.",
      "Export the component.",
    ],
    starterCode: `function App() {
  return (
    <div>
      {/* Write your JSX here */}
    </div>
  );
}

export default App;`,
    expectedOutput:
      "A React page containing a heading.",
    enabled: true,
  },

  // ===================================================
  // TYPESCRIPT
  // ===================================================

  {
    id: "typescript-practice-1",
    chapterId: "typescript-1",
    title: "TypeScript Variable",
    description:
      "Create a typed variable using TypeScript.",
    type: "code",
    instructions: [
      "Create a variable named name.",
      "Give it the type string.",
      "Assign a value.",
      "Print the value.",
    ],
    starterCode: `let name: string = "";

// Write your code here

console.log(name);`,
    expectedOutput:
      "The name should be displayed.",
    enabled: true,
  },

  // ===================================================
  // SPRING
  // ===================================================

  {
    id: "spring-practice-1",
    chapterId: "spring-1",
    title: "Spring Application",
    description:
      "Understand the basic structure of a Spring Boot application.",
    type: "code",
    instructions: [
      "Create the main application class.",
      "Use SpringBootApplication.",
      "Create the main() method.",
      "Start the Spring application.",
    ],
    starterCode: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {

        // Start the application

    }
}`,
    expectedOutput:
      "Spring Boot application starts successfully.",
    enabled: true,
  },
];
// =====================================================
// GET ALL PRACTICE
// =====================================================

export function getAllPractice(): Practice[] {
  return practiceData.filter((practice) => {
    return practice.enabled;
  });
}

// =====================================================
// GET PRACTICE BY CHAPTER
// =====================================================

export function getPracticeByChapter(
  chapterId: string
): Practice | undefined {
  return practiceData.find((practice) => {
    return (
      practice.chapterId === chapterId &&
      practice.enabled
    );
  });
}

// =====================================================
// GET PRACTICE BY TECHNOLOGY
// =====================================================

export function getPracticeByTechnology(
  technologyId: string
): Practice[] {
  return practiceData.filter((practice) => {
    return (
      practice.id.startsWith(`${technologyId}-`) &&
      practice.enabled
    );
  });
}