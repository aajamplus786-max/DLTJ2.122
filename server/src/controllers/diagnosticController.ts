// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/controllers/diagnosticController.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
  } from "express";
  
  import {
    diagnoseCode,
  } from "../services/diagnosticService";
  
  export function diagnosticController(
    req: Request,
    res: Response,
  ): void {
    try {
      const {
        language,
        code,
      } = req.body ?? {};
  
      if (
        typeof language !==
        "string"
      ) {
        res.status(400).json({
          success: false,
          error:
            "Language is required.",
        });
        return;
      }
  
      if (
        typeof code !==
        "string"
      ) {
        res.status(400).json({
          success: false,
          error:
            "Code is required.",
        });
        return;
      }
  
      const result =
        diagnoseCode(
          language,
          code,
        );
  
      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Diagnostic failed.";
  
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }