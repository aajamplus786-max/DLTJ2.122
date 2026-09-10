// =====================================================
// DLTJ2.1
// PHASE 2 — C QUESTIONS
// FILE: src/data/questions/cQuestions.ts
// =====================================================

import {
  createQuestion,
} from "./index";

export const cQuestions = [
  createQuestion("c", 1, 1, "Which function is the entry point of a C program?", ["main()", "start()", "run()", "begin()"], 0),
  createQuestion("c", 1, 2, "Which header provides printf()?", ["stdio.h", "stdlib.h", "string.h", "math.h"], 0),
  createQuestion("c", 1, 3, "Which symbol ends a C statement?", [";", ":", ".", ","], 0),
  createQuestion("c", 2, 4, "Which type stores an integer?", ["int", "integer", "number", "whole"], 0),
  createQuestion("c", 2, 5, "Which type stores a single character?", ["char", "character", "string", "byte"], 0),
  createQuestion("c", 3, 6, "Which operator gets the address of a variable?", ["&", "*", "@", "#"], 0),
  createQuestion("c", 3, 7, "Which operator dereferences a pointer?", ["*", "&", "->", "%"], 0),
  createQuestion("c", 4, 8, "Which keyword defines a constant variable?", ["const", "constant", "fixed", "final"], 0),
  createQuestion("c", 4, 9, "Which statement is used for decisions?", ["if", "when", "check", "condition"], 0),
  createQuestion("c", 5, 10, "Which loop is commonly used when the iteration count is known?", ["for", "while", "do", "repeat"], 0),
  createQuestion("c", 5, 11, "Which loop executes at least once?", ["do...while", "while", "for", "repeat"], 0),
  createQuestion("c", 6, 12, "Which keyword exits a loop?", ["break", "exit", "stop", "end"], 0),
  createQuestion("c", 6, 13, "Which keyword skips the current iteration?", ["continue", "skip", "next", "pass"], 0),
  createQuestion("c", 7, 14, "Which function allocates dynamic memory?", ["malloc()", "alloc()", "memory()", "new()"], 0),
  createQuestion("c", 7, 15, "Which function releases allocated memory?", ["free()", "delete()", "release()", "clear()"], 0),
  createQuestion("c", 8, 16, "Which keyword defines a structure?", ["struct", "structure", "record", "type"], 0),
  createQuestion("c", 8, 17, "Which header provides string functions?", ["string.h", "strings.h", "stdio.h", "stdlib.h"], 0),
  createQuestion("c", 9, 18, "Which function reads formatted input?", ["scanf()", "read()", "input()", "get()"], 0),
  createQuestion("c", 9, 19, "Which function writes formatted output?", ["printf()", "print()", "write()", "output()"], 0),
  createQuestion("c", 10, 20, "Which operator is used for the conditional expression?", ["?:", "??", "::", "=>"], 0),
];