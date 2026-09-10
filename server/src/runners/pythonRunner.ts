// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 7
// FILE: server/src/runners/pythonRunner.ts
// DATE: 2026-09-01
// =====================================================

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type {
  ExecutionRequest,
  ExecutionResult,
} from "../services/executionService";

import { runProcess } from "../utils/process";

const PYTHON_TIMEOUT_MS = 5000;
const MAX_OUTPUT_BYTES = 1024 * 1024;

function limitOutput(value: string): string {
  const buffer = Buffer.from(value, "utf8");

  if (buffer.length <= MAX_OUTPUT_BYTES) {
    return value;
  }

  return buffer
    .subarray(0, MAX_OUTPUT_BYTES)
    .toString("utf8") +
    "\n[Output truncated: maximum output limit reached.]";
}

export async function runPython(
  request: ExecutionRequest,
): Promise<ExecutionResult> {
  const startedAt = Date.now();

  const file =
    request.files.find((item) =>
      item.name
        .toLowerCase()
        .endsWith(".py"),
    );

  if (!file) {
    return {
      success: false,
      language: "python",
      messages: [
        {
          type: "stderr",
          message: "No Python file found.",
        },
      ],
      error: "No Python file found.",
      duration: Date.now() - startedAt,
    };
  }

  let workingDirectory: string | undefined;

  try {
    /*
     * Create a temporary workspace for this execution.
     */
    workingDirectory = await mkdtemp(
      join(tmpdir(), "dltj-python-"),
    );

    const fileName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_",
      );

    const pythonFile =
      join(
        workingDirectory,
        fileName || "index.py",
      );

    await writeFile(
      pythonFile,
      file.content,
      "utf8",
    );

    /*
     * Execute Python through the Windows
     * Python launcher.
     *
     * `py` is available on this machine:
     * Python 3.10.4
     */
    const result = await runProcess({
      command: "py",
      args: [
        "-3",
        pythonFile,
      ],
      cwd: workingDirectory,
      timeoutMs: PYTHON_TIMEOUT_MS,
      env: {
        PYTHONIOENCODING: "utf-8",
        PYTHONDONTWRITEBYTECODE: "1",
      },
    });

    const stdout =
      limitOutput(result.stdout);

    const stderr =
      limitOutput(result.stderr);

    const messages = [];

    if (stdout.trim()) {
      messages.push({
        type: "stdout" as const,
        message: stdout,
      });
    }

    if (stderr.trim()) {
      messages.push({
        type: "stderr" as const,
        message: stderr,
      });
    }

    if (result.timedOut) {
      messages.push({
        type: "stderr" as const,
        message:
          "Python execution timed out after 5 seconds.",
      });

      return {
        success: false,
        language: "python",
        messages,
        error:
          "Python execution timed out.",
        duration:
          Date.now() - startedAt,
      };
    }

    if (
      result.exitCode !== 0 &&
      !stderr.trim()
    ) {
      messages.push({
        type: "stderr" as const,
        message:
          `Python process exited with code ${result.exitCode}.`,
      });
    }

    return {
      success:
        result.exitCode === 0,
      language: "python",
      messages,
      output: stdout,
      error:
        result.exitCode === 0
          ? undefined
          : stderr ||
            `Python process exited with code ${result.exitCode}.`,
      duration:
        result.durationMs,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Python execution failed.";

    return {
      success: false,
      language: "python",
      messages: [
        {
          type: "stderr",
          message,
        },
      ],
      error: message,
      duration:
        Date.now() - startedAt,
    };
  } finally {
    /*
     * Always remove the temporary execution folder.
     */
    if (workingDirectory) {
      await rm(
        workingDirectory,
        {
          recursive: true,
          force: true,
        },
      ).catch(() => undefined);
    }
  }
}