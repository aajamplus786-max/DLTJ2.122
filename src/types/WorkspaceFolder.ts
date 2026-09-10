// =====================================================
// DLTJ2.1 — WORKSPACE FOLDER
// FILE: src/types/WorkspaceFolder.ts
// =====================================================

export interface WorkspaceFolder {
  id: string;
  name: string;
  type: "folder";

  parentId: string | null;

  path: string;

  createdAt: number;
  updatedAt: number;
}

export interface CreateWorkspaceFolderInput {
  name: string;
  parentId?: string | null;
}

export interface RenameWorkspaceFolderInput {
  name: string;
}