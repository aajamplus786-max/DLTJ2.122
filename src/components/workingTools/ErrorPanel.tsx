// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: src/components/workingTools/ErrorPanel.tsx
// DATE: 2026-08-31
// =====================================================

import type {
  ReactNode,
} from "react";

export interface ErrorItem {
  id?: string;
  message: string;
  line?: number;
  column?: number;
  severity?: "error" | "warning" | "info";
}

interface ErrorPanelProps {
  errors?: ErrorItem[];
  title?: string;
  emptyMessage?: string;
  footer?: ReactNode;
}

export default function ErrorPanel({
  errors = [],
  title = "Errors",
  emptyMessage = "No errors.",
  footer,
}: ErrorPanelProps) {
  return (
    <section
      className="working-tool-error-panel"
      aria-label={title}
    >
      <div className="working-tool-panel-header">
        <span>{title}</span>
        <span>{errors.length}</span>
      </div>

      <div className="working-tool-panel-content">
        {errors.length === 0 ? (
          <div className="working-tool-empty-state">
            {emptyMessage}
          </div>
        ) : (
          errors.map(
            (error, index) => (
              <div
                key={
                  error.id ??
                  `${error.message}-${index}`
                }
                className={`working-tool-error-item ${
                  error.severity ??
                  "error"
                }`}
              >
                <div className="working-tool-error-message">
                  {error.message}
                </div>

                {(error.line !==
                  undefined ||
                  error.column !==
                    undefined) && (
                  <div className="working-tool-error-location">
                    {error.line !==
                    undefined
                      ? `Line ${error.line}`
                      : ""}
                    {error.column !==
                    undefined
                      ? `, Column ${error.column}`
                      : ""}
                  </div>
                )}
              </div>
            ),
          )
        )}
      </div>

      {footer}
    </section>
  );
}