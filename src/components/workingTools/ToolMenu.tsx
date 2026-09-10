
// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/ToolMenu.tsx
// =====================================================

interface ToolMenuProps {
  onClose: () => void;
}

export default function ToolMenu({
  onClose,
}: ToolMenuProps) {
  return (
    <div className="tool-menu-overlay">
      <div className="tool-menu">
        <div className="tool-menu-header">
          <strong>Working Tool</strong>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <button type="button" className="tool-menu-item">
          New Project
        </button>

        <button type="button" className="tool-menu-item">
          Open Project
        </button>

        <button type="button" className="tool-menu-item">
          Save Workspace
        </button>

        <div className="tool-menu-divider" />

        <button type="button" className="tool-menu-item">
          Keyboard Shortcuts
        </button>

        <button type="button" className="tool-menu-item">
          Settings
        </button>
      </div>
    </div>
  );
}
