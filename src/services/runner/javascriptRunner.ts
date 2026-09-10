// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/javascriptRunner.ts
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
  
  function validateJavaScript(
    code: string,
  ): string | null {
    const openBrackets: string[] = [];
  
    const pairs: Record<
      string,
      string
    > = {
      "(": ")",
      "[": "]",
      "{": "}",
    };
  
    const closing = new Set([
      ")",
      "]",
      "}",
    ]);
  
    for (const character of code) {
      if (pairs[character]) {
        openBrackets.push(
          pairs[character],
        );
      } else if (
        closing.has(character)
      ) {
        const expected =
          openBrackets.pop();
  
        if (expected !== character) {
          return `Unexpected token '${character}'.`;
        }
      }
    }
  
    if (openBrackets.length > 0) {
      return "Unclosed bracket detected.";
    }
  
    return null;
  }
  
  export const javascriptRunner: Runner = {
    language: "javascript",
    mode: "browser",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return (
        request.language ===
        "javascript"
      );
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const file = getFile(
        request,
        [".js", ".jsx", ".mjs"],
      );
  
      if (!file) {
        return {
          success: false,
          language: "javascript",
          mode: "browser",
          output: [
            {
              type: "stderr",
              message:
                "No JavaScript entry file was found.",
            },
          ],
          error:
            "No JavaScript entry file was found.",
        };
      }
  
      const validationError =
        validateJavaScript(
          file.content,
        );
  
      if (validationError) {
        return {
          success: false,
          language: "javascript",
          mode: "browser",
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
        language: "javascript",
        mode: "browser",
        output: [
          {
            type: "info",
            message:
              `JavaScript execution prepared for ${file.name}.`,
          },
        ],
        javascript:
          file.content,
      };
    },
  };
  
  export default javascriptRunner;