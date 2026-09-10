
// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 13
// FILE: src/services/workspaceService.ts
// DATE: 2026-08-31
// =====================================================

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

// =====================================================
// API CONFIGURATION
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// BACKEND SNAPSHOT
// =====================================================

export interface WorkspaceSnapshot {
  projectId: string;
  files: unknown[];
  folders: unknown[];
  activeFileId?: string | null;
  updatedAt: string;
}

// =====================================================
// HTTP REQUEST
// =====================================================

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    },
  );

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      "Workspace request failed.",
    );
  }

  return data as T;
}

// =====================================================
// BACKEND — LOAD WORKSPACE
// =====================================================

export function loadWorkspaceFromServer(
  projectId: string,
) {
  return request<{
    success: boolean;
    workspace: WorkspaceSnapshot;
  }>(
    `/workspace/${encodeURIComponent(projectId)}`,
    {
      method: "GET",
    },
  );
}

// =====================================================
// BACKEND — SAVE WORKSPACE
// =====================================================

export function saveWorkspaceToServer(
  workspace: WorkspaceSnapshot,
) {
  return request<{
    success: boolean;
    workspace: WorkspaceSnapshot;
  }>(
    "/workspace",
    {
      method: "POST",
      body: JSON.stringify(workspace),
    },
  );
}

// =====================================================
// CREATE WORKSPACE
// =====================================================

export function createWorkspace(
  technologyId: string,
): Workspace {
  const now = Date.now();

  return {
    id: createId("workspace"),
    name: `${technologyId} Workspace`,
    technologyId,
    items: [],
    activeFileId: null,
    openFileIds: [],
    createdAt: now,
    updatedAt: now,
    isDirty: false,
  };
}

// =====================================================
// CREATE FILE
// =====================================================

export function createWorkspaceFile(
  name: string,
  parentId: string | null = null,
  content = "",
): WorkspaceFile {
  const now = Date.now();

  const cleanName =
    name.trim() || "untitled";

  return {
    id: createId("file"),
    type: "file",
    name: cleanName,
    path: cleanName,
    parentId,
    content,
    language: getLanguage(cleanName),
    createdAt: now,
    updatedAt: now,
    isDirty: false,
  } as WorkspaceFile;
}

// =====================================================
// CREATE FOLDER
// =====================================================

export function createWorkspaceFolder(
  name: string,
  parentId: string | null = null,
): WorkspaceFolder {
  const now = Date.now();

  const cleanName =
    name.trim() || "New Folder";

  return {
    id: createId("folder"),
    type: "folder",
    name: cleanName,
    path: cleanName,
    parentId,
    createdAt: now,
    updatedAt: now,
  } as WorkspaceFolder;
}

// =====================================================
// UPDATE FILE
// =====================================================

export function updateWorkspaceFile(
  file: WorkspaceFile,
  content: string,
): WorkspaceFile {
  return {
    ...file,
    content,
    updatedAt: Date.now(),
    isDirty: true,
  };
}

// =====================================================
// RENAME ITEM
// =====================================================

export function renameWorkspaceItem(
  item: WorkspaceItem,
  newName: string,
): WorkspaceItem {
  const cleanName =
    newName.trim();

  if (!cleanName) {
    return item;
  }

  const oldPath =
    item.path ?? item.name;

  const lastSlash =
    Math.max(
      oldPath.lastIndexOf("/"),
      oldPath.lastIndexOf("\\"),
    );

  const newPath =
    lastSlash === -1
      ? cleanName
      : `${oldPath.slice(
          0,
          lastSlash + 1,
        )}${cleanName}`;

  return {
    ...item,
    name: cleanName,
    path: newPath,
    updatedAt: Date.now(),
  } as WorkspaceItem;
}

// =====================================================
// DELETE WORKSPACE ITEM
// =====================================================

export function deleteWorkspaceItem(
  items: WorkspaceItem[],
  itemId: string,
): WorkspaceItem[] {
  const deletedIds =
    new Set<string>();

  const collectChildren = (
    parentId: string,
  ): void => {
    deletedIds.add(parentId);

    items.forEach((item) => {
      if (
        item.parentId === parentId &&
        !deletedIds.has(item.id)
      ) {
        collectChildren(item.id);
      }
    });
  };

  const target =
    items.find(
      (item) => item.id === itemId,
    );

  if (!target) {
    return items;
  }

  collectChildren(itemId);

  return items.filter(
    (item) =>
      !deletedIds.has(item.id),
  );
}

// =====================================================
// DUPLICATE FILE
// =====================================================

export function duplicateWorkspaceFile(
  source: WorkspaceFile,
): WorkspaceFile {
  const now = Date.now();

  const duplicateName =
    createDuplicateName(
      source.name,
    );

  return {
    ...source,
    id: createId("file"),
    name: duplicateName,
    path: duplicateName,
    createdAt: now,
    updatedAt: now,
    isDirty: true,
  };
}

// =====================================================
// LOCAL SAVE
// =====================================================

export function saveWorkspace(
  workspace: Workspace,
): boolean {
  try {
    const storageKey =
      `dltj2.1-working-tool-workspace-${workspace.technologyId}`;

    const savedWorkspace: Workspace = {
      ...workspace,
      isDirty: false,
      updatedAt: Date.now(),
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify(savedWorkspace),
    );

    return true;
  } catch {
    return false;
  }
}

// =====================================================
// LOCAL LOAD
// =====================================================

export function loadLocalWorkspace(
  technologyId: string,
): Workspace | null {
  try {
    const storageKey =
      `dltj2.1-working-tool-workspace-${technologyId}`;

    const saved =
      localStorage.getItem(
        storageKey,
      );

    if (!saved) {
      return null;
    }

    return JSON.parse(
      saved,
    ) as Workspace;
  } catch {
    return null;
  }
}

// =====================================================
// ID GENERATOR
// =====================================================

function createId(
  prefix: string,
): string {
  return [
    prefix,
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 10),
  ].join("-");
}

// =====================================================
// DUPLICATE NAME
// =====================================================

function createDuplicateName(
  name: string,
): string {
  const dotIndex =
    name.lastIndexOf(".");

  if (
    dotIndex > 0 &&
    dotIndex < name.length - 1
  ) {
    const base =
      name.slice(
        0,
        dotIndex,
      );

    const extension =
      name.slice(dotIndex);

    return `${base}-copy${extension}`;
  }

  return `${name}-copy`;
}

// =====================================================
// LANGUAGE DETECTION
// =====================================================

function getLanguage(
  fileName: string,
): string {
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
