// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: server/src/utils/process.ts
// DATE: 2026-08-31
// =====================================================

import {
    spawn,
    type ChildProcessWithoutNullStreams,
  } from "node:child_process";
  
  export interface ProcessOptions {
    command: string;
    args?: string[];
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    timeoutMs?: number;
  }
  
  export interface ProcessResult {
    stdout: string;
    stderr: string;
    exitCode: number | null;
    timedOut: boolean;
    durationMs: number;
  }
  
  export function runProcess(
    options: ProcessOptions,
  ): Promise<ProcessResult> {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
  
      let child: ChildProcessWithoutNullStreams;
  
      try {
        child = spawn(
          options.command,
          options.args ?? [],
          {
            cwd: options.cwd,
            env: {
              ...process.env,
              ...options.env,
            },
            shell: false,
            windowsHide: true,
          },
        );
      } catch (error) {
        reject(error);
        return;
      }
  
      let stdout = "";
      let stderr = "";
      let timedOut = false;
  
      const timeoutMs =
        options.timeoutMs ?? 10_000;
  
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill();
      }, timeoutMs);
  
      child.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
      });
  
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });
  
      child.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
  
      child.on("close", (exitCode) => {
        clearTimeout(timer);
  
        resolve({
          stdout,
          stderr,
          exitCode,
          timedOut,
          durationMs: Date.now() - startedAt,
        });
      });
    });
  }