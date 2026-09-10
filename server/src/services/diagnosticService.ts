// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/services/diagnosticService.ts
// DATE: 2026-08-31
// =====================================================

export type DiagnosticSeverity =
  | "error"
  | "warning"
  | "info";

export interface Diagnostic {
  severity: DiagnosticSeverity;
  message: string;
  line?: number;
  column?: number;
}

export interface DiagnosticResult {
  diagnostics: Diagnostic[];
}

function checkBrackets(
  code: string,
): Diagnostic[] {
  const diagnostics: Diagnostic[] =
    [];

  const stack: Array<{
    character: string;
    line: number;
  }> = [];

  const pairs: Record<
    string,
    string
  > = {
    "(": ")",
    "[": "]",
    "{": "}",
  };

  const lines =
    code.split("\n");

  lines.forEach(
    (line, lineIndex) => {
      for (
        const character of line
      ) {
        if (pairs[character]) {
          stack.push({
            character,
            line:
              lineIndex + 1,
          });
          continue;
        }

        if (
          character === ")" ||
          character === "]" ||
          character === "}"
        ) {
          const last =
            stack.pop();

          if (
            !last ||
            pairs[last.character] !==
              character
          ) {
            diagnostics.push({
              severity: "error",
              message:
                `Unexpected '${character}'.`,
              line:
                lineIndex + 1,
            });
          }
        }
      }
    },
  );

  for (
    const item of stack
  ) {
    diagnostics.push({
      severity: "error",
      message:
        `Unclosed '${item.character}'.`,
      line: item.line,
    });
  }

  return diagnostics;
}

function checkEmptyCode(
  code: string,
): Diagnostic[] {
  if (!code.trim()) {
    return [
      {
        severity: "warning",
        message:
          "The editor is empty.",
      },
    ];
  }

  return [];
}

export function diagnoseCode(
  language: string,
  code: string,
): DiagnosticResult {
  const diagnostics: Diagnostic[] =
    [];

  diagnostics.push(
    ...checkEmptyCode(code),
  );

  if (
    code.trim()
  ) {
    diagnostics.push(
      ...checkBrackets(code),
    );
  }

  if (
    language === "python" &&
    /\t/.test(code) &&
    / {4}/.test(code)
  ) {
    diagnostics.push({
      severity: "warning",
      message:
        "Mixed indentation may cause Python formatting issues.",
    });
  }

  return {
    diagnostics,
  };
}