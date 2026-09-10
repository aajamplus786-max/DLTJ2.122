// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: src/components/workingTools/ProblemsPanel.tsx
// DATE: 2026-08-31
// =====================================================

export interface Problem {
    id?: string;
    message: string;
    severity:
      | "error"
      | "warning"
      | "info";
    line?: number;
    column?: number;
    file?: string;
  }
  
  interface ProblemsPanelProps {
    problems?: Problem[];
    onProblemClick?: (
      problem: Problem,
    ) => void;
  }
  
  export default function ProblemsPanel({
    problems = [],
    onProblemClick,
  }: ProblemsPanelProps) {
    return (
      <section
        className="working-tool-problems-panel"
        aria-label="Problems"
      >
        <div className="working-tool-panel-header">
          <span>Problems</span>
          <span>{problems.length}</span>
        </div>
  
        <div className="working-tool-panel-content">
          {problems.length === 0 ? (
            <div className="working-tool-empty-state">
              No problems detected.
            </div>
          ) : (
            problems.map(
              (problem, index) => (
                <button
                  type="button"
                  key={
                    problem.id ??
                    `${problem.message}-${index}`
                  }
                  className={`working-tool-problem-item ${problem.severity}`}
                  onClick={() =>
                    onProblemClick?.(
                      problem,
                    )
                  }
                >
                  <span className="working-tool-problem-severity">
                    {problem.severity ===
                    "error"
                      ? "×"
                      : problem.severity ===
                          "warning"
                        ? "!"
                        : "i"}
                  </span>
  
                  <span className="working-tool-problem-details">
                    <span className="working-tool-problem-message">
                      {problem.message}
                    </span>
  
                    <span className="working-tool-problem-location">
                      {problem.file
                        ? problem.file
                        : "Current file"}
  
                      {problem.line !==
                      undefined
                        ? ` : ${problem.line}`
                        : ""}
  
                      {problem.column !==
                      undefined
                        ? ` : ${problem.column}`
                        : ""}
                    </span>
                  </span>
                </button>
              ),
            )
          )}
        </div>
      </section>
    );
  }