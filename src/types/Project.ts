// =====================================================
// DLTJ2.1 — WORKING TOOL PROJECT
// FILE: src/types/Project.ts
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
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface ProjectSummary {
  id: string;
  name: string;
  technologyId: string;
  status: ProjectStatus;
  updatedAt: number;
}