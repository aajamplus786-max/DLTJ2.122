// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/pythonRunner.ts
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
  
  function validatePython(
    code: string,
  ): string | null {
    const lines =
      code.split("\n");
  
    for (
      let index = 0;
      index < lines.length;
      index += 1
    ) {
      const line =
        lines[index].trim();
  
      if (!line) {
        continue;
      }
  
      if (
        line.startsWith("def ") &&
        !line.includes(":")
      ) {
        return `Line ${index + 1}: function definition requires ':'.`;
      }
  
      if (
        line.startsWith("if ") &&
        !line.includes(":")
      ) {
        return `Line ${index + 1}: if statement requires ':'.`;
      }
  
      if (
        line.startsWith("for ") &&
        !line.includes(":")
      ) {
        return `Line ${index + 1}: for statement requires ':'.`;
      }
  
      if (
        line.startsWith("while ") &&
        !line.includes(":")
      ) {
        return `Line ${index + 1}: while statement requires ':'.`;
      }
  
      if (
        line.startsWith("class ") &&
        !line.includes(":")
      ) {
        return `Line ${index + 1}: class definition requires ':'.`;
      }
    }
  
    return null;
  }
  
  export const pythonRunner: Runner = {
    language: "python",
    mode: "backend",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return request.language === "python";
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const file = getFile(
        request,
        [".py"],
      );
  
      if (!file) {
        return {
          success: false,
          language: "python",
          mode: "backend",
          output: [
            {
              type: "stderr",
              message:
                "No Python entry file was found.",
            },
          ],
          error:
            "No Python entry file was found.",
        };
      }
  
      const validationError =
        validatePython(
          file.content,
        );
  
      if (validationError) {
        return {
          success: false,
          language: "python",
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
        language: "python",
        mode: "backend",
        output: [
          {
            type: "info",
            message:
              `Python source prepared for secure backend execution: ${file.name}.`,
          },
        ],
        executable:
          file.content,
      };
    },
  };
  
  export default pythonRunner;