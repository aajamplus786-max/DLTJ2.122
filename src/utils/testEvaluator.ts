// =====================================================
// DLTJ2.1
// TEST EVALUATOR
// FILE: src/utils/testEvaluator.ts
// =====================================================

import type {
  TestQuestion,
} from "../types/Test";

import type {
  FinalTest,
} from "../types/FinalTest";

// =====================================================
// NORMALIZE
// =====================================================

function normalize(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " ",
    );
}

// =====================================================
// CHECK ANSWER
// =====================================================

export function isAnswerCorrect(
  question: TestQuestion,
  userAnswer: string,
): boolean {
  if (!userAnswer) {
    return false;
  }

  return (
    normalize(userAnswer) ===
    normalize(question.answer)
  );
}

// =====================================================
// SCORE
// =====================================================

export function calculateScore(
  questions: TestQuestion[],
  answers: Record<string, string>,
): number {
  return questions.reduce(
    (score, question) => {
      const answer =
        answers[question.id];

      return isAnswerCorrect(
        question,
        answer ?? "",
      )
        ? score +
            question.marks
        : score;
    },
    0,
  );
}

// =====================================================
// STATISTICS
// =====================================================

export function evaluateTest(
  questions: TestQuestion[],
  answers: Record<string, string>,
  passingMarks: number,
) {
  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unanswered = 0;

  questions.forEach(
    (question) => {
      const answer =
        answers[
          question.id
        ];

      if (
        !answer ||
        !answer.trim()
      ) {
        unanswered++;
        return;
      }

      if (
        isAnswerCorrect(
          question,
          answer,
        )
      ) {
        score +=
          question.marks;
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    },
  );

  const totalMarks =
    questions.reduce(
      (total, question) =>
        total +
        question.marks,
      0,
    );

  const percentage =
    totalMarks > 0
      ? (score /
          totalMarks) *
        100
      : 0;

  return {
    score,
    totalMarks,
    percentage,
    passed:
      score >=
      passingMarks,
    correctAnswers,
    wrongAnswers,
    unanswered,
  };
}

// =====================================================
// FINAL TEST EVALUATION
// =====================================================

export function calculateFinalTestResult(
  test: FinalTest,
  answers: Record<string, string>,
) {
  return evaluateTest(
    test.questions,
    answers,
    test.passingMarks,
  );
}

// =====================================================
// PASS CHECK
// =====================================================

export function isTestPassed(
  score: number,
  totalMarks: number,
  passingPercentage = 50,
): boolean {
  if (totalMarks <= 0) {
    return false;
  }

  const percentage =
    (score /
      totalMarks) *
    100;

  return (
    percentage >=
    passingPercentage
  );
}

// =====================================================
// PERCENTAGE
// =====================================================

export function calculatePercentage(
  score: number,
  totalMarks: number,
): number {
  if (totalMarks <= 0) {
    return 0;
  }

  return Number(
    (
      (score /
        totalMarks) *
      100
    ).toFixed(2),
  );
}