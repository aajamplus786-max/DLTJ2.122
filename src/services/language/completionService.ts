// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/services/language/completionService.ts
// =====================================================

import {
    getLanguageById,
    type SupportedLanguage,
  } from "./languageService";
  
  export interface CompletionItem {
    label: string;
    kind:
      | "keyword"
      | "function"
      | "snippet"
      | "property"
      | "tag"
      | "value";
    detail?: string;
    insertText?: string;
  }
  
  const commonCompletions: CompletionItem[] = [
    {
      label: "console.log",
      kind: "function",
      detail: "JavaScript / TypeScript",
      insertText: "console.log()",
    },
    {
      label: "function",
      kind: "keyword",
      detail: "Function declaration",
    },
    {
      label: "const",
      kind: "keyword",
      detail: "Constant variable",
    },
    {
      label: "let",
      kind: "keyword",
      detail: "Variable declaration",
    },
    {
      label: "return",
      kind: "keyword",
      detail: "Return statement",
    },
  ];
  
  const languageSnippets: Record<
    SupportedLanguage,
    CompletionItem[]
  > = {
    html: [
      {
        label: "html",
        kind: "snippet",
        detail: "HTML document",
        insertText:
          "<!DOCTYPE html>\n<html>\n<head>\n  <title></title>\n</head>\n<body>\n  \n</body>\n</html>",
      },
      {
        label: "div",
        kind: "tag",
        detail: "HTML div element",
        insertText: "<div></div>",
      },
      {
        label: "button",
        kind: "tag",
        detail: "HTML button",
        insertText: "<button></button>",
      },
      {
        label: "input",
        kind: "tag",
        detail: "HTML input",
        insertText: '<input type="text" />',
      },
    ],
  
    css: [
      {
        label: "display",
        kind: "property",
        detail: "CSS display property",
      },
      {
        label: "color",
        kind: "property",
        detail: "CSS color property",
      },
      {
        label: "background",
        kind: "property",
        detail: "CSS background property",
      },
      {
        label: "margin",
        kind: "property",
        detail: "CSS margin property",
      },
      {
        label: "padding",
        kind: "property",
        detail: "CSS padding property",
      },
      {
        label: "flex",
        kind: "property",
        detail: "CSS flex layout",
      },
    ],
  
    javascript: commonCompletions,
  
    typescript: [
      ...commonCompletions,
      {
        label: "interface",
        kind: "keyword",
        detail: "TypeScript interface",
      },
      {
        label: "type",
        kind: "keyword",
        detail: "Type alias",
      },
      {
        label: "string",
        kind: "value",
        detail: "String type",
      },
      {
        label: "number",
        kind: "value",
        detail: "Number type",
      },
      {
        label: "boolean",
        kind: "value",
        detail: "Boolean type",
      },
    ],
  
    python: [
      {
        label: "def",
        kind: "keyword",
        detail: "Python function",
      },
      {
        label: "print",
        kind: "function",
        detail: "Python output",
        insertText: "print()",
      },
      {
        label: "class",
        kind: "keyword",
        detail: "Python class",
      },
      {
        label: "import",
        kind: "keyword",
      },
      {
        label: "return",
        kind: "keyword",
      },
    ],
  
    c: [
      {
        label: "printf",
        kind: "function",
        detail: "C output",
        insertText: 'printf("");',
      },
      {
        label: "scanf",
        kind: "function",
        detail: "C input",
        insertText: 'scanf("");',
      },
      {
        label: "int",
        kind: "keyword",
      },
      {
        label: "return",
        kind: "keyword",
      },
    ],
  
    cpp: [
      {
        label: "cout",
        kind: "function",
        detail: "C++ output",
        insertText: "cout << ;",
      },
      {
        label: "cin",
        kind: "function",
        detail: "C++ input",
        insertText: "cin >> ;",
      },
      {
        label: "class",
        kind: "keyword",
      },
      {
        label: "namespace",
        kind: "keyword",
      },
    ],
  
    java: [
      {
        label: "public",
        kind: "keyword",
      },
      {
        label: "class",
        kind: "keyword",
      },
      {
        label: "System.out.println",
        kind: "function",
        detail: "Java output",
        insertText: "System.out.println();",
      },
      {
        label: "private",
        kind: "keyword",
      },
    ],
  
    sql: [
      {
        label: "SELECT",
        kind: "keyword",
      },
      {
        label: "FROM",
        kind: "keyword",
      },
      {
        label: "WHERE",
        kind: "keyword",
      },
      {
        label: "INSERT INTO",
        kind: "keyword",
      },
      {
        label: "UPDATE",
        kind: "keyword",
      },
      {
        label: "DELETE",
        kind: "keyword",
      },
      {
        label: "CREATE TABLE",
        kind: "keyword",
      },
    ],
  
    json: [
      {
        label: "true",
        kind: "value",
      },
      {
        label: "false",
        kind: "value",
      },
      {
        label: "null",
        kind: "value",
      },
    ],
  
    xml: [
      {
        label: "element",
        kind: "tag",
        insertText: "<element></element>",
      },
    ],
  
    text: [],
  };
  
  export function getCompletionItems(
    language: SupportedLanguage,
    prefix = "",
  ): CompletionItem[] {
    const definition = getLanguageById(language);
  
    const keywordItems: CompletionItem[] =
      definition.keywords.map((keyword) => ({
        label: keyword,
        kind: "keyword",
      }));
  
    const allItems = [
      ...languageSnippets[language],
      ...keywordItems,
    ];
  
    const normalizedPrefix = prefix.trim().toLowerCase();
  
    if (!normalizedPrefix) {
      return allItems.slice(0, 20);
    }
  
    const unique = new Map<string, CompletionItem>();
  
    allItems
      .filter((item) =>
        item.label.toLowerCase().startsWith(normalizedPrefix),
      )
      .forEach((item) => {
        unique.set(item.label, item);
      });
  
    return Array.from(unique.values()).slice(0, 15);
  }
  
  export function getCurrentWord(
    text: string,
    cursorPosition: number,
  ): string {
    const beforeCursor = text.slice(0, cursorPosition);
  
    const match = beforeCursor.match(
      /[A-Za-z_$][A-Za-z0-9_$.-]*$/,
    );
  
    return match?.[0] ?? "";
  }