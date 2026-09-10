// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/RenameDialog.tsx
// =====================================================

import { useState } from "react";

import FileDialog from "./FileDialog";

interface RenameDialogProps {
  currentName: string;
  onRename: (name: string) => void;
  onClose: () => void;
}

export default function RenameDialog({
  currentName,
  onRename,
  onClose,
}: RenameDialogProps) {
  const [name, setName] =
    useState(currentName);

  const handleRename = () => {
    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    onRename(cleanName);
  };

  return (
    <FileDialog
      title="Rename"
      onClose={onClose}
      onSubmit={handleRename}
      submitLabel="Rename"
    >
      <label
        htmlFor="rename-item"
        className="file-dialog-label"
      >
        New name
      </label>

      <input
        id="rename-item"
        className="file-dialog-input"
        type="text"
        autoFocus
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleRename();
          }
        }}
      />
    </FileDialog>
  );
}