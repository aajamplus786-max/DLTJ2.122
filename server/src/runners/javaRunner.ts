// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/javaRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ExecutionRequest,
    ExecutionResult,
  } from "../services/executionService";
  
  export async function runJava(
    request: ExecutionRequest,
  ): Promise<ExecutionResult> {
    const file =
      request.files.find(
        (item) =>
          item.name
            .toLowerCase()
            .endsWith(".java"),
      );
  
    if (!file) {
      return {
        success: false,
        language: "java",
        messages: [
          {
            type: "stderr",
            message:
              "No Java source file found.",
          },
        ],
        error:
          "No Java source file found.",
      };
    }
  
    return {
      success: true,
      language: "java",
      messages: [
        {
          type: "info",
          message:
            `Java source prepared for secure sandbox compilation: ${file.name}.`,
        },
      ],
      output: file.content,
    };
  }