// =====================================================
// DLTJ2.1
// FINAL TEST SERVICE
// FILE: src/services/finalTestService.ts
// =====================================================

import type {
  FinalTest,
  FinalTestResult,
} from "../types/FinalTest";

import {
  getFinalTest,
} from "../data/tests";

import {
  calculateFinalTestResult,
} from "../utils/testEvaluator";

// =====================================================
// STORAGE
// =====================================================

const FINAL_RESULTS_KEY =
  "dltj2.1_final_test_results_v2";

// =====================================================
// GET FINAL TEST
// =====================================================

export function getTechnologyFinalTest(
  technologyId: string,
):
  FinalTest | undefined {
  return getFinalTest(
    technologyId,
  );
}

// =====================================================
// GET ALL RESULTS
// =====================================================

export function getFinalTestResults():
  FinalTestResult[] {
  try {
    const stored =
      localStorage.getItem(
        FINAL_RESULTS_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed as FinalTestResult[]
      : [];
  } catch {
    return [];
  }
}

// =====================================================
// SAVE RESULT
// =====================================================

export function saveFinalTestResult(
  result: FinalTestResult,
): void {
  const results =
    getFinalTestResults();

  const index =
    results.findIndex(
      (item) =>
        item.testId ===
          result.testId &&
        item.userId ===
          result.userId,
    );

  if (index >= 0) {
    results[index] =
      result;
  } else {
    results.push(result);
  }

  try {
    localStorage.setItem(
      FINAL_RESULTS_KEY,
      JSON.stringify(results),
    );
  } catch {
    // Ignore storage errors.
  }
}

// =====================================================
// SUBMIT FINAL TEST
// =====================================================

export function submitFinalTest(
  test: FinalTest,
  answers: Record<string, string>,
  userId?: string,
): FinalTestResult {
  const evaluated =
    calculateFinalTestResult(
      test,
      answers,
    );

  const finalResult:
    FinalTestResult = {
    id:
      `${test.id}-${Date.now()}`,

    testId:
      test.id,

    technologyId:
      test.technologyId,

    userId,

    score:
      evaluated.score,

    totalMarks:
      test.totalMarks,

    percentage:
      evaluated.percentage,

    passed:
      evaluated.passed,

    answers: {
      ...answers,
    },

    correctAnswers:
      evaluated.correctAnswers,

    wrongAnswers:
      evaluated.wrongAnswers,

    unanswered:
      evaluated.unanswered,

    completedAt:
      new Date().toISOString(),
  };

  saveFinalTestResult(
    finalResult,
  );

  return finalResult;
}

// =====================================================
// GET RESULT
// =====================================================

export function getFinalTestResult(
  testId: string,
  userId?: string,
):
  FinalTestResult | null {
  return (
    getFinalTestResults().find(
      (result) =>
        result.testId === testId &&
        (
          userId === undefined ||
          result.userId === userId
        ),
    ) ?? null
  );
}

// =====================================================
// PASS CHECK
// =====================================================

export function isFinalTestPassed(
  testId: string,
  userId?: string,
): boolean {
  return (
    getFinalTestResult(
      testId,
      userId,
    )?.passed === true
  );
}

// =====================================================
// TECHNOLOGY COMPLETED
// =====================================================

export function isTechnologyCompleted(
  technologyId: string,
  userId?: string,
): boolean {
  return getFinalTestResults().some(
    (result) =>
      result.technologyId ===
        technologyId &&
      result.passed === true &&
      (
        userId === undefined ||
        result.userId === userId
      ),
  );
}

// =====================================================
// CLEAR RESULT
// =====================================================

export function clearFinalTestResult(
  testId: string,
  userId?: string,
): void {
  const results =
    getFinalTestResults();

  const filtered =
    results.filter(
      (result) =>
        !(
          result.testId ===
            testId &&
          (
            userId === undefined ||
            result.userId === userId
          )
        ),
    );

  try {
    localStorage.setItem(
      FINAL_RESULTS_KEY,
      JSON.stringify(filtered),
    );
  } catch {
    // Ignore storage errors.
  }
}

// =====================================================
// CLEAR ALL
// =====================================================

export function clearFinalTestResults():
  void {
  try {
    localStorage.removeItem(
      FINAL_RESULTS_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}