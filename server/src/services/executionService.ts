// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/services/executionService.ts
// DATE: 2026-08-31
// =====================================================

export type ExecutionLanguage =
  | "html"
  | "javascript"
  | "python"
  | "c"
  | "cpp"
  | "java"
  | "typescript"
  | "react";

export interface ExecutionFile {
  name: string;
  path?: string;
  content: string;
}

export interface ExecutionRequest {
  language: string;
  files: ExecutionFile[];
  entryFile?: string;
  options?: Record<string, unknown>;
}

export interface ExecutionMessage {
  type:
    | "stdout"
    | "stderr"
    | "info";

  message: string;

  line?: number;
}

export interface ExecutionResult {
  success: boolean;
  language: string;
  messages: ExecutionMessage[];
  output?: string;
  error?: string;
  duration?: number;
}

import {
  runHtml,
} from "../runners/htmlRunner";

import {
  runJavaScript,
} from "../runners/javascriptRunner";

import {
  runPython,
} from "../runners/pythonRunner";

import {
  runC,
} from "../runners/cRunner";

import {
  runCpp,
} from "../runners/cppRunner";

import {
  runJava,
} from "../runners/javaRunner";

import {
  runTypeScript,
} from "../runners/typescriptRunner";

import {
  runReact,
} from "../runners/reactRunner";

type ExecutionHandler = (
  request: ExecutionRequest,
) => Promise<ExecutionResult>;

const handlers: Record<
  ExecutionLanguage,
  ExecutionHandler
> = {
  html: runHtml,
  javascript: runJavaScript,
  python: runPython,
  c: runC,
  cpp: runCpp,
  java: runJava,
  typescript: runTypeScript,
  react: runReact,
};

export function getSupportedExecutionLanguages(): string[] {
  return Object.keys(handlers);
}

function normalizeLanguage(
  language: string,
): ExecutionLanguage | null {
  const normalized =
    language
      .trim()
      .toLowerCase();

  if (
    normalized in handlers
  ) {
    return normalized as ExecutionLanguage;
  }

  return null;
}

export async function executeCode(
  request: ExecutionRequest,
): Promise<ExecutionResult> {
  const startedAt =
    Date.now();

  const language =
    normalizeLanguage(
      request.language,
    );

  if (!language) {
    return {
      success: false,
      language: request.language,
      messages: [
        {
          type: "stderr",
          message:
            `Unsupported execution language: ${request.language}`,
        },
      ],
      error:
        `Unsupported execution language: ${request.language}`,
      duration:
        Date.now() - startedAt,
    };
  }

  if (!Array.isArray(request.files)) {
    return {
      success: false,
      language,
      messages: [
        {
          type: "stderr",
          message:
            "Execution files must be an array.",
        },
      ],
      error:
        "Execution files must be an array.",
      duration:
        Date.now() - startedAt,
    };
  }

  try {
    const result =
      await handlers[language](
        request,
      );

    return {
      ...result,
      duration:
        result.duration ??
        Date.now() - startedAt,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Execution failed.";

    return {
      success: false,
      language,
      messages: [
        {
          type: "stderr",
          message,
        },
      ],
      error: message,
      duration:
        Date.now() - startedAt,
    };
  }
}