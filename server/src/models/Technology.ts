// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// TECHNOLOGY MODEL
// FILE: server/src/models/Technology.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

export interface Technology {
    id: string;
    name: string;
    section: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}