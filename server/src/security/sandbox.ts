// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/security/sandbox.ts
// DATE: 2026-08-31
// =====================================================

export interface SandboxPolicy {
    allowNetwork: boolean;
    allowFileSystem: boolean;
    allowProcessSpawn: boolean;
    maxExecutionTimeMs: number;
    maxOutputBytes: number;
  }
  
  export interface SandboxValidation {
    allowed: boolean;
    reason?: string;
  }
  
  export const DEFAULT_SANDBOX_POLICY: SandboxPolicy = {
    allowNetwork: false,
    allowFileSystem: false,
    allowProcessSpawn: false,
    maxExecutionTimeMs: 5000,
    maxOutputBytes: 1024 * 1024,
  };
  
  export function validateSandboxPolicy(
    policy: SandboxPolicy,
  ): SandboxValidation {
    if (
      policy.maxExecutionTimeMs <= 0
    ) {
      return {
        allowed: false,
        reason:
          "Execution time limit must be greater than zero.",
      };
    }
  
    if (
      policy.maxOutputBytes <= 0
    ) {
      return {
        allowed: false,
        reason:
          "Output limit must be greater than zero.",
      };
    }
  
    if (
      policy.allowNetwork
    ) {
      return {
        allowed: false,
        reason:
          "Network access is disabled for public code execution.",
      };
    }
  
    if (
      policy.allowProcessSpawn
    ) {
      return {
        allowed: false,
        reason:
          "Unrestricted process spawning is disabled.",
      };
    }
  
    return {
      allowed: true,
    };
  }
  
  export function createSandboxPolicy(
    overrides: Partial<SandboxPolicy> = {},
  ): SandboxPolicy {
    return {
      ...DEFAULT_SANDBOX_POLICY,
      ...overrides,
      allowNetwork: false,
      allowProcessSpawn: false,
    };
  }