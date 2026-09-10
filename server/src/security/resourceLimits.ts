// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/security/resourceLimits.ts
// DATE: 2026-08-31
// =====================================================

export interface ResourceLimits {
    timeoutMs: number;
    maxOutputBytes: number;
    maxInputBytes: number;
    maxFiles: number;
    maxFileSizeBytes: number;
  }
  
  export const DEFAULT_RESOURCE_LIMITS: ResourceLimits = {
    timeoutMs: 5000,
    maxOutputBytes:
      1024 * 1024,
    maxInputBytes:
      2 * 1024 * 1024,
    maxFiles: 100,
    maxFileSizeBytes:
      1024 * 1024,
  };
  
  export function validateResourceLimits(
    limits: ResourceLimits,
  ): boolean {
    return (
      limits.timeoutMs > 0 &&
      limits.maxOutputBytes > 0 &&
      limits.maxInputBytes > 0 &&
      limits.maxFiles > 0 &&
      limits.maxFileSizeBytes > 0
    );
  }
  
  export function normalizeResourceLimits(
    overrides: Partial<ResourceLimits> = {},
  ): ResourceLimits {
    return {
      ...DEFAULT_RESOURCE_LIMITS,
      ...overrides,
    };
  }
  
  export function exceedsOutputLimit(
    output: string,
    limits: ResourceLimits,
  ): boolean {
    return (
      Buffer.byteLength(
        output,
        "utf8",
      ) >
      limits.maxOutputBytes
    );
  }