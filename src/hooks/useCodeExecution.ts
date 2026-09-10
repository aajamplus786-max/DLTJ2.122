// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: src/hooks/useCodeExecution.ts
// DATE: 2026-08-31
// =====================================================

import { useCallback, useState } from "react";

export interface ExecutionRequest {
  language: string;
  code: string;
  fileName?: string;
  projectId?: string;
}

export interface ExecutionResult {
  status: "running" | "success" | "error";
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
}

interface ExecutionResponse {
  success?: boolean;
  stdout?: string;
  stderr?: string;
  output?: string;
  error?: string;
  exitCode?: number | null;
  durationMs?: number;
}

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export function useCodeExecution() {
  const [result, setResult] =
    useState<ExecutionResult | null>(null);

  const [isRunning, setIsRunning] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const runCode = useCallback(
    async (
      request: ExecutionRequest,
    ): Promise<ExecutionResult> => {
      setIsRunning(true);
      setError(null);

      const startedAt = performance.now();

      setResult({
        status: "running",
        stdout: "",
        stderr: "",
        exitCode: null,
        durationMs: 0,
      });

      try {
        const response = await fetch(
          `${API_BASE}/execution/run`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          },
        );

        const data =
          (await response.json()) as ExecutionResponse;

        const durationMs =
          data.durationMs ??
          Math.round(performance.now() - startedAt);

        if (!response.ok || data.success === false) {
          const executionError =
            data.error ??
            data.stderr ??
            "Execution failed.";

          const failedResult: ExecutionResult = {
            status: "error",
            stdout: data.stdout ?? data.output ?? "",
            stderr: executionError,
            exitCode: data.exitCode ?? null,
            durationMs,
          };

          setResult(failedResult);
          setError(executionError);

          return failedResult;
        }

        const successfulResult: ExecutionResult = {
          status: "success",
          stdout: data.stdout ?? data.output ?? "",
          stderr: data.stderr ?? "",
          exitCode: data.exitCode ?? 0,
          durationMs,
        };

        setResult(successfulResult);

        return successfulResult;
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to connect to execution server.";

        const failedResult: ExecutionResult = {
          status: "error",
          stdout: "",
          stderr: message,
          exitCode: null,
          durationMs: Math.round(
            performance.now() - startedAt,
          ),
        };

        setResult(failedResult);
        setError(message);

        return failedResult;
      } finally {
        setIsRunning(false);
      }
    },
    [],
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isRunning,
    error,
    runCode,
    clearResult,
  };
}