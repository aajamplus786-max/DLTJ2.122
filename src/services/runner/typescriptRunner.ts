// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/typescriptRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Runner,
    RunnerRequest,
    RunnerResult,
  } from "./runnerService";
  
  import {
    getFile,
  } from "./runnerService";
  
  function basicTypeScriptValidation(
    code: string,
  ): string | null {
    const brackets: string[] = [];
  
    const pairs: Record<
      string,
      string
    > = {
      "(": ")",
      "[": "]",
      "{": "}",
    };
  
    for (const character of code) {
      if (pairs[character]) {
        brackets.push(
          pairs[character],
        );
        continue;
      }
  
      if (
        character === ")" ||
        character === "]" ||
        character === "}"
      ) {
        const expected =
          brackets.pop();
  
        if (expected !== character) {
          return `Unexpected token '${character}'.`;
        }
      }
    }
  
    if (brackets.length > 0) {
      return "Unclosed bracket detected.";
    }
  
    return null;
  }
  
  export const typescriptRunner: Runner = {
    language: "typescript",
    mode: "transpile",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return (
        request.language ===
        "typescript"
      );
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const file = getFile(
        request,
        [".ts", ".tsx"],
      );
  
      if (!file) {
        return {
          success: false,
          language: "typescript",
          mode: "transpile",
          output: [
            {
              type: "stderr",
              message:
                "No TypeScript entry file was found.",
            },
          ],
          error:
            "No TypeScript entry file was found.",
        };
      }
  
      const validationError =
        basicTypeScriptValidation(
          file.content,
        );
  
      if (validationError) {
        return {
          success: false,
          language: "typescript",
          mode: "transpile",
          output: [
            {
              type: "stderr",
              message: validationError,
            },
          ],
          error: validationError,
        };
      }
  
      return {
        success: true,
        language: "typescript",
        mode: "transpile",
        output: [
          {
            type: "info",
            message:
              `TypeScript source prepared for transpilation: ${file.name}.`,
          },
        ],
        javascript:
          file.content,
      };
    },
  };
  
  export default typescriptRunner;