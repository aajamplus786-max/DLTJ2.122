// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: src/components/spring/SpringExplorer.tsx
// DATE: 2026-08-31
// =====================================================

interface Props {
    files: string[];
    onSelect?: (file: string) => void;
  }
  
  export default function SpringExplorer({
    files,
    onSelect,
  }: Props) {
    return (
      <aside className="wt-spring-explorer">
        <div className="wt-tool-section-title">
          Spring Explorer
        </div>
  
        {files.length === 0 ? (
          <div className="wt-empty-state">
            No Spring project files.
          </div>
        ) : (
          files.map((file) => (
            <button
              type="button"
              className="wt-tree-item"
              key={file}
              onClick={() =>
                onSelect?.(file)
              }
            >
              {getIcon(file)} {file}
            </button>
          ))
        )}
      </aside>
    );
  }
  
  function getIcon(
    file: string,
  ): string {
    if (file.endsWith(".java")) {
      return "☕";
    }
  
    if (
      file.endsWith(".properties") ||
      file.endsWith(".yml") ||
      file.endsWith(".yaml")
    ) {
      return "⚙";
    }
  
    if (file.includes("pom.xml")) {
      return "📦";
    }
  
    return "📄";
  }