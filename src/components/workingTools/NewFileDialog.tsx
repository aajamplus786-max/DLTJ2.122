// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/NewFileDialog.tsx
// =====================================================

import { useState } from "react";

import type { WorkspaceFile } from "../../types/WorkspaceFile";

interface NewFileDialogProps {
  onCreate: (file: WorkspaceFile) => void;
  onClose: () => void;
}

export default function NewFileDialog({
  onCreate,
  onClose,
}: NewFileDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    const now = Date.now();

    const file: WorkspaceFile = {
      id: crypto.randomUUID(),
      name: cleanName,
      type: "file",
      content: "",
      parentId: null,
      language: detectLanguage(cleanName),
      path: cleanName,
      createdAt: now,
      updatedAt: now,
      isDirty: true,
    };

    onCreate(file);
  };

  return (
    <div className="file-dialog-overlay">
      <form
        className="file-dialog"
        onSubmit={handleSubmit}
      >
        <div className="file-dialog-header">
          <strong>New File</strong>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="file-dialog-body">
          <label htmlFor="new-file-name">
            File name
          </label>

          <input
            id="new-file-name"
            type="text"
            autoFocus
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="index.html"
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
            Create File
          </button>
        </div>
      </form>
    </div>
  );
}

function detectLanguage(fileName: string): string {
  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase();

  switch (extension) {
    case "html":
    case "htm":
      return "html";

    case "css":
      return "css";

    case "js":
    case "mjs":
    case "cjs":
    case "jsx":
      return "javascript";

    case "ts":
    case "tsx":
      return "typescript";

    case "py":
      return "python";

    case "java":
      return "java";

    case "c":
      return "c";

    case "cpp":
    case "cc":
    case "cxx":
      return "cpp";

    case "sql":
      return "mysql";

    default:
      return "plaintext";
  }
}