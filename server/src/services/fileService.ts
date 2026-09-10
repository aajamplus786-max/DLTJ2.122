// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 — FILE MANAGEMENT BACKEND
// FILE: server/src/services/fileService.ts
// DATE: 2026-08-31
// =====================================================

import type {
    WorkspaceFile,
    CreateWorkspaceFileInput,
    UpdateWorkspaceFileInput,
  } from "../models/WorkspaceFile";
  
  import type {
    WorkspaceFolder,
  } from "../models/WorkspaceFolder";
  
  // =====================================================
  // IN-MEMORY STORAGE
  // =====================================================
  
  const files = new Map<
    string,
    WorkspaceFile
  >();
  
  const folders = new Map<
    string,
    WorkspaceFolder
  >();
  
  // =====================================================
  // ID
  // =====================================================
  
  function createId(
    prefix: string
  ): string {
    return `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
  
  // =====================================================
  // LANGUAGE
  // =====================================================
  
  function detectLanguage(
    name: string
  ): string {
    const extension =
      name
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
  
  // =====================================================
  // CREATE FILE
  // =====================================================
  
  export function createFile(
    input: CreateWorkspaceFileInput
  ): WorkspaceFile {
    const now = Date.now();
  
    const name =
      input.name.trim() ||
      "untitled.txt";
  
    const content =
      input.content ?? "";
  
    const file: WorkspaceFile = {
      id: createId("file"),
  
      workspaceId:
        input.workspaceId,
  
      parentId:
        input.parentId ?? null,
  
      name,
  
      path: buildPath(
        input.workspaceId,
        input.parentId ?? null,
        name
      ),
  
      content,
  
      language:
        input.language ??
        detectLanguage(name),
  
      size:
        Buffer.byteLength(
          content,
          "utf8"
        ),
  
      isDirty: true,
  
      createdAt: now,
  
      updatedAt: now,
    };
  
    files.set(
      file.id,
      file
    );
  
    return file;
  }
  
  // =====================================================
  // GET FILE
  // =====================================================
  
  export function getFile(
    fileId: string
  ): WorkspaceFile | null {
    return (
      files.get(fileId) ??
      null
    );
  }
  
  // =====================================================
  // GET WORKSPACE FILES
  // =====================================================
  
  export function getWorkspaceFiles(
    workspaceId: string
  ): WorkspaceFile[] {
    return Array.from(
      files.values()
    ).filter(
      (file) =>
        file.workspaceId ===
        workspaceId
    );
  }
  
  // =====================================================
  // UPDATE FILE
  // =====================================================
  
  export function updateFile(
    fileId: string,
    updates: UpdateWorkspaceFileInput
  ): WorkspaceFile | null {
    const file =
      files.get(fileId);
  
    if (!file) {
      return null;
    }
  
    const name =
      updates.name !== undefined
        ? updates.name.trim()
        : file.name;
  
    const content =
      updates.content !== undefined
        ? updates.content
        : file.content;
  
    const parentId =
      updates.parentId !== undefined
        ? updates.parentId
        : file.parentId;
  
    const updated: WorkspaceFile = {
      ...file,
  
      name:
        name || file.name,
  
      parentId,
  
      path: buildPath(
        file.workspaceId,
        parentId,
        name || file.name
      ),
  
      content,
  
      language:
        updates.language ??
        detectLanguage(
          name || file.name
        ),
  
      size:
        Buffer.byteLength(
          content,
          "utf8"
        ),
  
      isDirty: true,
  
      updatedAt:
        Date.now(),
    };
  
    files.set(
      fileId,
      updated
    );
  
    return updated;
  }
  
  // =====================================================
  // RENAME
  // =====================================================
  
  export function renameFile(
    fileId: string,
    name: string
  ): WorkspaceFile | null {
    return updateFile(
      fileId,
      {
        name,
      }
    );
  }
  
  // =====================================================
  // DELETE FILE
  // =====================================================
  
  export function deleteFile(
    fileId: string
  ): boolean {
    return files.delete(
      fileId
    );
  }
  
  // =====================================================
  // CREATE FOLDER
  // =====================================================
  
  export function createFolder(
    workspaceId: string,
    name: string,
    parentId: string | null = null
  ): WorkspaceFolder {
    const now = Date.now();
  
    const cleanName =
      name.trim() ||
      "New Folder";
  
    const folder: WorkspaceFolder = {
      id: createId("folder"),
  
      workspaceId,
  
      parentId,
  
      name: cleanName,
  
      path: buildPath(
        workspaceId,
        parentId,
        cleanName
      ),
  
      createdAt: now,
  
      updatedAt: now,
    };
  
    folders.set(
      folder.id,
      folder
    );
  
    return folder;
  }
  
  // =====================================================
  // GET FOLDER
  // =====================================================
  
  export function getFolder(
    folderId: string
  ): WorkspaceFolder | null {
    return (
      folders.get(folderId) ??
      null
    );
  }
  
  // =====================================================
  // GET WORKSPACE FOLDERS
  // =====================================================
  
  export function getWorkspaceFolders(
    workspaceId: string
  ): WorkspaceFolder[] {
    return Array.from(
      folders.values()
    ).filter(
      (folder) =>
        folder.workspaceId ===
        workspaceId
    );
  }
  
  // =====================================================
  // RENAME FOLDER
  // =====================================================
  
  export function renameFolder(
    folderId: string,
    name: string
  ): WorkspaceFolder | null {
    const folder =
      folders.get(folderId);
  
    if (!folder) {
      return null;
    }
  
    const cleanName =
      name.trim();
  
    if (!cleanName) {
      return folder;
    }
  
    const updated: WorkspaceFolder = {
      ...folder,
  
      name: cleanName,
  
      path: buildPath(
        folder.workspaceId,
        folder.parentId,
        cleanName
      ),
  
      updatedAt: Date.now(),
    };
  
    folders.set(
      folderId,
      updated
    );
  
    return updated;
  }
  
  // =====================================================
  // DELETE FOLDER
  // =====================================================
  
  export function deleteFolder(
    folderId: string
  ): boolean {
    const folder =
      folders.get(folderId);
  
    if (!folder) {
      return false;
    }
  
    const childFolderIds =
      getAllChildFolderIds(
        folderId
      );
  
    childFolderIds.add(
      folderId
    );
  
    for (
      const [id, file]
      of files.entries()
    ) {
      if (
        file.parentId &&
        childFolderIds.has(
          file.parentId
        )
      ) {
        files.delete(id);
      }
    }
  
    for (
      const id
      of childFolderIds
    ) {
      folders.delete(id);
    }
  
    return true;
  }
  
  // =====================================================
  // DELETE WORKSPACE
  // =====================================================
  
  export function deleteWorkspaceFiles(
    workspaceId: string
  ): void {
    for (
      const [id, file]
      of files.entries()
    ) {
      if (
        file.workspaceId ===
        workspaceId
      ) {
        files.delete(id);
      }
    }
  
    for (
      const [id, folder]
      of folders.entries()
    ) {
      if (
        folder.workspaceId ===
        workspaceId
      ) {
        folders.delete(id);
      }
    }
  }
  
  // =====================================================
  // SEARCH
  // =====================================================
  
  export function searchFiles(
    workspaceId: string,
    query: string
  ): WorkspaceFile[] {
    const cleanQuery =
      query
        .trim()
        .toLowerCase();
  
    if (!cleanQuery) {
      return getWorkspaceFiles(
        workspaceId
      );
    }
  
    return getWorkspaceFiles(
      workspaceId
    ).filter(
      (file) =>
        file.name
          .toLowerCase()
          .includes(cleanQuery)
    );
  }
  
  // =====================================================
  // PATH
  // =====================================================
  
  function buildPath(
    workspaceId: string,
    parentId: string | null,
    name: string
  ): string {
    const parts: string[] = [
      name,
    ];
  
    let currentParentId =
      parentId;
  
    while (currentParentId) {
      const folder =
        folders.get(
          currentParentId
        );
  
      if (
        !folder ||
        folder.workspaceId !==
          workspaceId
      ) {
        break;
      }
  
      parts.unshift(
        folder.name
      );
  
      currentParentId =
        folder.parentId;
    }
  
    return parts.join("/");
  }
  
  // =====================================================
  // CHILD FOLDERS
  // =====================================================
  
  function getAllChildFolderIds(
    folderId: string
  ): Set<string> {
    const result =
      new Set<string>();
  
    const queue: string[] = [
      folderId,
    ];
  
    while (queue.length > 0) {
      const current =
        queue.shift();
  
      if (!current) {
        continue;
      }
  
      for (
        const folder
        of folders.values()
      ) {
        if (
          folder.parentId ===
          current
        ) {
          result.add(
            folder.id
          );
  
          queue.push(
            folder.id
          );
        }
      }
    }
  
    return result;
  }