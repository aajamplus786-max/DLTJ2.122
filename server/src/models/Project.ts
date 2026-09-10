// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 — FILE MANAGEMENT BACKEND
// FILE: server/src/models/Project.ts
// DATE: 2026-08-31
// =====================================================

export type ProjectStatus =
  | "local"
  | "saved"
  | "running"
  | "error";

export interface Project {
  id: string;

  name: string;

  technologyId: string;

  workspaceId: string;

  description?: string;

  status: ProjectStatus;

  createdAt: number;

  updatedAt: number;

  lastOpenedAt?: number;
}

export interface CreateProjectInput {
  name: string;

  technologyId: string;

  workspaceId?: string;

  description?: string;
}

export interface UpdateProjectInput {
  name?: string;

  description?: string;

  status?: ProjectStatus;
}