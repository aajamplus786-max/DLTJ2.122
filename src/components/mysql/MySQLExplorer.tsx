// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: src/components/mysql/MySQLExplorer.tsx
// DATE: 2026-08-31
// =====================================================

interface MySQLExplorerProps {
    databases: string[];
    tables: Record<string, string[]>;
    selectedDatabase?: string;
    onDatabaseSelect?: (
      database: string,
    ) => void;
    onTableSelect?: (
      database: string,
      table: string,
    ) => void;
  }
  
  export default function MySQLExplorer({
    databases,
    tables,
    selectedDatabase,
    onDatabaseSelect,
    onTableSelect,
  }: MySQLExplorerProps) {
    return (
      <aside className="wt-mysql-explorer">
        <div className="wt-tool-section-title">
          MySQL Explorer
        </div>
  
        {databases.length === 0 ? (
          <div className="wt-empty-state">
            No databases loaded.
          </div>
        ) : (
          databases.map((database) => {
            const databaseTables =
              tables[database] ?? [];
  
            const active =
              selectedDatabase === database;
  
            return (
              <div key={database}>
                <button
                  type="button"
                  className={`wt-tree-item ${
                    active ? "active" : ""
                  }`}
                  onClick={() =>
                    onDatabaseSelect?.(database)
                  }
                >
                  🗄 {database}
                </button>
  
                {active &&
                  databaseTables.map((table) => (
                    <button
                      type="button"
                      className="wt-tree-child"
                      key={`${database}-${table}`}
                      onClick={() =>
                        onTableSelect?.(
                          database,
                          table,
                        )
                      }
                    >
                      ▣ {table}
                    </button>
                  ))}
              </div>
            );
          })
        )}
      </aside>
    );
  }