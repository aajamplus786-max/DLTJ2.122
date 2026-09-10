// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 — FILE MANAGEMENT BACKEND
// FILE: server/src/models/WorkspaceFolder.ts
// DATE: 2026-08-31
// =====================================================

export interface WorkspaceFolder {
    id: string;
  
    workspaceId: string;
  
    parentId: string | null;
  
    name: string;
  
    path: string;
  
    createdAt: number;
  
    updatedAt: number;
  }
  
  export interface CreateWorkspaceFolderInput {
    workspaceId: string;
  
    parentId?: string | null;
  
    name: string;
  }
  
  export interface UpdateWorkspaceFolderInput {
    name?: string;
  
    parentId?: string | null;
  }