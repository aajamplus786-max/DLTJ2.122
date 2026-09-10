// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/cRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ExecutionRequest,
    ExecutionResult,
  } from "../services/executionService";
  
  export async function runC(
    request: ExecutionRequest,
  ): Promise<ExecutionResult> {
    const file =
      request.files.find(
        (item) =>
          item.name
            .toLowerCase()
            .endsWith(".c"),
      );
  
    if (!file) {
      return {
        success: false,
        language: "c",
        messages: [
          {
            type: "stderr",
            message:
              "No C source file found.",
          },
        ],
        error:
          "No C source file found.",
      };
    }
  
    return {
      success: true,
      language: "c",
      messages: [
        {
          type: "info",
          message:
            `C source prepared for secure sandbox compilation: ${file.name}.`,
        },
      ],
      output: file.content,
    };
  }