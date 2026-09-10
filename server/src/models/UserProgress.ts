// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// USER PROGRESS MODEL
// FILE: server/src/models/UserProgress.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

export interface UserProgress {
    id: string;

    userId: string;
    technologyId: string;

    chapterId: string | null;
    lessonId: string | null;
    testId: string | null;

    progressType: string;

    completed: boolean;

    score: number | null;
    passed: boolean | null;

    completedAt: string | null;

    createdAt: string;
    updatedAt: string;
}