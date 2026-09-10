// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/services/language/formatterService.ts
// =====================================================

import type { SupportedLanguage } from "./languageService";

function formatBraces(
  code: string,
  spaces = 2,
): string {
  const lines = code
    .replace(/\r\n/g, "\n")
    .split("\n");

  let indent = 0;

  return lines
    .map((rawLine) => {
      const trimmed = rawLine.trim();

      if (!trimmed) {
        return "";
      }

      if (/^[}\])]/.test(trimmed)) {
        indent = Math.max(0, indent - 1);
      }

      const formatted = `${" ".repeat(indent * spaces)}${trimmed}`;

      if (/[{[(]\s*$/.test(trimmed)) {
        indent += 1;
      }

      return formatted;
    })
    .join("\n");
}

function formatHtml(code: string): string {
  return code
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function formatJson(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch {
    return code;
  }
}

function formatCss(code: string): string {
  return formatBraces(
    code
      .replace(/\{/g, " {\n")
      .replace(/;/g, ";\n")
      .replace(/\}/g, "\n}"),
  );
}

export function formatCode(
  code: string,
  language: SupportedLanguage,
): string {
  switch (language) {
    case "json":
      return formatJson(code);

    case "html":
    case "xml":
      return formatHtml(code);

    case "css":
      return formatCss(code);

    case "javascript":
    case "typescript":
    case "python":
    case "c":
    case "cpp":
    case "java":
      return formatBraces(code);

    default:
      return code;
  }
}

export function formatDocument(
  code: string,
  language: SupportedLanguage,
): string {
  return formatCode(code, language);
}