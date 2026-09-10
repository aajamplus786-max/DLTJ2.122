// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: src/components/mysql/MySQLResultTable.tsx
// DATE: 2026-08-31
// =====================================================

interface Props {
    rows: Record<string, unknown>[];
  }
  
  export default function MySQLResultTable({
    rows,
  }: Props) {
    if (rows.length === 0) {
      return (
        <div className="wt-empty-state">
          No rows returned.
        </div>
      );
    }
  
    const columns = Array.from(
      new Set(
        rows.flatMap((row) =>
          Object.keys(row),
        ),
      ),
    );
  
    return (
      <div className="wt-mysql-result-wrapper">
        <table className="wt-mysql-result-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column}>
                    {formatValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  function formatValue(
    value: unknown,
  ): string {
    if (value === null) {
      return "NULL";
    }
  
    if (value === undefined) {
      return "";
    }
  
    if (
      typeof value === "object"
    ) {
      return JSON.stringify(value);
    }
  
    return String(value);
  }