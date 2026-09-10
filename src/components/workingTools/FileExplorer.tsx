// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/FileExplorer.tsx
// DATE: 2026-08-31
// =====================================================

import { useMemo, useState } from "react";

import FileTree from "./FileTree";
import NewFileDialog from "./NewFileDialog";
import NewFolderDialog from "./NewFolderDialog";

import type { WorkspaceFile } from "../../types/WorkspaceFile";
import type { WorkspaceFolder } from "../../types/WorkspaceFolder";

// =====================================================
// PROPS
// =====================================================

interface FileExplorerProps {
  technologyId?: string;

  files?: WorkspaceFile[];
  folders?: WorkspaceFolder[];

  onCreateFile?: (
    file: WorkspaceFile,
  ) => void;

  onCreateFolder?: (
    folder: WorkspaceFolder,
  ) => void;

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

export default function FileExplorer({
  technologyId = "html",

  files: externalFiles,
  folders: externalFolders,

  onCreateFile,
  onCreateFolder,
  onOpenFile,
  onRenameItem,
  onDeleteItem,
  onDuplicateFile,
}: FileExplorerProps) {
  // ===================================================
  // LOCAL FALLBACK STATE
  // ===================================================

  const [localFiles, setLocalFiles] =
    useState<WorkspaceFile[]>([]);

  const [localFolders, setLocalFolders] =
    useState<WorkspaceFolder[]>([]);

  const [showNewFile, setShowNewFile] =
    useState(false);

  const [showNewFolder, setShowNewFolder] =
    useState(false);

  // ===================================================
  // DATA SOURCE
  // ===================================================

  const files =
    externalFiles ?? localFiles;

  const folders =
    externalFolders ?? localFolders;

  // ===================================================
  // DEFAULT FILE
  // ===================================================

  const defaultFile = useMemo(
    () => getDefaultFile(technologyId),
    [technologyId],
  );

  // ===================================================
  // CREATE FILE
  // ===================================================

  const handleCreateFile = (
    file: WorkspaceFile,
  ) => {
    if (onCreateFile) {
      onCreateFile(file);
    } else {
      setLocalFiles((current) => [
        ...current,
        file,
      ]);
    }

    setShowNewFile(false);
  };

  // ===================================================
  // CREATE FOLDER
  // ===================================================

  const handleCreateFolder = (
    folder: WorkspaceFolder,
  ) => {
    if (onCreateFolder) {
      onCreateFolder(folder);
    } else {
      setLocalFolders((current) => [
        ...current,
        folder,
      ]);
    }

    setShowNewFolder(false);
  };

  // ===================================================
  // OPEN FILE
  // ===================================================

  const handleOpenFile = (
    file: WorkspaceFile,
  ) => {
    onOpenFile?.(file);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section
      className="file-explorer"
      aria-label="File Explorer"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="file-explorer-header">
        <div className="file-explorer-header-title">
          <strong>
            EXPLORER
          </strong>

          <span>
            {technologyId.toUpperCase()} WORKSPACE
          </span>
        </div>

        <div className="file-explorer-actions">
          <button
            type="button"
            title="New File"
            aria-label="Create new file"
            onClick={() =>
              setShowNewFile(true)
            }
          >
            +
          </button>

          <button
            type="button"
            title="New Folder"
            aria-label="Create new folder"
            onClick={() =>
              setShowNewFolder(true)
            }
          >
            📁+
          </button>
        </div>
      </div>

      {/* =================================================
          PROJECT
      ================================================= */}

      <div className="file-explorer-workspace">
        <div className="file-explorer-project-title">
          <span className="file-explorer-project-arrow">
            ▾
          </span>

          <strong>
            {technologyId.toUpperCase()} PROJECT
          </strong>
        </div>

        {/* =================================================
            FILE TREE
        ================================================= */}

        <FileTree
          files={files}
          folders={folders}
          defaultFileName={defaultFile}
          onCreateFile={() =>
            setShowNewFile(true)
          }
          onCreateFolder={() =>
            setShowNewFolder(true)
          }
          onOpenFile={
            handleOpenFile
          }
          onRenameItem={
            onRenameItem
          }
          onDeleteItem={
            onDeleteItem
          }
          onDuplicateFile={
            onDuplicateFile
          }
        />
      </div>

      {/* =================================================
          NEW FILE DIALOG
      ================================================= */}

      {showNewFile && (
        <NewFileDialog
          onCreate={
            handleCreateFile
          }
          onClose={() =>
            setShowNewFile(false)
          }
        />
      )}

      {/* =================================================
          NEW FOLDER DIALOG
      ================================================= */}

      {showNewFolder && (
        <NewFolderDialog
          onCreate={
            handleCreateFolder
          }
          onClose={() =>
            setShowNewFolder(false)
          }
        />
      )}
    </section>
  );
}

// =====================================================
// DEFAULT FILE NAME
// =====================================================

function getDefaultFile(
  technologyId: string,
): string {
  switch (
    technologyId.toLowerCase()
  ) {
    case "html":
      return "index.html";

    case "css":
      return "style.css";

    case "javascript":
      return "script.js";

    case "typescript":
      return "main.ts";

    case "python":
      return "main.py";

    case "java":
      return "Main.java";

    case "c":
      return "main.c";

    case "cpp":
      return "main.cpp";

    case "mysql":
      return "query.sql";

    case "react":
      return "App.tsx";

    case "spring":
      return "Application.java";

    default:
      return "main.txt";
  }
}