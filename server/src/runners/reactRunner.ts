// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/reactRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ExecutionRequest,
    ExecutionResult,
  } from "../services/executionService";
  
  export async function runReact(
    request: ExecutionRequest,
  ): Promise<ExecutionResult> {
    const file =
      request.files.find(
        (item) => {
          const name =
            item.name.toLowerCase();
  
          return (
            name.endsWith(".tsx") ||
            name.endsWith(".jsx")
          );
        },
      );
  
    if (!file) {
      return {
        success: false,
        language: "react",
        messages: [
          {
            type: "stderr",
            message:
              "No React entry file found.",
          },
        ],
        error:
          "No React entry file found.",
      };
    }
  
    return {
      success: true,
      language: "react",
      messages: [
        {
          type: "info",
          message:
            `React project prepared for controlled build/preview: ${file.name}.`,
        },
      ],
      output: file.content,
    };
  }