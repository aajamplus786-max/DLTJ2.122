// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/htmlRunner.ts
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
  
  function escapeScriptEnd(
    value: string,
  ): string {
    return value.replace(
      /<\/script/gi,
      "<\\/script",
    );
  }
  
  export const htmlRunner: Runner = {
    language: "html",
    mode: "browser",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return request.language === "html";
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const htmlFile = getFile(
        request,
        [".html", ".htm"],
      );
  
      if (!htmlFile) {
        return {
          success: false,
          language: "html",
          mode: "browser",
          output: [
            {
              type: "stderr",
              message:
                "No HTML entry file was found.",
            },
          ],
          error:
            "No HTML entry file was found.",
        };
      }
  
      const html =
        htmlFile.content;
  
      return {
        success: true,
        language: "html",
        mode: "browser",
        output: [
          {
            type: "info",
            message:
              `HTML preview prepared from ${htmlFile.name}.`,
          },
        ],
        html,
        javascript: escapeScriptEnd(
          "",
        ),
      };
    },
  };
  
  export default htmlRunner;