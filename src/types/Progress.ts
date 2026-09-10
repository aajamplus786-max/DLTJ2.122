// =====================================================
// DLTJ2.1
// STEP 5 — BATCH 1
// FILE: src/types/Progress.ts
// =====================================================

export interface TechnologyProgress {
  technologyId: string;

  completedChapters: string[];

  passedTests: string[];

  failedTests: string[];

  finalTestPassed: boolean;

  finalTestScore?: number;

  lastUpdated: string;
}

export interface ProgressState {
  technologies: Record<
    string,
    TechnologyProgress
  >;
}