// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/cppRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ExecutionRequest,
    ExecutionResult,
  } from "../services/executionService";
  
  export async function runCpp(
    request: ExecutionRequest,
  ): Promise<ExecutionResult> {
    const file =
      request.files.find(
        (item) => {
          const name =
            item.name.toLowerCase();
  
          return (
            name.endsWith(".cpp") ||
            name.endsWith(".cc") ||
            name.endsWith(".cxx")
          );
        },
      );
  
    if (!file) {
      return {
        success: false,
        language: "cpp",
        messages: [
          {
            type: "stderr",
            message:
              "No C++ source file found.",
          },
        ],
        error:
          "No C++ source file found.",
      };
    }
  
    return {
      success: true,
      language: "cpp",
      messages: [
        {
          type: "info",
          message:
            `C++ source prepared for secure sandbox compilation: ${file.name}.`,
        },
      ],
      output: file.content,
    };
  }