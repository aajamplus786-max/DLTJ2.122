// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/middleware/rateLimitMiddleware.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  interface RateRecord {
    count: number;
    resetAt: number;
  }
  
  const records =
    new Map<string, RateRecord>();
  
  const WINDOW_MS =
    60 * 1000;
  
  const MAX_REQUESTS =
    30;
  
  function getClientKey(
    req: Request,
  ): string {
    const forwarded =
      req.headers[
        "x-forwarded-for"
      ];
  
    if (
      typeof forwarded ===
      "string"
    ) {
      return forwarded
        .split(",")[0]
        .trim();
    }
  
    return (
      req.ip ||
      "unknown-client"
    );
  }
  
  export function executionRateLimit(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const key =
      getClientKey(req);
  
    const now =
      Date.now();
  
    const existing =
      records.get(key);
  
    if (
      !existing ||
      now >= existing.resetAt
    ) {
      records.set(key, {
        count: 1,
        resetAt:
          now + WINDOW_MS,
      });
  
      next();
      return;
    }
  
    if (
      existing.count >=
      MAX_REQUESTS
    ) {
      res.status(429).json({
        success: false,
        error:
          "Too many execution requests. Please try again later.",
      });
      return;
    }
  
    existing.count += 1;
  
    next();
  }
  
  export function clearRateLimitRecords(): void {
    records.clear();
  }