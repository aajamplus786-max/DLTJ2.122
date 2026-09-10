
// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/EditorStatusBar.tsx
// =====================================================

interface EditorStatusBarProps {
  language?: string;
  line?: number;
  column?: number;
}

export default function EditorStatusBar({
  language = "HTML",
  line = 1,
  column = 1,
}: EditorStatusBarProps) {
  return (
    <div className="editor-status-bar">
      <div className="editor-status-left">
        <span>●</span>
        <span>{language}</span>
      </div>

      <div className="editor-status-right">
        <span>
          Ln {line}, Col {column}
        </span>

        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
}
