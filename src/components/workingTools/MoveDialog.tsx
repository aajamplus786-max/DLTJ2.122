// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/MoveDialog.tsx
// =====================================================

import { useState } from "react";

import FileDialog from "./FileDialog";

interface MoveDialogProps {
  itemName: string;
  folders?: string[];
  onMove: (folder: string) => void;
  onClose: () => void;
}

export default function MoveDialog({
  itemName,
  folders = [],
  onMove,
  onClose,
}: MoveDialogProps) {
  const [folder, setFolder] =
    useState("");

  const handleMove = () => {
    onMove(folder);
  };

  return (
    <FileDialog
      title="Move Item"
      onClose={onClose}
      onSubmit={handleMove}
      submitLabel="Move"
    >
      <div className="move-dialog-content">
        <p>
          Move <strong>{itemName}</strong> to:
        </p>

        <label
          htmlFor="move-folder"
          className="file-dialog-label"
        >
          Destination folder
        </label>

        <select
          id="move-folder"
          className="file-dialog-input"
          value={folder}
          onChange={(event) =>
            setFolder(event.target.value)
          }
        >
          <option value="">
            Workspace root
          </option>

          {folders.map((folderName) => (
            <option
              key={folderName}
              value={folderName}
            >
              {folderName}
            </option>
          ))}
        </select>
      </div>
    </FileDialog>
  );
}