// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/typescriptRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ExecutionRequest,
    ExecutionResult,
  } from "../services/executionService";
  
  export async function runTypeScript(
    request: ExecutionRequest,
  ): Promise<ExecutionResult> {
    const file =
      request.files.find(
        (item) =>
          item.name
            .toLowerCase()
            .endsWith(".ts") ||
          item.name
            .toLowerCase()
            .endsWith(".tsx"),
      );
  
    if (!file) {
      return {
        success: false,
        language: "typescript",
        messages: [
          {
            type: "stderr",
            message:
              "No TypeScript source file found.",
          },
        ],
        error:
          "No TypeScript source file found.",
      };
    }
  
    return {
      success: true,
      language: "typescript",
      messages: [
        {
          type: "info",
          message:
            `TypeScript source prepared for controlled transpilation: ${file.name}.`,
        },
      ],
      output: file.content,
    };
  }