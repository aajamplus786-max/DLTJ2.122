// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: src/components/mysql/MySQLHistory.tsx
// DATE: 2026-08-31
// =====================================================

export interface MySQLHistoryItem {
    id: string;
    query: string;
    database?: string;
    createdAt: string;
    success: boolean;
  }
  
  interface Props {
    history: MySQLHistoryItem[];
    onSelect?: (
      item: MySQLHistoryItem,
    ) => void;
  }
  
  export default function MySQLHistory({
    history,
    onSelect,
  }: Props) {
    return (
      <aside className="wt-mysql-history">
        <div className="wt-tool-section-title">
          Query History
        </div>
  
        {history.length === 0 ? (
          <div className="wt-empty-state">
            No query history.
          </div>
        ) : (
          history.map((item) => (
            <button
              type="button"
              key={item.id}
              className="wt-history-item"
              onClick={() =>
                onSelect?.(item)
              }
            >
              <span>
                {item.success ? "✓" : "✕"}
              </span>
  
              <code>
                {item.query.length > 70
                  ? `${item.query.slice(0, 70)}...`
                  : item.query}
              </code>
            </button>
          ))
        )}
      </aside>
    );
  }