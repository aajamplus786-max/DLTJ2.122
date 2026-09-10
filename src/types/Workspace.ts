// =====================================================
// DLTJ2.1 — WORKSPACE TYPES
// FILE: src/types/Workspace.ts
// =====================================================

import type { WorkspaceFile } from "./WorkspaceFile";
import type { WorkspaceFolder } from "./WorkspaceFolder";

export type WorkspaceItem =
  | WorkspaceFile
  | WorkspaceFolder;

export interface Workspace {
  id: string;
  name: string;
  technologyId: string;

  items: WorkspaceItem[];

  activeFileId: string | null;
  openFileIds: string[];

  createdAt: number;
  updatedAt: number;

  isDirty: boolean;
}

export interface WorkspaceState {
  workspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

export interface WorkspaceSnapshot {
  workspace: Workspace;
  savedAt: number;
}