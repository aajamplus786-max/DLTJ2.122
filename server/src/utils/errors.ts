// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: server/src/utils/errors.ts
// DATE: 2026-08-31
// =====================================================

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
  
    constructor(
      message: string,
      statusCode = 500,
      code = "INTERNAL_ERROR",
    ) {
      super(message);
  
      this.name = "AppError";
      this.statusCode = statusCode;
      this.code = code;
    }
  }
  
  export function getErrorMessage(
    error: unknown,
  ): string {
    if (error instanceof Error) {
      return error.message;
    }
  
    if (typeof error === "string") {
      return error;
    }
  
    return "Unknown server error.";
  }
  
  export function errorResponse(
    error: unknown,
  ) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }
  
    return {
      success: false,
      error: getErrorMessage(error),
      code: "INTERNAL_ERROR",
    };
  }