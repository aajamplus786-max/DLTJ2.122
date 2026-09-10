// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/javaRunner.ts
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
  
  function validateJava(
    code: string,
  ): string | null {
    let balance = 0;
  
    for (const character of code) {
      if (character === "{") {
        balance += 1;
      }
  
      if (character === "}") {
        balance -= 1;
  
        if (balance < 0) {
          return "Unexpected '}' in Java source.";
        }
      }
    }
  
    if (balance !== 0) {
      return "Unbalanced Java class/method braces.";
    }
  
    return null;
  }
  
  function hasClassDeclaration(
    code: string,
  ): boolean {
    return /\bclass\s+[A-Za-z_$][\w$]*/.test(
      code,
    );
  }
  
  export const javaRunner: Runner = {
    language: "java",
    mode: "backend",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return request.language === "java";
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const file = getFile(
        request,
        [".java"],
      );
  
      if (!file) {
        return {
          success: false,
          language: "java",
          mode: "backend",
          output: [
            {
              type: "stderr",
              message:
                "No Java source file was found.",
            },
          ],
          error:
            "No Java source file was found.",
        };
      }
  
      const validationError =
        validateJava(
          file.content,
        );
  
      if (validationError) {
        return {
          success: false,
          language: "java",
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
  
      if (
        !hasClassDeclaration(
          file.content,
        )
      ) {
        return {
          success: false,
          language: "java",
          mode: "backend",
          output: [
            {
              type: "stderr",
              message:
                "No Java class declaration was found.",
            },
          ],
          error:
            "No Java class declaration was found.",
        };
      }
  
      return {
        success: true,
        language: "java",
        mode: "backend",
        output: [
          {
            type: "info",
            message:
              `Java source prepared for secure backend compilation: ${file.name}.`,
          },
        ],
        executable:
          file.content,
      };
    },
  };
  
  export default javaRunner;