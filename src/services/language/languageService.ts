// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/services/language/languageService.ts
// =====================================================

export type SupportedLanguage =
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "python"
  | "c"
  | "cpp"
  | "java"
  | "sql"
  | "json"
  | "xml"
  | "text";

export interface LanguageDefinition {
  id: SupportedLanguage;
  name: string;
  extensions: string[];
  comment: string;
  multilineCommentStart?: string;
  multilineCommentEnd?: string;
  keywords: string[];
  brackets: string[];
}

const languages: LanguageDefinition[] = [
  {
    id: "html",
    name: "HTML",
    extensions: [".html", ".htm"],
    comment: "<!--",
    multilineCommentStart: "<!--",
    multilineCommentEnd: "-->",
    keywords: [
      "html",
      "head",
      "body",
      "title",
      "div",
      "span",
      "p",
      "a",
      "img",
      "button",
      "form",
      "input",
      "script",
      "style",
      "section",
      "header",
      "footer",
      "main",
    ],
    brackets: ["<", ">", "{", "}"],
  },

  {
    id: "css",
    name: "CSS",
    extensions: [".css"],
    comment: "//",
    multilineCommentStart: "/*",
    multilineCommentEnd: "*/",
    keywords: [
      "color",
      "background",
      "display",
      "position",
      "margin",
      "padding",
      "width",
      "height",
      "font-size",
      "font-family",
      "border",
      "flex",
      "grid",
      "justify-content",
      "align-items",
    ],
    brackets: ["{", "}", "(", ")"],
  },

  {
    id: "javascript",
    name: "JavaScript",
    extensions: [".js", ".jsx", ".mjs"],
    comment: "//",
    multilineCommentStart: "/*",
    multilineCommentEnd: "*/",
    keywords: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "new",
      "class",
      "extends",
      "import",
      "export",
      "from",
      "async",
      "await",
      "try",
      "catch",
      "throw",
      "true",
      "false",
      "null",
      "undefined",
    ],
    brackets: ["{", "}", "(", ")", "[", "]"],
  },

  {
    id: "typescript",
    name: "TypeScript",
    extensions: [".ts", ".tsx"],
    comment: "//",
    multilineCommentStart: "/*",
    multilineCommentEnd: "*/",
    keywords: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "interface",
      "type",
      "enum",
      "public",
      "private",
      "protected",
      "readonly",
      "extends",
      "implements",
      "import",
      "export",
      "from",
      "async",
      "await",
      "string",
      "number",
      "boolean",
      "unknown",
      "any",
      "void",
      "true",
      "false",
      "null",
      "undefined",
    ],
    brackets: ["{", "}", "(", ")", "[", "]"],
  },

  {
    id: "python",
    name: "Python",
    extensions: [".py"],
    comment: "#",
    multilineCommentStart: '"""',
    multilineCommentEnd: '"""',
    keywords: [
      "def",
      "return",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "in",
      "import",
      "from",
      "as",
      "class",
      "try",
      "except",
      "finally",
      "with",
      "lambda",
      "yield",
      "async",
      "await",
      "True",
      "False",
      "None",
      "and",
      "or",
      "not",
      "is",
    ],
    brackets: ["(", ")", "[", "]", "{", "}"],
  },

  {
    id: "c",
    name: "C",
    extensions: [".c", ".h"],
    comment: "//",
    multilineCommentStart: "/*",
    multilineCommentEnd: "*/",
    keywords: [
      "int",
      "char",
      "float",
      "double",
      "void",
      "long",
      "short",
      "unsigned",
      "signed",
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "return",
      "struct",
      "typedef",
      "const",
      "static",
      "sizeof",
    ],
    brackets: ["{", "}", "(", ")", "[", "]"],
  },

  {
    id: "cpp",
    name: "C++",
    extensions: [".cpp", ".cc", ".cxx", ".hpp"],
    comment: "//",
    multilineCommentStart: "/*",
    multilineCommentEnd: "*/",
    keywords: [
      "int",
      "char",
      "float",
      "double",
      "void",
      "auto",
      "bool",
      "string",
      "class",
      "public",
      "private",
      "protected",
      "namespace",
      "using",
      "template",
      "if",
      "else",
      "for",
      "while",
      "switch",
      "case",
      "break",
      "continue",
      "return",
      "new",
      "delete",
      "const",
      "static",
      "virtual",
    ],
    brackets: ["{", "}", "(", ")", "[", "]"],
  },

  {
    id: "java",
    name: "Java",
    extensions: [".java"],
    comment: "//",
    multilineCommentStart: "/*",
    multilineCommentEnd: "*/",
    keywords: [
      "class",
      "public",
      "private",
      "protected",
      "static",
      "final",
      "void",
      "int",
      "long",
      "double",
      "float",
      "boolean",
      "char",
      "new",
      "return",
      "if",
      "else",
      "for",
      "while",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "extends",
      "implements",
      "interface",
      "package",
      "import",
      "this",
      "super",
      "try",
      "catch",
      "finally",
      "throw",
    ],
    brackets: ["{", "}", "(", ")", "[", "]"],
  },

  {
    id: "sql",
    name: "SQL",
    extensions: [".sql"],
    comment: "--",
    multilineCommentStart: "/*",
    multilineCommentEnd: "*/",
    keywords: [
      "SELECT",
      "FROM",
      "WHERE",
      "INSERT",
      "INTO",
      "VALUES",
      "UPDATE",
      "SET",
      "DELETE",
      "CREATE",
      "ALTER",
      "DROP",
      "TABLE",
      "DATABASE",
      "JOIN",
      "LEFT",
      "RIGHT",
      "INNER",
      "OUTER",
      "GROUP",
      "BY",
      "ORDER",
      "HAVING",
      "LIMIT",
      "AS",
      "AND",
      "OR",
      "NOT",
      "NULL",
      "PRIMARY",
      "KEY",
      "FOREIGN",
    ],
    brackets: ["(", ")", "[", "]"],
  },

  {
    id: "json",
    name: "JSON",
    extensions: [".json"],
    comment: "",
    keywords: ["true", "false", "null"],
    brackets: ["{", "}", "[", "]"],
  },

  {
    id: "xml",
    name: "XML",
    extensions: [".xml"],
    comment: "<!--",
    multilineCommentStart: "<!--",
    multilineCommentEnd: "-->",
    keywords: [],
    brackets: ["<", ">"],
  },

  {
    id: "text",
    name: "Plain Text",
    extensions: [".txt", ".md"],
    comment: "",
    keywords: [],
    brackets: [],
  },
];

export function getLanguages(): LanguageDefinition[] {
  return languages;
}

export function getLanguageById(
  id: SupportedLanguage,
): LanguageDefinition {
  return (
    languages.find((language) => language.id === id) ??
    languages.find((language) => language.id === "text")!
  );
}

export function getLanguageFromFileName(
  fileName: string,
): SupportedLanguage {
  const lowerName = fileName.toLowerCase();

  const language = languages.find((item) =>
    item.extensions.some((extension) => lowerName.endsWith(extension)),
  );

  return language?.id ?? "text";
}

export function getLanguageName(
  language: SupportedLanguage,
): string {
  return getLanguageById(language).name;
}

export function isLanguageSupported(
  language: string,
): language is SupportedLanguage {
  return languages.some((item) => item.id === language);
}