// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/cssRunner.ts
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
  
  export const cssRunner: Runner = {
    language: "css",
    mode: "browser",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return request.language === "css";
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const cssFile = getFile(
        request,
        [".css"],
      );
  
      if (!cssFile) {
        return {
          success: false,
          language: "css",
          mode: "browser",
          output: [
            {
              type: "stderr",
              message:
                "No CSS entry file was found.",
            },
          ],
          error:
            "No CSS entry file was found.",
        };
      }
  
      const htmlFile = getFile(
        request,
        [".html", ".htm"],
      );
  
      const html =
        htmlFile?.content ??
        `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>DLTJ2.1 Preview</title>
  </head>
  <body>
    <div class="app">
      <h1>CSS Preview</h1>
      <p>Your CSS is loaded successfully.</p>
    </div>
  </body>
  </html>`;
  
      return {
        success: true,
        language: "css",
        mode: "browser",
        output: [
          {
            type: "info",
            message:
              `CSS preview prepared from ${cssFile.name}.`,
          },
        ],
        html,
        css: cssFile.content,
      };
    },
  };
  
  export default cssRunner;