// =====================================================
// DLTJ2.1
// PHASE 1 — FINAL TEST TYPES
// FILE: src/types/FinalTest.ts
// =====================================================

import type { TestQuestion } from "./Test";

export type FinalTestSection = {
  id: string;

  title: string;

  description?: string;

  questionIds: string[];

  displayOrder: number;
};

export type FinalTest = {
  id: string;

  technologyId: string;

  title: string;

  description: string;

  questions: TestQuestion[];

  sections?: FinalTestSection[];

  totalMarks: number;

  passingMarks: number;

  durationMinutes: number;

  available: boolean;
};

export type FinalTestResult = {
  id?: string;

  testId: string;

  technologyId: string;

  userId?: string;

  score: number;

  totalMarks: number;

  percentage: number;

  passed: boolean;

  answers: Record<string, string>;

  correctAnswers: number;

  wrongAnswers: number;

  unanswered: number;

  completedAt: string;
};