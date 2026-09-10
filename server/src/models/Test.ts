// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// TEST MODEL
// FILE: server/src/models/Test.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

export interface Test {
    id: string;
    technologyId: string;

    title: string;

    testType: string;

    startChapter: number | null;
    endChapter: number | null;

    passPercentage: number;

    displayOrder: number;

    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}