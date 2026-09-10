// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: src/components/mysql/MySQLQueryEditor.tsx
// DATE: 2026-08-31
// =====================================================

interface Props {
    query: string;
    onChange: (query: string) => void;
    onRun: () => void;
    disabled?: boolean;
  }
  
  export default function MySQLQueryEditor({
    query,
    onChange,
    onRun,
    disabled = false,
  }: Props) {
    return (
      <section className="wt-mysql-query-editor">
        <header className="wt-panel-header">
          <strong>SQL Query</strong>
  
          <button
            type="button"
            onClick={onRun}
            disabled={disabled || !query.trim()}
          >
            Run Query
          </button>
        </header>
  
        <textarea
          value={query}
          onChange={(event) =>
            onChange(event.target.value)
          }
          spellCheck={false}
          placeholder="SELECT * FROM users;"
          className="wt-sql-editor"
        />
      </section>
    );
  }