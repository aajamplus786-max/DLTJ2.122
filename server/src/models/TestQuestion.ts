// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// TEST QUESTION MODEL
// FILE: server/src/models/TestQuestion.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

export interface TestQuestion {
    id: string;

    testId: string;
    questionId: string;

    marks: number;

    displayOrder: number;

    createdAt: string;
}