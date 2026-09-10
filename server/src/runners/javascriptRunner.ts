// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/javascriptRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ExecutionRequest,
    ExecutionResult,
  } from "../services/executionService";
  
  export async function runJavaScript(
    request: ExecutionRequest,
  ): Promise<ExecutionResult> {
    const file =
      request.files.find(
        (item) =>
          item.name
            .toLowerCase()
            .endsWith(".js") ||
          item.name
            .toLowerCase()
            .endsWith(".jsx") ||
          item.name
            .toLowerCase()
            .endsWith(".mjs"),
      );
  
    if (!file) {
      return {
        success: false,
        language: "javascript",
        messages: [
          {
            type: "stderr",
            message:
              "No JavaScript file found.",
          },
        ],
        error:
          "No JavaScript file found.",
      };
    }
  
    return {
      success: true,
      language: "javascript",
      messages: [
        {
          type: "info",
          message:
            `JavaScript source accepted for sandbox execution: ${file.name}.`,
        },
      ],
      output: file.content,
    };
  }