// =====================================================
// DLTJ2.1 — WORKING TOOL WORKSPACE HOOK
// FILE: src/hooks/useToolWorkspace.ts
// =====================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Workspace,
  WorkspaceItem,
} from "../types/Workspace";

import type {
  WorkspaceFile,
} from "../types/WorkspaceFile";

import type {
  WorkspaceFolder,
} from "../types/WorkspaceFolder";

import {
  createWorkspace,
  createWorkspaceFile,
  createWorkspaceFolder,
  deleteWorkspaceItem,
  duplicateWorkspaceFile,
  renameWorkspaceItem,
  updateWorkspaceFile,
} from "../services/workspaceService";

// =====================================================
// STORAGE
// =====================================================

const STORAGE_PREFIX =
  "dltj2.1-working-tool-workspace-";

// =====================================================
// HOOK
// =====================================================

export default function useToolWorkspace(
  technologyId: string
) {
  const storageKey =
    `${STORAGE_PREFIX}${technologyId}`;

  // ===================================================
  // WORKSPACE
  // ===================================================

  const [workspace, setWorkspace] =
    useState<Workspace>(() => {
      const saved =
        loadWorkspace(storageKey);

      if (saved) {
        return normalizeWorkspace(saved);
      }

      return createWorkspace(
        technologyId
      );
    });

  // ===================================================
  // SAVE
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(workspace)
      );
    } catch {
      // Storage may be unavailable.
    }
  }, [workspace, storageKey]);

  // ===================================================
  // ITEMS
  // ===================================================

  const items = workspace.items;

  const files = useMemo(
    () =>
      items.filter(
        (
          item
        ): item is WorkspaceFile =>
          item.type === "file"
      ),
    [items]
  );

  const folders = useMemo(
    () =>
      items.filter(
        (
          item
        ): item is WorkspaceFolder =>
          item.type === "folder"
      ),
    [items]
  );

  // ===================================================
  // ACTIVE FILE
  // ===================================================

  const activeFile = useMemo(
    () =>
      files.find(
        (file) =>
          file.id ===
          workspace.activeFileId
      ) ?? null,
    [files, workspace.activeFileId]
  );

  // ===================================================
  // OPEN FILES
  // ===================================================

  const openFiles = useMemo(
    () =>
      workspace.openFileIds
        .map((id) =>
          files.find(
            (file) => file.id === id
          )
        )
        .filter(
          (
            file
          ): file is WorkspaceFile =>
            Boolean(file)
        ),
    [workspace.openFileIds, files]
  );

  // ===================================================
  // OPEN FILE
  // ===================================================

  const openFile = useCallback(
    (fileId: string) => {
      const file = files.find(
        (item) => item.id === fileId
      );

      if (!file) {
        return;
      }

      setWorkspace((current) => ({
        ...current,
        activeFileId: fileId,
        openFileIds:
          current.openFileIds.includes(
            fileId
          )
            ? current.openFileIds
            : [
                ...current.openFileIds,
                fileId,
              ],
        updatedAt: Date.now(),
      }));
    },
    [files]
  );

  // ===================================================
  // CLOSE FILE
  // ===================================================

  const closeFile = useCallback(
    (fileId: string) => {
      setWorkspace((current) => {
        const newOpenFiles =
          current.openFileIds.filter(
            (id) => id !== fileId
          );

        let newActive =
          current.activeFileId;

        if (
          current.activeFileId ===
          fileId
        ) {
          newActive =
            newOpenFiles.length > 0
              ? newOpenFiles[
                  newOpenFiles.length - 1
                ]
              : null;
        }

        return {
          ...current,
          openFileIds:
            newOpenFiles,
          activeFileId:
            newActive,
          updatedAt: Date.now(),
        };
      });
    },
    []
  );

  // ===================================================
  // CREATE FILE
  // ===================================================

  const createFile = useCallback(
    (
      name: string,
      parentId: string | null = null,
      content = ""
    ) => {
      const file =
        createWorkspaceFile(
          name,
          parentId,
          content
        );

      setWorkspace((current) => ({
        ...current,
        items: [
          ...current.items,
          file,
        ],
        activeFileId: file.id,
        openFileIds: [
          ...current.openFileIds,
          file.id,
        ],
        updatedAt: Date.now(),
        isDirty: true,
      }));

      return file;
    },
    []
  );

  // ===================================================
  // CREATE FOLDER
  // ===================================================

  const createFolder = useCallback(
    (
      name: string,
      parentId: string | null = null
    ) => {
      const folder =
        createWorkspaceFolder(
          name,
          parentId
        );

      setWorkspace((current) => ({
        ...current,
        items: [
          ...current.items,
          folder,
        ],
        updatedAt: Date.now(),
        isDirty: true,
      }));

      return folder;
    },
    []
  );

  // ===================================================
  // UPDATE FILE
  // ===================================================

  const updateFile = useCallback(
    (
      fileId: string,
      content: string
    ) => {
      setWorkspace((current) => ({
        ...current,
        items: current.items.map(
          (item) =>
            item.type === "file" &&
            item.id === fileId
              ? updateWorkspaceFile(
                  item,
                  content
                )
              : item
        ),
        updatedAt: Date.now(),
        isDirty: true,
      }));
    },
    []
  );

  // ===================================================
  // RENAME
  // ===================================================

  const renameItem = useCallback(
    (
      itemId: string,
      newName: string
    ) => {
      const cleanName =
        newName.trim();

      if (!cleanName) {
        return false;
      }

      setWorkspace((current) => ({
        ...current,
        items: current.items.map(
          (item) =>
            item.id === itemId
              ? renameWorkspaceItem(
                  item,
                  cleanName
                )
              : item
        ),
        updatedAt: Date.now(),
        isDirty: true,
      }));

      return true;
    },
    []
  );

  // ===================================================
  // DELETE
  // ===================================================

  const deleteItem = useCallback(
    (itemId: string) => {
      setWorkspace((current) => {
        const item =
          current.items.find(
            (entry) =>
              entry.id === itemId
          );

        if (!item) {
          return current;
        }

        const remaining =
          deleteWorkspaceItem(
            current.items,
            itemId
          );

        const deletedIds =
          new Set(
            current.items
              .filter(
                (entry) =>
                  !remaining.some(
                    (item) =>
                      item.id ===
                      entry.id
                  )
              )
              .map(
                (entry) =>
                  entry.id
              )
          );

        const openFileIds =
          current.openFileIds.filter(
            (id) =>
              !deletedIds.has(id)
          );

        const activeFileId =
          deletedIds.has(
            current.activeFileId ??
              ""
          )
            ? openFileIds[
                openFileIds.length - 1
              ] ?? null
            : current.activeFileId;

        return {
          ...current,
          items: remaining,
          openFileIds,
          activeFileId,
          updatedAt: Date.now(),
          isDirty: true,
        };
      });
    },
    []
  );

  // ===================================================
  // DUPLICATE
  // ===================================================

  const duplicateFile = useCallback(
    (fileId: string) => {
      const source = files.find(
        (file) => file.id === fileId
      );

      if (!source) {
        return null;
      }

      const duplicate =
        duplicateWorkspaceFile(
          source
        );

      setWorkspace((current) => ({
        ...current,
        items: [
          ...current.items,
          duplicate,
        ],
        activeFileId:
          duplicate.id,
        openFileIds: [
          ...current.openFileIds,
          duplicate.id,
        ],
        updatedAt: Date.now(),
        isDirty: true,
      }));

      return duplicate;
    },
    [files]
  );

  // ===================================================
  // SAVE
  // ===================================================

  const saveWorkspace =
    useCallback(() => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...workspace,
            isDirty: false,
            updatedAt: Date.now(),
          })
        );

        setWorkspace((current) => ({
          ...current,
          isDirty: false,
          updatedAt: Date.now(),
        }));

        return true;
      } catch {
        return false;
      }
    }, [storageKey, workspace]);

  // ===================================================
  // RESET
  // ===================================================

  const resetWorkspace =
    useCallback(() => {
      const fresh =
        createWorkspace(
          technologyId
        );

      setWorkspace(fresh);

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify(fresh)
        );
      } catch {
        // Ignore storage errors.
      }
    }, [technologyId, storageKey]);

  // ===================================================
  // RETURN
  // ===================================================

  return {
    workspace,

    items,
    files,
    folders,
    openFiles,

    activeFile,
    activeFileId:
      workspace.activeFileId,

    openFileIds:
      workspace.openFileIds,

    isDirty:
      workspace.isDirty,

    openFile,
    closeFile,

    createFile,
    createFolder,

    updateFile,
    renameItem,
    deleteItem,
    duplicateFile,

    saveWorkspace,
    resetWorkspace,
  };
}

