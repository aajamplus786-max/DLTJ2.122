// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/NewFolderDialog.tsx
// =====================================================

import { useState } from "react";

import type { WorkspaceFolder } from "../../types/WorkspaceFolder";

interface NewFolderDialogProps {
  onCreate: (folder: WorkspaceFolder) => void;
  onClose: () => void;
}

export default function NewFolderDialog({
  onCreate,
  onClose,
}: NewFolderDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    const now = Date.now();

    const folder: WorkspaceFolder = {
      id: crypto.randomUUID(),
      name: cleanName,
      type: "folder",
      parentId: null,
      path: cleanName,
      createdAt: now,
      updatedAt: now,
    };

    onCreate(folder);
  };

  return (
    <div className="file-dialog-overlay">
      <form
        className="file-dialog"
        onSubmit={handleSubmit}
      >
        <div className="file-dialog-header">
          <strong>New Folder</strong>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="file-dialog-body">
          <label htmlFor="new-folder-name">
            Folder name
          </label>

          <input
            id="new-folder-name"
            type="text"
            autoFocus
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="src"
          />
        </div>

        <div className="file-dialog-footer">
          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary"
            disabled={!name.trim()}
          >
            Create Folder
          </button>
        </div>
      </form>
    </div>
  );
}