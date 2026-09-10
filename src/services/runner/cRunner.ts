// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/cRunner.ts
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
  
  function validateC(
    code: string,
  ): string | null {
    const requiredBrackets = [
      ["(", ")"],
      ["{", "}"],
      ["[", "]"],
    ];
  
    for (const [
      opening,
      closing,
    ] of requiredBrackets) {
      const openCount =
        code.split(opening).length - 1;
  
      const closeCount =
        code.split(closing).length - 1;
  
      if (openCount !== closeCount) {
        return `Unbalanced '${opening}${closing}' brackets.`;
      }
    }
  
    return null;
  }
  
  export const cRunner: Runner = {
    language: "c",
    mode: "backend",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return request.language === "c";
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const file = getFile(
        request,
        [".c", ".h"],
      );
  
      if (!file) {
        return {
          success: false,
          language: "c",
          mode: "backend",
          output: [
            {
              type: "stderr",
              message:
                "No C source file was found.",
            },
          ],
          error:
            "No C source file was found.",
        };
      }
  
      const validationError =
        validateC(
          file.content,
        );
  
      if (validationError) {
        return {
          success: false,
          language: "c",
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
        language: "c",
        mode: "backend",
        output: [
          {
            type: "info",
            message:
              `C source prepared for secure backend compilation: ${file.name}.`,
          },
        ],
        executable:
          file.content,
      };
    },
  };
  
  export default cRunner;