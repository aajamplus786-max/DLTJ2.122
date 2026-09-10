// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/cppRunner.ts
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
  
  function validateCpp(
    code: string,
  ): string | null {
    const stack: string[] = [];
  
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
        stack.push(
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
          stack.pop();
  
        if (expected !== character) {
          return `Unexpected token '${character}'.`;
        }
      }
    }
  
    if (stack.length > 0) {
      return "Unclosed C++ bracket detected.";
    }
  
    return null;
  }
  
  export const cppRunner: Runner = {
    language: "cpp",
    mode: "backend",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return request.language === "cpp";
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const file = getFile(
        request,
        [
          ".cpp",
          ".cc",
          ".cxx",
          ".hpp",
        ],
      );
  
      if (!file) {
        return {
          success: false,
          language: "cpp",
          mode: "backend",
          output: [
            {
              type: "stderr",
              message:
                "No C++ source file was found.",
            },
          ],
          error:
            "No C++ source file was found.",
        };
      }
  
      const validationError =
        validateCpp(
          file.content,
        );
  
      if (validationError) {
        return {
          success: false,
          language: "cpp",
          mode: "backend",
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
        language: "cpp",
        mode: "backend",
        output: [
          {
            type: "info",
            message:
              `C++ source prepared for secure backend compilation: ${file.name}.`,
          },
        ],
        executable:
          file.content,
      };
    },
  };
  
  export default cppRunner;