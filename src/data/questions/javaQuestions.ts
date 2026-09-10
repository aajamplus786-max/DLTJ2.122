// =====================================================
// DLTJ2.1
// PHASE 2 — JAVA QUESTIONS
// FILE: src/data/questions/javaQuestions.ts
// =====================================================

import {
  createQuestion,
} from "./index";

export const javaQuestions = [
  createQuestion("java", 1, 1, "Which keyword defines a class?", ["class", "Class", "define", "type"], 0),
  createQuestion("java", 1, 2, "Which method is the common Java program entry point?", ["main()", "start()", "run()", "execute()"], 0),
  createQuestion("java", 1, 3, "Which keyword creates an object?", ["new", "create", "object", "instance"], 0),
  createQuestion("java", 2, 4, "Which type stores true or false?", ["boolean", "bool", "logical", "bit"], 0),
  createQuestion("java", 2, 5, "Which keyword inherits a class?", ["extends", "inherits", "implements", "super"], 0),
  createQuestion("java", 3, 6, "Which keyword implements an interface?", ["implements", "extends", "interface", "inherit"], 0),
  createQuestion("java", 3, 7, "Which keyword prevents a class from being inherited?", ["final", "static", "private", "sealed"], 0),
  createQuestion("java", 4, 8, "Which collection stores key-value pairs?", ["Map", "List", "Set", "Queue"], 0),
  createQuestion("java", 4, 9, "Which collection does not allow duplicate elements?", ["Set", "List", "Array", "Map"], 0),
  createQuestion("java", 5, 10, "Which keyword handles an exception?", ["catch", "handle", "error", "exception"], 0),
  createQuestion("java", 5, 11, "Which block always executes after try/catch?", ["finally", "final", "after", "complete"], 0),
  createQuestion("java", 6, 12, "Which keyword is used to create a subclass?", ["extends", "subclass", "inherits", "child"], 0),
  createQuestion("java", 6, 13, "Which keyword refers to the current object?", ["this", "self", "current", "object"], 0),
  createQuestion("java", 7, 14, "Which keyword refers to the parent class?", ["super", "parent", "base", "this"], 0),
  createQuestion("java", 7, 15, "Which access modifier allows access from anywhere?", ["public", "private", "protected", "default"], 0),
  createQuestion("java", 8, 16, "Which access modifier restricts access to the same class?", ["private", "public", "protected", "internal"], 0),
  createQuestion("java", 8, 17, "Which keyword is used for a method that belongs to the class?", ["static", "class", "shared", "global"], 0),
  createQuestion("java", 9, 18, "Which interface is commonly used to create a thread task?", ["Runnable", "Threadable", "Task", "ExecutorTask"], 0),
  createQuestion("java", 9, 19, "Which keyword starts exception handling?", ["try", "catch", "throw", "throws"], 0),
  createQuestion("java", 10, 20, "Which keyword explicitly throws an exception?", ["throw", "throws", "exception", "raise"], 0),
];