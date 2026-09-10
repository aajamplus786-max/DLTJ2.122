// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// QUESTION MODEL
// FILE: server/src/models/Question.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

export interface Question {
    id: string;
    technologyId: string;
    chapterId: string | null;

    questionType: string;

    questionText: string;

    optionA: string | null;
    optionB: string | null;
    optionC: string | null;
    optionD: string | null;

    correctAnswer: string;

    explanation: string | null;

    marks: number;

    displayOrder: number;

    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}