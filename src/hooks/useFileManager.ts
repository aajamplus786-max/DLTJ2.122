// =====================================================
// DLTJ2.1 — FILE MANAGER HOOK
// FILE: src/hooks/useFileManager.ts
// =====================================================

import {
  useCallback,
  useMemo,
} from "react";

import type {
  WorkspaceFile,
} from "../types/WorkspaceFile";

import type {
  WorkspaceFolder,
} from "../types/WorkspaceFolder";

import type {
  WorkspaceItem,
} from "../types/Workspace";

export default function useFileManager(
  items: WorkspaceItem[]
) {
  // ===================================================
  // FILES
  // ===================================================

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

  // ===================================================
  // FOLDERS
  // ===================================================

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
  // FIND ITEM
  // ===================================================

  const findItem = useCallback(
    (id: string) =>
      items.find(
        (item) => item.id === id
      ) ?? null,
    [items]
  );

  // ===================================================
  // FIND FILE
  // ===================================================

  const findFile = useCallback(
    (id: string) =>
      files.find(
        (file) => file.id === id
      ) ?? null,
    [files]
  );

  // ===================================================
  // FIND FOLDER
  // ===================================================

  const findFolder = useCallback(
    (id: string) =>
      folders.find(
        (folder) =>
          folder.id === id
      ) ?? null,
    [folders]
  );

  // ===================================================
  // CHILDREN
  // ===================================================

  const getChildren = useCallback(
    (parentId: string | null) =>
      items.filter(
        (item) =>
          item.parentId === parentId
      ),
    [items]
  );

  // ===================================================
  // FILE CHILDREN
  // ===================================================

  const getFolderFiles =
    useCallback(
      (folderId: string) =>
        files.filter(
          (file) =>
            file.parentId ===
            folderId
        ),
      [files]
    );

  // ===================================================
  // FOLDER CHILDREN
  // ===================================================

  const getSubFolders =
    useCallback(
      (folderId: string) =>
        folders.filter(
          (folder) =>
            folder.parentId ===
            folderId
        ),
      [folders]
    );

  // ===================================================
  // ROOT ITEMS
  // ===================================================

  const rootItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.parentId === null
      ),
    [items]
  );

  // ===================================================
  // BUILD PATH
  // ===================================================

  const getPath = useCallback(
    (itemId: string): string => {
      const item =
        findItem(itemId);

      if (!item) {
        return "";
      }

      const parts = [item.name];

      let parentId =
        item.parentId;

      while (parentId) {
        const parent =
          findFolder(parentId);

        if (!parent) {
          break;
        }

        parts.unshift(
          parent.name
        );

        parentId =
          parent.parentId;
      }

      return parts.join("/");
    },
    [findFolder, findItem]
  );

  // ===================================================
  // SEARCH
  // ===================================================

  const search = useCallback(
    (query: string) => {
      const cleanQuery =
        query
          .trim()
          .toLowerCase();

      if (!cleanQuery) {
        return items;
      }

      return items.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(cleanQuery)
      );
    },
    [items]
  );

  // ===================================================
  // EXTENSION
  // ===================================================

  const getExtension =
    useCallback(
      (fileName: string) => {
        const index =
          fileName.lastIndexOf(
            "."
          );

        if (
          index <= 0 ||
          index ===
            fileName.length - 1
        ) {
          return "";
        }

        return fileName
          .slice(index + 1)
          .toLowerCase();
      },
      []
    );

  // ===================================================
  // LANGUAGE
  // ===================================================

  const getLanguage =
    useCallback(
      (fileName: string) => {
        const extension =
          getExtension(fileName);

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
      },
      [getExtension]
    );

  // ===================================================
  // RETURN
  // ===================================================

  return {
    items,
    files,
    folders,
    rootItems,

    findItem,
    findFile,
    findFolder,

    getChildren,
    getFolderFiles,
    getSubFolders,

    getPath,
    search,

    getExtension,
    getLanguage,
  };
}