// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: src/services/errorService.ts
// DATE: 2026-08-31
// =====================================================

export interface ToolError {
    id: string;
    message: string;
    severity: "info" | "warning" | "error";
    fileName?: string;
    line?: number;
    column?: number;
    source?: string;
    timestamp: string;
  }
  
  export function createToolError(
    message: string,
    options: Partial<ToolError> = {},
  ): ToolError {
    return {
      id: crypto.randomUUID(),
      message,
      severity: options.severity ?? "error",
      fileName: options.fileName,
      line: options.line,
      column: options.column,
      source: options.source ?? "Working Tool",
      timestamp: new Date().toISOString(),
    };
  }
  
  export function parseErrorMessage(
    error: unknown,
  ): string {
    if (error instanceof Error) {
      return error.message;
    }
  
    if (typeof error === "string") {
      return error;
    }
  
    return "Unknown error.";
  }
  
  export function formatToolError(
    error: ToolError,
  ): string {
    const location =
      error.fileName && error.line
        ? `${error.fileName}:${error.line}:${error.column ?? 1}`
        : "";
  
    return [
      `[${error.severity.toUpperCase()}]`,
      location,
      error.message,
    ]
      .filter(Boolean)
      .join(" ");
  }