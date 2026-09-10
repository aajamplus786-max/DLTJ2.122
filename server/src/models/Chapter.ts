// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// CHAPTER MODEL
// FILE: server/src/models/Chapter.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

export interface Chapter {
    id: string;
    technologyId: string;
    chapterNumber: number;
    title: string;
    description: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}