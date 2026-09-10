// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/components/workingTools/EditorTabs.tsx
// =====================================================

export interface EditorTabItem {
  id: string;
  name: string;
  path?: string;
  language?: string;
  modified?: boolean;
}

interface EditorTabsProps {
  tabs: EditorTabItem[];
  activeTabId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

function getFileIcon(name: string): string {
  const extension =
    name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "html":
      return "◇";

    case "css":
      return "#";

    case "js":
    case "jsx":
      return "JS";

    case "ts":
    case "tsx":
      return "TS";

    case "py":
      return "PY";

    case "java":
      return "J";

    case "c":
      return "C";

    case "cpp":
      return "C++";

    case "sql":
      return "DB";

    case "json":
      return "{}";

    default:
      return "•";
  }
}

export default function EditorTabs({
  tabs,
  activeTabId,
  onSelect,
  onClose,
}: EditorTabsProps) {
  return (
    <div className="working-editor-tabs">
      {tabs.map((tab) => {
        const active =
          tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            className={`working-editor-tab ${
              active
                ? "working-editor-tab-active"
                : ""
            }`}
            onClick={() => onSelect(tab.id)}
          >
            <span className="working-editor-tab-icon">
              {getFileIcon(tab.name)}
            </span>

            <span className="working-editor-tab-name">
              {tab.name}
            </span>

            {tab.modified && (
              <span
                className="working-editor-tab-modified"
                title="Unsaved changes"
              >
                ●
              </span>
            )}

            <span
              role="button"
              tabIndex={0}
              className="working-editor-tab-close"
              onClick={(event) => {
                event.stopPropagation();
                onClose(tab.id);
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  event.stopPropagation();
                  onClose(tab.id);
                }
              }}
              aria-label={`Close ${tab.name}`}
            >
              ×
            </span>
          </button>
        );
      })}
    </div>
  );
}