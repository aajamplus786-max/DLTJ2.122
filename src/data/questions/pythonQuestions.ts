// =====================================================
// DLTJ2.1
// PHASE 2 — PYTHON QUESTIONS
// FILE: src/data/questions/pythonQuestions.ts
// =====================================================

import {
  createQuestion,
} from "./index";

export const pythonQuestions = [
  createQuestion("python", 1, 1, "Which keyword defines a function?", ["def", "function", "func", "define"], 0),
  createQuestion("python", 1, 2, "Which function displays output?", ["print()", "echo()", "display()", "write()"], 0),
  createQuestion("python", 1, 3, "Which symbol starts a comment?", ["#", "//", "/*", "<!--"], 0),
  createQuestion("python", 2, 4, "Which type stores ordered mutable items?", ["list", "tuple", "set", "dict"], 0),
  createQuestion("python", 2, 5, "Which type stores immutable ordered items?", ["tuple", "list", "set", "dict"], 0),
  createQuestion("python", 3, 6, "Which type stores key-value pairs?", ["dict", "map", "object", "pair"], 0),
  createQuestion("python", 3, 7, "Which keyword starts a conditional?", ["if", "when", "condition", "check"], 0),
  createQuestion("python", 4, 8, "Which keyword handles the alternative condition?", ["elif", "else-if", "otherwise-if", "elseif"], 0),
  createQuestion("python", 4, 9, "Which keyword handles the final alternative?", ["else", "otherwise", "default", "final"], 0),
  createQuestion("python", 5, 10, "Which loop iterates over items?", ["for", "foreach", "loop", "iterate"], 0),
  createQuestion("python", 5, 11, "Which loop repeats while a condition is true?", ["while", "repeat", "loopwhile", "until"], 0),
  createQuestion("python", 6, 12, "Which keyword exits a loop?", ["break", "exit", "stop", "end"], 0),
  createQuestion("python", 6, 13, "Which keyword skips to the next iteration?", ["continue", "skip", "next", "pass-loop"], 0),
  createQuestion("python", 7, 14, "Which keyword creates a class?", ["class", "Class", "object", "type"], 0),
  createQuestion("python", 7, 15, "Which special method initializes an object?", ["__init__", "__start__", "__newobject__", "init"], 0),
  createQuestion("python", 8, 16, "Which keyword imports a module?", ["import", "include", "require", "use"], 0),
  createQuestion("python", 8, 17, "Which keyword handles exceptions?", ["try", "catch", "except", "error"], 2),
  createQuestion("python", 9, 18, "Which keyword catches an exception?", ["except", "catch", "handle", "error"], 0),
  createQuestion("python", 9, 19, "Which function returns the length of an object?", ["len()", "length()", "size()", "count()"], 0),
  createQuestion("python", 10, 20, "Which value represents no value?", ["None", "null", "nil", "empty"], 0),
];