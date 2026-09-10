
// =====================================================
// DLTJ2.10
// TEST RESULT
// FILE: src/pages/Test/TestResult.tsx
// CREATED: 2026-09-06
// LOCATION: src/pages/Test/TestResult.tsx
// PHASE: 10
// =====================================================

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import type {
  TestAttemptResult,
} from "../../services/testService";

interface ResultState {
  result?: TestAttemptResult;
  automatic?: boolean;
}

export default function TestResult() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const state =
    location.state as
      | ResultState
      | null;

  const result =
    state?.result;

  if (!result) {
    return (
      <section className="test-page">
        <h1>
          Test Result
        </h1>

        <p>
          No test result data is
          available.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/test")
          }
        >
          Back to Tests
        </button>
      </section>
    );
  }

  const isChapterTest =
    result.testType ===
    "chapter";

  const isFinalTest =
    result.testType ===
    "final";

  return (
    <section className="test-page">
      <header className="test-page-header">
        <div>
          <h1>
            Test Result
          </h1>

          <p>
            {isFinalTest
              ? "Final Test"
              : "Chapter Test"}
          </p>
        </div>
      </header>

      <div className="test-card">
        <h2>
          {result.earnedMarks} /{" "}
          {result.totalMarks}
        </h2>

        <p>
          Percentage:{" "}
          {result.percentage}%
        </p>

        <p>
          Questions:{" "}
          {result.totalQuestions}
        </p>

        <p>
          Answered:{" "}
          {result.answeredQuestions}
        </p>

        <p>
          Completed:{" "}
          {new Date(
            result.completedAt,
          ).toLocaleString()}
        </p>
      </div>

      {result.passed ? (
        <div className="test-success">
          <h2>
            ✅ TEST PASSED
          </h2>

          <p>
            This test has been
            permanently unlocked.
            No retake is required.
          </p>
        </div>
      ) : (
        <div className="test-error">
          <h2>
            ❌ TEST FAILED
          </h2>

          <p>
            You can retake the test
            and improve your score.
          </p>
        </div>
      )}

      <div className="test-actions">
        {!result.passed &&
          isChapterTest &&
          result.chapterId && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/test/chapter/${encodeURIComponent(
                    result.technologyId,
                  )}/${encodeURIComponent(
                    result.chapterId as string,
                  )}/${encodeURIComponent(
                    String(
                      result.testNumber ??
                        1,
                    ),
                  )}`,
                )
              }
            >
              Retest
            </button>
          )}

        {!result.passed &&
          isFinalTest && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/test/final/${encodeURIComponent(
                    result.technologyId,
                  )}`,
                )
              }
            >
              Retest Final Test
            </button>
          )}

        <button
          type="button"
          onClick={() =>
            navigate("/test")
          }
        >
          Back to Tests
        </button>
      </div>
    </section>
  );
}
