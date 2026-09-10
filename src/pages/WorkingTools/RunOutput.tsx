// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: src/pages/WorkingTools/RunOutput.tsx
// DATE: 2026-08-31
// =====================================================

import { useLocation, useNavigate } from "react-router-dom";

import OutputView from "../../components/workingTools/OutputView";

interface RouteState {
  output?: string;
  error?: string;
  status?: "idle" | "running" | "success" | "error";
}

export default function RunOutputPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state =
    (location.state as RouteState | null) ?? null;

  const output = state?.error
    ? `Execution Error\n\n${state.error}`
    : state?.output ?? "No execution output.";

  return (
    <main className="wt-run-output-page">
      <header className="wt-run-output-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="wt-panel-button"
        >
          ← Back
        </button>

        <h1>Run Output</h1>
      </header>

      <OutputView
        output={output}
        status={state?.status ?? "idle"}
      />
    </main>
  );
}