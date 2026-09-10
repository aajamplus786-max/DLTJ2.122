// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/FileContextMenu.tsx
// DATE: 2026-08-31
// =====================================================

import { useState } from "react";

import type { WorkspaceFile } from "../../types/WorkspaceFile";
import type { WorkspaceFolder } from "../../types/WorkspaceFolder";

// =====================================================
// TYPES
// =====================================================

type WorkspaceItem =
  | WorkspaceFile
  | WorkspaceFolder;

interface FileContextMenuProps {
  x: number;
  y: number;

  type:
    | "file"
    | "folder";

  item?: WorkspaceItem;

  onClose: () => void;

  onRename?: (
    newName: string,
  ) => void;

  onDelete?: () => void;

  onDuplicate?: () => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function FileContextMenu({
  x,
  y,
  type,
  item,
  onClose,
  onRename,
  onDelete,
  onDuplicate,
}: FileContextMenuProps) {
  const [showRename, setShowRename] =
    useState(false);

  const [renameValue, setRenameValue] =
    useState(
      item?.name ?? "",
    );

  // ===================================================
  // OPEN
  // ===================================================

  const handleOpen = () => {
    if (!item) {
      onClose();
      return;
    }

    /*
     * Open is handled by FileItem / parent.
     * The context menu simply closes here.
     */

    onClose();
  };

  // ===================================================
  // RENAME
  // ===================================================

  const handleRenameSubmit = () => {
    const cleanName =
      renameValue.trim();

    if (!cleanName) {
      return;
    }

    onRename?.(
      cleanName,
    );

    setShowRename(false);

    onClose();
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = () => {
    if (!item) {
      onClose();
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${item.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    onDelete?.();

    onClose();
  };

  // ===================================================
  // DUPLICATE
  // ===================================================

  const handleDuplicate = () => {
    if (
      type !== "file"
    ) {
      return;
    }

    onDuplicate?.();

    onClose();
  };

  // ===================================================
  // MENU STYLE
  // ===================================================

  const menuStyle: React.CSSProperties = {
    left: `${Math.max(
      4,
      x,
    )}px`,

    top: `${Math.max(
      4,
      y,
    )}px`,
  };

  // ===================================================
  // RENAME VIEW
  // ===================================================

  if (showRename) {
    return (
      <div
        className="file-context-menu file-context-rename"
        style={menuStyle}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="file-context-rename-title">
          Rename
        </div>

        <input
          type="text"
          value={
            renameValue
          }
          autoFocus
          onChange={(event) =>
            setRenameValue(
              event.target.value,
            )
          }
          onKeyDown={(event) => {
            if (
              event.key ===
              "Enter"
            ) {
              handleRenameSubmit();
            }

            if (
              event.key ===
              "Escape"
            ) {
              setShowRename(false);
              onClose();
            }
          }}
        />

        <div className="file-context-rename-actions">

          <button
            type="button"
            onClick={() => {
              setShowRename(false);
              onClose();
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary"
            disabled={
              !renameValue.trim()
            }
            onClick={
              handleRenameSubmit
            }
          >
            Rename
          </button>

        </div>
      </div>
    );
  }

  // ===================================================
  // NORMAL MENU
  // ===================================================

  return (
    <div
      className="file-context-menu"
      style={menuStyle}
      onClick={(event) =>
        event.stopPropagation()
      }
      onMouseLeave={() => {
        /*
         * Small delay prevents accidental closing
         * while moving between menu items.
         */
        window.setTimeout(
          onClose,
          120,
        );
      }}
    >

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="file-context-menu-title">
        <span>
          {type === "folder"
            ? "📁"
            : getFileIcon(
                item?.name ?? "",
              )}
        </span>

        <span>
          {item?.name ??
            "Item"}
        </span>
      </div>

      <div className="file-context-divider" />

      {/* ===============================================
          OPEN
      =============================================== */}

      <button
        type="button"
        onClick={
          handleOpen
        }
      >
        <span>↗</span>
        Open
      </button>

      {/* ===============================================
          RENAME
      =============================================== */}

      <button
        type="button"
        onClick={() =>
          setShowRename(
            true,
          )
        }
      >
        <span>✎</span>
        Rename
      </button>

      {/* ===============================================
          MOVE
      =============================================== */}

      <button
        type="button"
        onClick={() => {
          console.log(
            "[Working Tool] Move",
            item,
          );

          onClose();
        }}
      >
        <span>↔</span>
        Move
      </button>

      {/* ===============================================
          DUPLICATE
      =============================================== */}

      {type ===
        "file" && (
        <button
          type="button"
          onClick={
            handleDuplicate
          }
        >
          <span>⧉</span>
          Duplicate
        </button>
      )}

      <div className="file-context-divider" />

      {/* ===============================================
          FOLDER ACTIONS
      =============================================== */}

      {type ===
        "folder" && (
        <>
          <button
            type="button"
            onClick={() => {
              console.log(
                "[Working Tool] New File in folder",
                item,
              );

              onClose();
            }}
          >
            <span>＋</span>
            New File
          </button>

          <button
            type="button"
            onClick={() => {
              console.log(
                "[Working Tool] New Folder in folder",
                item,
              );

              onClose();
            }}
          >
            <span>📁</span>
            New Folder
          </button>

          <div className="file-context-divider" />
        </>
      )}

      {/* ===============================================
          DELETE
      =============================================== */}

      <button
        type="button"
        className="danger"
        onClick={
          handleDelete
        }
      >
        <span>🗑</span>
        Delete
      </button>

    </div>
  );
}

// =====================================================
// FILE ICON
// =====================================================

function getFileIcon(
  name: string,
): string {
  const extension =
    name
      .split(".")
      .pop()
      ?.toLowerCase();

  switch (
    extension
  ) {
    case "html":
    case "htm":
      return "🌐";

    case "css":
      return "🎨";

    case "js":
    case "mjs":
      return "🟨";

    case "jsx":
      return "⚛️";

    case "ts":
      return "🔷";

    case "tsx":
      return "⚛️";

    case "py":
      return "🐍";

    case "java":
      return "☕";

    case "c":
      return "©";

    case "cpp":
    case "cc":
    case "cxx":
      return "⚙️";

    case "sql":
      return "🗄️";

    case "json":
      return "🧩";

    case "md":
      return "📝";

    case "xml":
      return "🧾";

    case "yaml":
    case "yml":
      return "⚙️";

    default:
      return "📄";
  }
}