// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: src/components/workingTools/RunOutput.tsx
// DATE: 2026-08-31
// =====================================================

import OutputView from "./OutputView";
import type { ExecutionResult } from "../../hooks/useCodeExecution";

interface RunOutputProps {
  result: ExecutionResult | null;
}

export default function RunOutput({
  result,
}: RunOutputProps) {
  if (!result) {
    return (
      <OutputView
        output="Run a program to see the result."
        status="idle"
      />
    );
  }

  const output = [
    result.stdout,
    result.stderr
      ? `\n[stderr]\n${result.stderr}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <OutputView
      output={output}
      status={
        result.status === "success"
          ? "success"
          : result.status === "running"
            ? "running"
            : "error"
      }
    />
  );
}