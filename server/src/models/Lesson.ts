// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// LESSON MODEL
// FILE: server/src/models/Lesson.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

export interface Lesson {
    id: string;
    chapterId: string;
    lessonNumber: number;
    title: string;
    content: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}