// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/FileItem.tsx
// DATE: 2026-08-31
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import FileContextMenu from "./FileContextMenu";

import type { MouseEvent } from "react";

import type { WorkspaceFile } from "../../types/WorkspaceFile";
import type { WorkspaceFolder } from "../../types/WorkspaceFolder";

// =====================================================
// TYPES
// =====================================================

type WorkspaceItem =
  | WorkspaceFile
  | WorkspaceFolder;

interface FileItemProps {
  type: "file" | "folder";
  name: string;
  item?: WorkspaceItem;

  onClick?: () => void;

  onRename?: (
    itemId: string,
    newName: string,
  ) => void;

  onDelete?: (
    itemId: string,
  ) => void;

  onDuplicate?: (
    fileId: string,
  ) => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function FileItem({
  type,
  name,
  item,

  onClick,
  onRename,
  onDelete,
  onDuplicate,
}: FileItemProps) {
  const [selected, setSelected] =
    useState(false);

  const [contextMenu, setContextMenu] =
    useState<{
      x: number;
      y: number;
    } | null>(null);

  // ===================================================
  // CLOSE CONTEXT MENU WHEN CLICKING OUTSIDE
  // ===================================================

  useEffect(() => {
    const handleDocumentClick = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener(
        "click",
        handleDocumentClick,
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick,
      );
    };
  }, [contextMenu]);

  // ===================================================
  // CLICK
  // ===================================================

  const handleClick = () => {
    setSelected(true);

    if (type === "file") {
      onClick?.();
    }
  };

  // ===================================================
  // RIGHT CLICK
  // ===================================================

  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setSelected(true);

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  // ===================================================
  // CONTEXT MENU CLOSE
  // ===================================================

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // ===================================================
  // RENAME
  // ===================================================

  const handleRename = (
    newName: string,
  ) => {
    if (!item) {
      return;
    }

    onRename?.(
      item.id,
      newName,
    );

    setContextMenu(null);
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = () => {
    if (!item) {
      return;
    }

    onDelete?.(
      item.id,
    );

    setContextMenu(null);
  };

  // ===================================================
  // DUPLICATE
  // ===================================================

  const handleDuplicate = () => {
    if (
      !item ||
      type !== "file"
    ) {
      return;
    }

    onDuplicate?.(
      item.id,
    );

    setContextMenu(null);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      <div
        className={[
          "file-item",
          selected
            ? "selected"
            : "",
          type === "folder"
            ? "folder"
            : "file",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={
          handleClick
        }
        onContextMenu={
          handleContextMenu
        }
        title={
          type === "file"
            ? `Open ${name}`
            : name
        }
        role="treeitem"
        tabIndex={0}
        onKeyDown={(event) => {
          if (
            event.key ===
              "Enter" ||
            event.key ===
              " "
          ) {
            event.preventDefault();
            handleClick();
          }
        }}
      >

        {/* =============================================
            ARROW
        ============================================= */}

        <span className="file-item-arrow">
          {type === "folder"
            ? "▸"
            : ""}
        </span>

        {/* =============================================
            ICON
        ============================================= */}

        <span className="file-item-icon">
          {type === "folder"
            ? "📁"
            : getFileIcon(name)}
        </span>

        {/* =============================================
            NAME
        ============================================= */}

        <span className="file-item-name">
          {name}
        </span>

      </div>

      {/* ===============================================
          CONTEXT MENU
      =============================================== */}

      {contextMenu && item && (
        <FileContextMenu
          x={
            contextMenu.x
          }
          y={
            contextMenu.y
          }
          item={item}
          type={type}
          onClose={
            handleCloseContextMenu
          }

          onRename={
            handleRename
          }

          onDelete={
            handleDelete
          }

          onDuplicate={
            type === "file"
              ? handleDuplicate
              : undefined
          }
        />
      )}
    </>
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
      return "🌐";

    case "htm":
      return "🌐";

    case "css":
      return "🎨";

    case "js":
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
      return "⚙️";

    case "cc":
      return "⚙️";

    case "cxx":
      return "⚙️";

    case "sql":
      return "🗄️";

    case "json":
      return "🧩";

    case "md":
      return "📝";

    case "txt":
      return "📄";

    case "xml":
      return "🧾";

    case "yaml":
    case "yml":
      return "⚙️";

    default:
      return "📄";
  }
}