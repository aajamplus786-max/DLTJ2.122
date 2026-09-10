// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/controllers/executionController.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
  } from "express";
  
  import {
    executeCode,
    getSupportedExecutionLanguages,
  } from "../services/executionService";
  
  export async function executeCodeController(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const {
        language,
        files,
        entryFile,
        options,
      } = req.body ?? {};
  
      if (
        typeof language !== "string"
      ) {
        res.status(400).json({
          success: false,
          error: "Language is required.",
        });
        return;
      }
  
      if (!Array.isArray(files)) {
        res.status(400).json({
          success: false,
          error: "Files must be an array.",
        });
        return;
      }
  
      const result =
        await executeCode({
          language,
          files,
          entryFile,
          options,
        });
  
      res.status(
        result.success ? 200 : 400,
      ).json(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Execution request failed.";
  
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
  
  export function supportedLanguagesController(
    _req: Request,
    res: Response,
  ): void {
    res.json({
      success: true,
      languages:
        getSupportedExecutionLanguages(),
    });
  }