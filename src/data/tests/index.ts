// =====================================================
// DLTJ2.1
// TEST REGISTRY
// FILE: src/data/tests/index.ts
// =====================================================

import type {
  FinalTest,
} from "../../types/FinalTest";

import type {
  TestQuestion,
} from "../../types/Test";

import {
  getQuestionsByTechnology,
} from "../questions";

// =====================================================
// FINAL TEST CONFIGURATION
// =====================================================

type FinalTestConfig = {
  title: string;
  description: string;
  durationMinutes: number;
  passingPercentage: number;
  questionCount?: number;
};

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

const defaultConfig: FinalTestConfig = {
  title: "Final Assessment",
  description:
    "Complete the final assessment for this technology.",
  durationMinutes: 60,
  passingPercentage: 50,
};

// =====================================================
// ADMIN-READY CONFIGURATION REGISTRY
// =====================================================
//
// Future Admin can replace/update this configuration
// from backend/database without changing Test UI.
//
// =====================================================

const finalTestConfigs: Record<
  string,
  FinalTestConfig
> = {};

// =====================================================
// REGISTER FINAL TEST CONFIG
// =====================================================

export function registerFinalTestConfig(
  technologyId: string,
  config: FinalTestConfig,
): void {
  finalTestConfigs[technologyId] = {
    ...defaultConfig,
    ...config,
  };
}

// =====================================================
// GET FINAL TEST CONFIG
// =====================================================

export function getFinalTestConfig(
  technologyId: string,
): FinalTestConfig {
  return (
    finalTestConfigs[technologyId] ??
    defaultConfig
  );
}

// =====================================================
// CREATE FINAL TEST
// =====================================================

export function createFinalTest(
  technologyId: string,
): FinalTest | undefined {
  const allQuestions =
    getQuestionsByTechnology(
      technologyId,
    ).filter(
      (question) =>
        question.available,
    );

  if (allQuestions.length === 0) {
    return undefined;
  }

  const config =
    getFinalTestConfig(
      technologyId,
    );

  const selectedQuestions =
    config.questionCount &&
    config.questionCount <
      allQuestions.length
      ? allQuestions.slice(
          0,
          config.questionCount,
        )
      : allQuestions;

  const questions: TestQuestion[] =
    selectedQuestions.map(
      (question, index) => ({
        ...question,
        displayOrder:
          index + 1,
      }),
    );

  const totalMarks =
    questions.reduce(
      (total, question) =>
        total + question.marks,
      0,
    );

  const passingMarks =
    Math.ceil(
      (totalMarks *
        config.passingPercentage) /
        100,
    );

  return {
    id: `${technologyId}-final-test`,

    technologyId,

    title:
      config.title,

    description:
      config.description,

    questions,

    totalMarks,

    passingMarks,

    durationMinutes:
      config.durationMinutes,

    available: true,
  };
}

// =====================================================
// GET FINAL TEST
// =====================================================

export function getFinalTest(
  technologyId: string,
): FinalTest | undefined {
  return createFinalTest(
    technologyId,
  );
}

// =====================================================
// GET ALL AVAILABLE FINAL TESTS
// =====================================================

export function getAllFinalTests(): FinalTest[] {
  const technologyIds =
    Array.from(
      new Set(
        getQuestionsByTechnologyIds(),
      ),
    );

  return technologyIds
    .map((technologyId) =>
      createFinalTest(
        technologyId,
      ),
    )
    .filter(
      (
        test,
      ): test is FinalTest =>
        test !== undefined,
    );
}

// =====================================================
// INTERNAL TECHNOLOGY ID COLLECTION
// =====================================================

function getQuestionsByTechnologyIds():
  string[] {
  const allQuestions =
    getAllRegisteredQuestions();

  return allQuestions.map(
    (question) =>
      question.technologyId,
  );
}

// =====================================================
// GET ALL REGISTERED QUESTIONS
// =====================================================

function getAllRegisteredQuestions():
  TestQuestion[] {
  const technologyIds = [
    "html",
    "css",
    "javascript",
    "java",
    "mysql",
    "python",
    "c",
    "cpp",
    "react",
    "spring",
    "typescript",
  ];

  return technologyIds.flatMap(
    (technologyId) =>
      getQuestionsByTechnology(
        technologyId,
      ),
  );
}