// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 — FILE MANAGEMENT BACKEND
// FILE: server/src/models/WorkspaceFile.ts
// DATE: 2026-08-31
// =====================================================

export interface WorkspaceFile {
    id: string;
  
    workspaceId: string;
  
    parentId: string | null;
  
    name: string;
  
    path: string;
  
    content: string;
  
    language: string;
  
    size: number;
  
    isDirty: boolean;
  
    createdAt: number;
  
    updatedAt: number;
  }
  
  export interface CreateWorkspaceFileInput {
    workspaceId: string;
  
    parentId?: string | null;
  
    name: string;
  
    content?: string;
  
    language?: string;
  }
  
  export interface UpdateWorkspaceFileInput {
    name?: string;
  
    content?: string;
  
    parentId?: string | null;
  
    language?: string;
  }