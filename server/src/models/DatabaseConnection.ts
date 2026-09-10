// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: server/src/models/DatabaseConnection.ts
// DATE: 2026-08-31
// =====================================================

export interface DatabaseConnection {
    id: string;
    projectId: string;
    name: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  }