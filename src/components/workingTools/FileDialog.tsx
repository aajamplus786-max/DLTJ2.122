// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/FileDialog.tsx
// =====================================================

import type { ReactNode } from "react";

interface FileDialogProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
}

export default function FileDialog({
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "Save",
}: FileDialogProps) {
  return (
    <div className="file-dialog-overlay">
      <div className="file-dialog">
        <div className="file-dialog-header">
          <strong>{title}</strong>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="file-dialog-body">
          {children}
        </div>

        <div className="file-dialog-footer">
          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          {onSubmit && (
            <button
              type="button"
              className="primary"
              onClick={onSubmit}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}