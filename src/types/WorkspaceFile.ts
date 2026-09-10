// =====================================================
// DLTJ2.1 — WORKSPACE FILE
// FILE: src/types/WorkspaceFile.ts
// =====================================================

export interface WorkspaceFile {
  id: string;
  name: string;
  type: "file";

  content: string;

  parentId: string | null;

  language: string;

  path: string;

  createdAt: number;
  updatedAt: number;

  isDirty: boolean;
}

export interface CreateWorkspaceFileInput {
  name: string;
  content?: string;
  parentId?: string | null;
  language?: string;
}

export interface UpdateWorkspaceFileInput {
  content?: string;
  name?: string;
  parentId?: string | null;
}

export interface WorkspaceFileTab {
  fileId: string;
  isActive: boolean;
  isDirty: boolean;
}