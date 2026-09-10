// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/middleware/validationMiddleware.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  const MAX_BODY_BYTES =
    2 * 1024 * 1024;
  
  export function validateExecutionRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const body =
      req.body ?? {};
  
    if (
      typeof body.language !==
      "string"
    ) {
      res.status(400).json({
        success: false,
        error:
          "Execution language is required.",
      });
      return;
    }
  
    if (
      !Array.isArray(body.files)
    ) {
      res.status(400).json({
        success: false,
        error:
          "Execution files are required.",
      });
      return;
    }
  
    const serialized =
      JSON.stringify(body);
  
    if (
      Buffer.byteLength(
        serialized,
        "utf8",
      ) >
      MAX_BODY_BYTES
    ) {
      res.status(413).json({
        success: false,
        error:
          "Execution request is too large.",
      });
      return;
    }
  
    for (
      const file of body.files
    ) {
      if (
        !file ||
        typeof file.name !==
          "string" ||
        typeof file.content !==
          "string"
      ) {
        res.status(400).json({
          success: false,
          error:
            "Invalid execution file.",
        });
        return;
      }
    }
  
    next();
  }