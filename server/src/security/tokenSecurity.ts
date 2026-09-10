// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/security/tokenSecurity.ts
// DATE: 2026-08-31
// =====================================================

import {
    randomBytes,
    createHash,
  } from "crypto";
  
  export interface ExecutionToken {
    tokenHash: string;
    createdAt: number;
    expiresAt: number;
  }
  
  export function generateExecutionToken(
    ttlMs = 5 * 60 * 1000,
  ): {
    rawToken: string;
    token: ExecutionToken;
  } {
    const rawToken =
      randomBytes(32)
        .toString("hex");
  
    const now =
      Date.now();
  
    return {
      rawToken,
      token: {
        tokenHash:
          hashToken(rawToken),
        createdAt: now,
        expiresAt:
          now + ttlMs,
      },
    };
  }
  
  export function hashToken(
    token: string,
  ): string {
    return createHash("sha256")
      .update(token)
      .digest("hex");
  }
  
  export function verifyExecutionToken(
    rawToken: string,
    token: ExecutionToken,
  ): boolean {
    if (
      Date.now() >
      token.expiresAt
    ) {
      return false;
    }
  
    return (
      hashToken(rawToken) ===
      token.tokenHash
    );
  }