// =====================================================
// LOAD
// =====================================================

function loadWorkspace(
  key: string
): Workspace | null {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return null;
    }

    return JSON.parse(
      saved
    ) as Workspace;
  } catch {
    return null;
  }
}

// =====================================================
// NORMALIZE OLD DATA
// =====================================================

function normalizeWorkspace(
  workspace: Workspace
): Workspace {
  const now = Date.now();

  return {
    ...workspace,

    items: Array.isArray(
      workspace.items
    )
      ? workspace.items.map(
          (item: WorkspaceItem) => ({
            ...item,
            createdAt:
              "createdAt" in item &&
              typeof item.createdAt ===
                "number"
                ? item.createdAt
                : now,
            updatedAt:
              "updatedAt" in item &&
              typeof item.updatedAt ===
                "number"
                ? item.updatedAt
                : now,

            ...(item.type ===
            "file"
              ? {
                  language:
                    item.language ??
                    getLanguage(
                      item.name
                    ),
                  path:
                    item.path ??
                    item.name,
                  isDirty:
                    item.isDirty ??
                    false,
                }
              : {
                  path:
                    item.path ??
                    item.name,
                }),
          })
        )
      : [],

    openFileIds:
      Array.isArray(
        workspace.openFileIds
      )
        ? workspace.openFileIds
        : [],

    activeFileId:
      workspace.activeFileId ??
      null,

    createdAt:
      workspace.createdAt ??
      now,

    updatedAt:
      workspace.updatedAt ??
      now,

    isDirty:
      workspace.isDirty ?? false,
  };
}

// =====================================================
// LANGUAGE
// =====================================================

function getLanguage(
  fileName: string
): string {
  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase();

  switch (extension) {
    case "html":
      return "html";
    case "css":
      return "css";
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "jsx":
      return "javascript";
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