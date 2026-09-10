// =====================================================
// DLTJ2.1
// PHASE 2 — C++ QUESTIONS
// FILE: src/data/questions/cppQuestions.ts
// =====================================================

import {
  createQuestion,
} from "./index";

export const cppQuestions = [
  createQuestion("cpp", 1, 1, "Which language is C++ based on?", ["C", "Java", "Python", "C#"], 0),
  createQuestion("cpp", 1, 2, "Which keyword defines a class?", ["class", "struct", "object", "type"], 0),
  createQuestion("cpp", 1, 3, "Which object is used for standard output?", ["cout", "print", "output", "console"], 0),
  createQuestion("cpp", 2, 4, "Which object is used for standard input?", ["cin", "input", "read", "scan"], 0),
  createQuestion("cpp", 2, 5, "Which operator is used with cout?", ["<<", ">>", "<-", "=>"], 0),
  createQuestion("cpp", 3, 6, "Which operator is used with cin?", [">>", "<<", "<-", "->"], 0),
  createQuestion("cpp", 3, 7, "Which keyword creates an object dynamically?", ["new", "create", "malloc", "object"], 0),
  createQuestion("cpp", 4, 8, "Which keyword releases dynamically allocated memory?", ["delete", "free", "remove", "release"], 0),
  createQuestion("cpp", 4, 9, "Which feature allows multiple functions with the same name?", ["function overloading", "inheritance", "encapsulation", "templates"], 0),
  createQuestion("cpp", 5, 10, "Which feature allows a class to inherit another class?", ["inheritance", "overloading", "composition", "casting"], 0),
  createQuestion("cpp", 5, 11, "Which keyword refers to the current object?", ["this", "self", "current", "object"], 0),
  createQuestion("cpp", 6, 12, "Which keyword prevents modification of a variable?", ["const", "fixed", "final", "readonly"], 0),
  createQuestion("cpp", 6, 13, "Which keyword defines a virtual function?", ["virtual", "dynamic", "override", "abstract"], 0),
  createQuestion("cpp", 7, 14, "Which keyword indicates method overriding?", ["override", "virtual", "redefine", "replace"], 0),
  createQuestion("cpp", 7, 15, "Which feature allows generic programming?", ["templates", "generics", "patterns", "macros"], 0),
  createQuestion("cpp", 8, 16, "Which namespace contains standard library features?", ["std", "standard", "cpp", "system"], 0),
  createQuestion("cpp", 8, 17, "Which container stores ordered dynamic elements?", ["vector", "array", "set", "map"], 0),
  createQuestion("cpp", 9, 18, "Which container stores key-value pairs?", ["map", "vector", "set", "queue"], 0),
  createQuestion("cpp", 9, 19, "Which keyword is used for exception handling?", ["try", "catch", "throw", "All of these"], 3),
  createQuestion("cpp", 10, 20, "Which keyword explicitly raises an exception?", ["throw", "raise", "error", "exception"], 0),
];