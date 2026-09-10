// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/FileTree.tsx
// DATE: 2026-08-31
// =====================================================

import FileItem from "./FileItem";

import type { WorkspaceFile } from "../../types/WorkspaceFile";
import type { WorkspaceFolder } from "../../types/WorkspaceFolder";

// =====================================================
// PROPS
// =====================================================

interface FileTreeProps {
  files: WorkspaceFile[];
  folders: WorkspaceFolder[];
  defaultFileName: string;

  onCreateFile: () => void;
  onCreateFolder: () => void;

  onOpenFile?: (
    file: WorkspaceFile,
  ) => void;

  onRenameItem?: (
    itemId: string,
    newName: string,
  ) => void;

  onDeleteItem?: (
    itemId: string,
  ) => void;

  onDuplicateFile?: (
    fileId: string,
  ) => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function FileTree({
  files,
  folders,
  defaultFileName,

  onCreateFile,
  onCreateFolder,

  onOpenFile,
  onRenameItem,
  onDeleteItem,
  onDuplicateFile,
}: FileTreeProps) {
  const hasItems =
    folders.length > 0 ||
    files.length > 0;

  return (
    <div className="file-tree">

      {/* =================================================
          EMPTY WORKSPACE
      ================================================= */}

      {!hasItems && (
        <div className="file-tree-empty">

          <div className="file-tree-empty-icon">
            📂
          </div>

          <strong>
            No files yet
          </strong>

          <span>
            Create a file or folder to start.
          </span>

          <div className="file-tree-empty-actions">

            <button
              type="button"
              onClick={onCreateFile}
            >
              + File
            </button>

            <button
              type="button"
              onClick={onCreateFolder}
            >
              📁 Folder
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          FOLDERS
      ================================================= */}

      {folders.map((folder) => (
        <FileItem
          key={folder.id}
          type="folder"
          name={folder.name}
          item={folder}

          onRename={
            onRenameItem
          }

          onDelete={
            onDeleteItem
          }
        />
      ))}

      {/* =================================================
          FILES
      ================================================= */}

      {files.map((file) => (
        <FileItem
          key={file.id}
          type="file"
          name={file.name}
          item={file}

          onClick={() =>
            onOpenFile?.(file)
          }

          onRename={
            onRenameItem
          }

          onDelete={
            onDeleteItem
          }

          onDuplicate={() =>
            onDuplicateFile?.(
              file.id,
            )
          }
        />
      ))}

      {/* =================================================
          DEFAULT FILE HINT
          Only shown before a real workspace item exists.
      ================================================= */}

      {!hasItems && (
        <div className="file-tree-default">

          <button
            type="button"
            className="file-tree-default-file"
            onClick={onCreateFile}
            title={`Create ${defaultFileName}`}
          >
            <span>
              📄
            </span>

            <span>
              {defaultFileName}
            </span>
          </button>

        </div>
      )}

    </div>
  );
}