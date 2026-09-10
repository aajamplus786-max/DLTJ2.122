// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: src/components/spring/SpringServerStatus.tsx
// DATE: 2026-08-31
// =====================================================

interface Props {
    status:
      | "stopped"
      | "starting"
      | "running"
      | "error";
  
    port: number;
  
    onStart?: () => void;
    onStop?: () => void;
  }
  
  export default function SpringServerStatus({
    status,
    port,
    onStart,
    onStop,
  }: Props) {
    return (
      <section className="wt-spring-server-status">
        <div>
          <strong>Spring Server</strong>
  
          <span
            className={`wt-server-state wt-server-${status}`}
          >
            {status}
          </span>
        </div>
  
        <div>
          Port: <strong>{port}</strong>
        </div>
  
        {status === "running" ? (
          <button
            type="button"
            onClick={onStop}
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            disabled={status === "starting"}
          >
            {status === "starting"
              ? "Starting..."
              : "Start"}
          </button>
        )}
      </section>
    );
  }