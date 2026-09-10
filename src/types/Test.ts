// =====================================================
// DLTJ2.1
// PHASE 1 — TEST TYPES
// FILE: src/types/Test.ts
// =====================================================

export type TestOption = {
  id: string;
  text: string;
};

export type TestQuestion = {
  id: string;

  technologyId: string;
  chapterId: string;

  question: string;

  options: TestOption[];

  // Correct option id
  answer: string;

  explanation?: string;

  marks: number;

  displayOrder: number;

  available: boolean;
};

export type ChapterTest = {
  id: string;

  technologyId: string;

  testNumber: number;

  title: string;

  fromChapter: number;
  toChapter: number;

  questionCount: number;

  totalMarks: number;

  passingMarks: number;

  durationMinutes: number;

  available: boolean;
};

export type TestResultData = {
  id?: string;

  testId: string;

  technologyId: string;

  userId?: string;

  score: number;

  totalMarks: number;

  percentage: number;

  passed: boolean;

  answers: Record<string, string>;

  completedAt: string;
};

export type TestResult = TestResultData & {
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
};

export type TestProgress = {
  currentQuestion: number;
  totalQuestions: number;
  answered: number;
  remainingSeconds: number;
};

export type TestAnswer = {
  questionId: string;
  answer: string;
};