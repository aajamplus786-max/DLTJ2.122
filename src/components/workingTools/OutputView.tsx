// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: src/components/workingTools/OutputView.tsx
// DATE: 2026-08-31
// =====================================================

interface OutputViewProps {
  output?: string;
  title?: string;
  status?: "idle" | "running" | "success" | "error";
}

export default function OutputView({
  output = "",
  title = "Output",
  status = "idle",
}: OutputViewProps) {
  return (
    <section className="wt-output-view">
      <header className="wt-panel-header">
        <div>
          <strong>{title}</strong>

          <span className={`wt-output-status wt-status-${status}`}>
            {status}
          </span>
        </div>
      </header>

      <pre className="wt-output-content">
        {output || "No output yet."}
      </pre>
    </section>
  );
}