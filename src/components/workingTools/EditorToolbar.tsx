
// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/EditorToolbar.tsx
// =====================================================

interface EditorToolbarProps {
  fileName?: string;
  onRun?: () => void;
  onSave?: () => void;
}

export default function EditorToolbar({
  fileName = "index.html",
  onRun,
  onSave,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-left">
        <span className="editor-file-icon">
          ◇
        </span>

        <span className="editor-file-name">
          {fileName}
        </span>
      </div>

      <div className="editor-toolbar-actions">
        <button
          type="button"
          onClick={onRun}
          title="Run code"
        >
          ▶ Run
        </button>

        <button
          type="button"
          onClick={onSave}
          title="Save file"
        >
          Save
        </button>

        <button
          type="button"
          title="Format document"
        >
          Format
        </button>
      </div>
    </div>
  );
}
