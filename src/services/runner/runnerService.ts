// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 6
// FILE: src/services/runner/runnerService.ts
// DATE: 2026-08-31
// =====================================================

export type RunnerLanguage =
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "python"
  | "c"
  | "cpp"
  | "java"
  | "react";

export type RunnerMode =
  | "browser"
  | "transpile"
  | "backend"
  | "preview"
  | "unsupported";

export interface RunnerFile {
  id?: string;
  name: string;
  path?: string;
  content: string;
}

export interface RunnerRequest {
  language: RunnerLanguage;
  entryFile?: string;
  files: RunnerFile[];
  options?: Record<string, unknown>;
}

export interface RunnerOutput {
  type: "stdout" | "stderr" | "info";
  message: string;
}

export interface RunnerResult {
  success: boolean;
  language: RunnerLanguage;
  mode: RunnerMode;
  output: RunnerOutput[];
  html?: string;
  css?: string;
  javascript?: string;
  executable?: string;
  error?: string;
  duration?: number;
}

export interface Runner {
  language: RunnerLanguage;
  mode: RunnerMode;

  canRun(request: RunnerRequest): boolean;

  run(
    request: RunnerRequest,
  ): Promise<RunnerResult>;
}

function findEntryFile(
  request: RunnerRequest,
  extensions: string[],
): RunnerFile | null {
  if (request.entryFile) {
    const requested =
      request.files.find(
        (file) =>
          file.name === request.entryFile ||
          file.path === request.entryFile,
      );

    if (requested) {
      return requested;
    }
  }

  return (
    request.files.find((file) =>
      extensions.some((extension) =>
        file.name
          .toLowerCase()
          .endsWith(extension),
      ),
    ) ?? null
  );
}

export function createRunnerError(
  request: RunnerRequest,
  message: string,
): RunnerResult {
  return {
    success: false,
    language: request.language,
    mode: "unsupported",
    output: [
      {
        type: "stderr",
        message,
      },
    ],
    error: message,
  };
}

export function createRunnerInfo(
  request: RunnerRequest,
  message: string,
): RunnerResult {
  return {
    success: true,
    language: request.language,
    mode: "preview",
    output: [
      {
        type: "info",
        message,
      },
    ],
  };
}

export function getFile(
  request: RunnerRequest,
  extensions: string[],
): RunnerFile | null {
  return findEntryFile(
    request,
    extensions,
  );
}

export function getFilesByExtension(
  request: RunnerRequest,
  extensions: string[],
): RunnerFile[] {
  return request.files.filter((file) =>
    extensions.some((extension) =>
      file.name
        .toLowerCase()
        .endsWith(extension),
    ),
  );
}

export function getRunnerLanguageFromFile(
  fileName: string,
): RunnerLanguage | null {
  const name =
    fileName.toLowerCase();

  if (
    name.endsWith(".html") ||
    name.endsWith(".htm")
  ) {
    return "html";
  }

  if (name.endsWith(".css")) {
    return "css";
  }

  if (
    name.endsWith(".js") ||
    name.endsWith(".jsx") ||
    name.endsWith(".mjs")
  ) {
    return "javascript";
  }

  if (
    name.endsWith(".ts") ||
    name.endsWith(".tsx")
  ) {
    return "typescript";
  }

  if (name.endsWith(".py")) {
    return "python";
  }

  if (
    name.endsWith(".c") ||
    name.endsWith(".h")
  ) {
    return "c";
  }

  if (
    name.endsWith(".cpp") ||
    name.endsWith(".cc") ||
    name.endsWith(".cxx") ||
    name.endsWith(".hpp")
  ) {
    return "cpp";
  }

  if (name.endsWith(".java")) {
    return "java";
  }

  return null;
}

export function getRunnerMode(
  language: RunnerLanguage,
): RunnerMode {
  switch (language) {
    case "html":
    case "css":
    case "javascript":
      return "browser";

    case "typescript":
    case "react":
      return "transpile";

    case "python":
    case "c":
    case "cpp":
    case "java":
      return "backend";

    default:
      return "unsupported";
  }
}

export async function runWithRunner(
  runner: Runner,
  request: RunnerRequest,
): Promise<RunnerResult> {
  const startedAt =
    performance.now();

  if (!runner.canRun(request)) {
    return {
      success: false,
      language: request.language,
      mode: runner.mode,
      output: [
        {
          type: "stderr",
          message:
            `Runner cannot handle language: ${request.language}`,
        },
      ],
      error:
        `Runner cannot handle language: ${request.language}`,
      duration:
        performance.now() -
        startedAt,
    };
  }

  try {
    const result =
      await runner.run(request);

    return {
      ...result,
      duration:
        performance.now() -
        startedAt,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown runner error.";

    return {
      success: false,
      language: request.language,
      mode: runner.mode,
      output: [
        {
          type: "stderr",
          message,
        },
      ],
      error: message,
      duration:
        performance.now() -
        startedAt,
    };
  }
}

export async function executeRunner(
  request: RunnerRequest,
  runner: Runner,
): Promise<RunnerResult> {
  return runWithRunner(
    runner,
    request,
  );
}