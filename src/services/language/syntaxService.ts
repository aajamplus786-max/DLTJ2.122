// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/services/language/syntaxService.ts
// =====================================================

import {
    getLanguageById,
    type SupportedLanguage,
  } from "./languageService";
  
  export type SyntaxTokenType =
    | "keyword"
    | "string"
    | "number"
    | "comment"
    | "function"
    | "tag"
    | "attribute"
    | "operator"
    | "plain";
  
  export interface SyntaxToken {
    text: string;
    type: SyntaxTokenType;
  }
  
  const operators = [
    "===",
    "!==",
    "==",
    "!=",
    "=>",
    "++",
    "--",
    "+=",
    "-=",
    "*=",
    "/=",
    "&&",
    "||",
    "??",
    ">=",
    "<=",
    "+",
    "-",
    "*",
    "/",
    "%",
    "=",
    ">",
    "<",
    "!",
  ];
  
  function escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  function tokenizeGeneric(
    code: string,
    language: SupportedLanguage,
  ): SyntaxToken[] {
    const definition = getLanguageById(language);
    const keywordSet = new Set(definition.keywords);
  
    const tokens: SyntaxToken[] = [];
  
    const regex =
      /(\/\*[\s\S]*?\*\/|\/\/.*|#.*|<!--[\s\S]*?-->|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|===|!==|==|!=|=>|\+\+|--|\+=|-=|\*=|\/=|&&|\|\||\?\?|>=|<=|[+\-*/%=><!])/g;
  
    let lastIndex = 0;
    let match: RegExpExecArray | null;
  
    while ((match = regex.exec(code)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          text: code.slice(lastIndex, match.index),
          type: "plain",
        });
      }
  
      const value = match[0];
  
      if (
        value.startsWith("//") ||
        value.startsWith("#") ||
        value.startsWith("/*") ||
        value.startsWith("<!--")
      ) {
        tokens.push({
          text: value,
          type: "comment",
        });
      } else if (
        value.startsWith('"') ||
        value.startsWith("'") ||
        value.startsWith("`")
      ) {
        tokens.push({
          text: value,
          type: "string",
        });
      } else if (/^\d/.test(value)) {
        tokens.push({
          text: value,
          type: "number",
        });
      } else if (keywordSet.has(value)) {
        tokens.push({
          text: value,
          type: "keyword",
        });
      } else if (operators.includes(value)) {
        tokens.push({
          text: value,
          type: "operator",
        });
      } else {
        tokens.push({
          text: value,
          type: "plain",
        });
      }
  
      lastIndex = regex.lastIndex;
    }
  
    if (lastIndex < code.length) {
      tokens.push({
        text: code.slice(lastIndex),
        type: "plain",
      });
    }
  
    return tokens;
  }
  
  function tokenizeHtml(code: string): SyntaxToken[] {
    const tokens: SyntaxToken[] = [];
  
    const regex =
      /(<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+\b)/g;
  
    let lastIndex = 0;
    let match: RegExpExecArray | null;
  
    while ((match = regex.exec(code)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          text: code.slice(lastIndex, match.index),
          type: "plain",
        });
      }
  
      const value = match[0];
  
      if (value.startsWith("<!--")) {
        tokens.push({
          text: value,
          type: "comment",
        });
      } else if (value.startsWith("<")) {
        tokens.push({
          text: value,
          type: "tag",
        });
      } else if (
        value.startsWith('"') ||
        value.startsWith("'")
      ) {
        tokens.push({
          text: value,
          type: "string",
        });
      } else {
        tokens.push({
          text: value,
          type: "number",
        });
      }
  
      lastIndex = regex.lastIndex;
    }
  
    if (lastIndex < code.length) {
      tokens.push({
        text: code.slice(lastIndex),
        type: "plain",
      });
    }
  
    return tokens;
  }
  
  export function tokenizeCode(
    code: string,
    language: SupportedLanguage,
  ): SyntaxToken[] {
    if (language === "html" || language === "xml") {
      return tokenizeHtml(code);
    }
  
    return tokenizeGeneric(code, language);
  }
  
  export function highlightCode(
    code: string,
    language: SupportedLanguage,
  ): string {
    return tokenizeCode(code, language)
      .map((token) => {
        const safeText = escapeHtml(token.text);
  
        return `<span class="syntax-${token.type}">${safeText}</span>`;
      })
      .join("");
  }
  
  export function getIndentLevel(line: string): number {
    const match = line.match(/^\s*/);
    return match ? match[0].replace(/\t/g, "    ").length : 0;
  }
  
  export function calculateIndent(
    codeBeforeCursor: string,
  ): number {
    const lines = codeBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1] ?? "";
  
    let indent = getIndentLevel(currentLine);
  
    if (/[{\[(]\s*$/.test(currentLine)) {
      indent += 2;
    }
  
    return indent;
  }