// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/htmlRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ExecutionRequest,
    ExecutionResult,
  } from "../services/executionService";
  
  export async function runHtml(
    request: ExecutionRequest,
  ): Promise<ExecutionResult> {
    const file =
      request.files.find(
        (item) =>
          item.name
            .toLowerCase()
            .endsWith(".html") ||
          item.name
            .toLowerCase()
            .endsWith(".htm"),
      );
  
    if (!file) {
      return {
        success: false,
        language: "html",
        messages: [
          {
            type: "stderr",
            message:
              "No HTML file found.",
          },
        ],
        error:
          "No HTML file found.",
      };
    }
  
    return {
      success: true,
      language: "html",
      messages: [
        {
          type: "info",
          message:
            `HTML preview prepared from ${file.name}.`,
        },
      ],
      output: file.content,
    };
  }