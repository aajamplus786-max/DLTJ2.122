// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: src/components/workingTools/ConsolePanel.tsx
// DATE: 2026-08-31
// =====================================================

import type { ReactNode } from "react";

export interface ConsoleMessage {
  id: string;
  type: "log" | "info" | "warning" | "error";
  message: string;
  timestamp?: string;
}

interface ConsolePanelProps {
  messages?: ConsoleMessage[];
  title?: string;
  actions?: ReactNode;
  onClear?: () => void;
}

export default function ConsolePanel({
  messages = [],
  title = "Console",
  actions,
  onClear,
}: ConsolePanelProps) {
  return (
    <section className="wt-console-panel">
      <header className="wt-panel-header">
        <div>
          <strong>{title}</strong>
          <span className="wt-panel-count">
            {messages.length}
          </span>
        </div>

        <div className="wt-panel-actions">
          {actions}

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="wt-panel-button"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <div className="wt-console-content">
        {messages.length === 0 ? (
          <div className="wt-console-empty">
            Console is ready.
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className={`wt-console-line wt-console-${item.type}`}
            >
              <span className="wt-console-type">
                {item.type.toUpperCase()}
              </span>

              <span className="wt-console-message">
                {item.message}
              </span>

              {item.timestamp && (
                <span className="wt-console-time">
                  {item.timestamp}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}