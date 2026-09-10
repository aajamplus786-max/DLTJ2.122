
// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/ToolSidebar.tsx
// =====================================================

import FileExplorer from "./FileExplorer";

interface ToolSidebarProps {
  technologyId?: string;
}

export default function ToolSidebar({
  technologyId = "html",
}: ToolSidebarProps) {
  return (
    <aside className="tool-sidebar">
      <div className="tool-sidebar-icons">
        <button
          type="button"
          className="tool-sidebar-icon active"
          title="Explorer"
        >
          📁
        </button>

        <button
          type="button"
          className="tool-sidebar-icon"
          title="Search"
        >
          🔎
        </button>

        <button
          type="button"
          className="tool-sidebar-icon"
          title="Source Control"
        >
          ⎇
        </button>

        <button
          type="button"
          className="tool-sidebar-icon"
          title="Run"
        >
          ▶
        </button>
      </div>

      <div className="tool-sidebar-content">
        <FileExplorer technologyId={technologyId} />
      </div>
    </aside>
  );
}
