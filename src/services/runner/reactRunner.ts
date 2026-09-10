// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/reactRunner.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Runner,
    RunnerRequest,
    RunnerResult,
  } from "./runnerService";
  
  import {
    getFile,
    getFilesByExtension,
  } from "./runnerService";
  
  function validateReactSource(
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
  
    for (const character of code) {
      if (pairs[character]) {
        openBrackets.push(
          pairs[character],
        );
        continue;
      }
  
      if (
        character === ")" ||
        character === "]" ||
        character === "}"
      ) {
        const expected =
          openBrackets.pop();
  
        if (expected !== character) {
          return `Unexpected token '${character}' in React source.`;
        }
      }
    }
  
    if (openBrackets.length > 0) {
      return "Unclosed bracket detected in React source.";
    }
  
    return null;
  }
  
  function getReactEntry(
    request: RunnerRequest,
  ) {
    return (
      getFile(request, [".tsx", ".jsx"]) ??
      getFile(request, [".ts", ".js"])
    );
  }
  
  export const reactRunner: Runner = {
    language: "react",
    mode: "transpile",
  
    canRun(
      request: RunnerRequest,
    ): boolean {
      return request.language === "react";
    },
  
    async run(
      request: RunnerRequest,
    ): Promise<RunnerResult> {
      const entry =
        getReactEntry(request);
  
      if (!entry) {
        return {
          success: false,
          language: "react",
          mode: "transpile",
          output: [
            {
              type: "stderr",
              message:
                "No React entry file was found.",
            },
          ],
          error:
            "No React entry file was found.",
        };
      }
  
      const validationError =
        validateReactSource(
          entry.content,
        );
  
      if (validationError) {
        return {
          success: false,
          language: "react",
          mode: "transpile",
          output: [
            {
              type: "stderr",
              message: validationError,
            },
          ],
          error: validationError,
        };
      }
  
      const styleFiles =
        getFilesByExtension(
          request,
          [".css"],
        );
  
      const htmlFile =
        getFile(request, [
          ".html",
          ".htm",
        ]);
  
      const css =
        styleFiles
          .map((file) => file.content)
          .join("\n\n");
  
      return {
        success: true,
        language: "react",
        mode: "transpile",
        output: [
          {
            type: "info",
            message:
              `React project prepared from ${entry.name}.`,
          },
          {
            type: "info",
            message:
              `Detected ${styleFiles.length} CSS file(s).`,
          },
        ],
        javascript:
          entry.content,
        css,
        html:
          htmlFile?.content ??
          `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DLTJ2.1 React Preview</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>`,
      };
    },
  };
  
  export default reactRunner;