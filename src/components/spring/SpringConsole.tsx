// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: src/components/spring/SpringConsole.tsx
// DATE: 2026-08-31
// =====================================================

interface Props {
    lines: string[];
  }
  
  export default function SpringConsole({
    lines,
  }: Props) {
    return (
      <section className="wt-spring-console">
        <header className="wt-panel-header">
          <strong>Spring Console</strong>
        </header>
  
        <pre className="wt-console-content">
          {lines.length > 0
            ? lines.join("\n")
            : "Spring console is ready."}
        </pre>
      </section>
    );
  }