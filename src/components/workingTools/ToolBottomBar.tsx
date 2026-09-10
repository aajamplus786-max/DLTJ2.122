
// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/ToolBottomBar.tsx
// =====================================================

export default function ToolBottomBar() {
  return (
    <footer className="tool-bottom-bar">
      <div className="tool-bottom-left">
        <span>✓ Ready</span>
        <span>Workspace</span>
      </div>

      <div className="tool-bottom-center">
        <span>Ln 1, Col 1</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
      </div>

      <div className="tool-bottom-right">
        <span>DLTJ2.1 Working Tool</span>
      </div>
    </footer>
  );
}
