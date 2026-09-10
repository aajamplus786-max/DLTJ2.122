
// =====================================================
// DLTJ2.1
// QUESTION REGISTRY
// FILE: src/data/questions/index.ts
// =====================================================

import type {
  TestQuestion,
  TestOption,
} from "../../types/Test";

// =====================================================
// TECHNOLOGY QUESTIONS
// =====================================================

import { htmlQuestions } from "./htmlQuestions";
import { cssQuestions } from "./cssQuestions";
import { javascriptQuestions } from "./javascriptQuestions";
import { javaQuestions } from "./javaQuestions";
import { mysqlQuestions } from "./mysqlQuestions";
import { pythonQuestions } from "./pythonQuestions";
import { cQuestions } from "./cQuestions";
import { cppQuestions } from "./cppQuestions";
import { reactQuestions } from "./reactQuestions";

// =====================================================
// SPRING / TYPESCRIPT
// =====================================================
//
// Namespace imports make the registry tolerant of the
// module export shape while we keep the question files
// independently maintained.
// =====================================================

import * as springQuestionModule from "./springQuestions";
import * as typescriptQuestionModule from "./typescriptQuestions";

// =====================================================
// SPRING QUESTIONS
// =====================================================

const springQuestionData =
  springQuestionModule as unknown as {
    springQuestions?: TestQuestion[];
    default?: TestQuestion[];
  };

const springQuestions: TestQuestion[] =
  springQuestionData.springQuestions ??
  springQuestionData.default ??
  [];

// =====================================================
// TYPESCRIPT QUESTIONS
// =====================================================

const typescriptQuestionData =
  typescriptQuestionModule as unknown as {
    typescriptQuestions?: TestQuestion[];
    default?: TestQuestion[];
  };

const typescriptQuestions: TestQuestion[] =
  typescriptQuestionData.typescriptQuestions ??
  typescriptQuestionData.default ??
  [];

// =====================================================
// ALL QUESTIONS
// =====================================================

export const questions: TestQuestion[] = [
  ...htmlQuestions,
  ...cssQuestions,
  ...javascriptQuestions,
  ...javaQuestions,
  ...mysqlQuestions,
  ...pythonQuestions,
  ...cQuestions,
  ...cppQuestions,
  ...reactQuestions,
  ...springQuestions,
  ...typescriptQuestions,
];

// =====================================================
// QUESTION OPTION FACTORY
// =====================================================

export function createTestOption(
  id: string,
  text: string
): TestOption {
  return {
    id,
    text,
  };
}

// =====================================================
// QUESTION FACTORY
// =====================================================

export function createQuestion(
  technologyId: string,
  chapterNumber: number,
  questionNumber: number,
  question: string,
  optionTexts: string[],
  correctIndex: number,
  explanation?: string
): TestQuestion {
  const options: TestOption[] =
    optionTexts.map(
      (text, index) =>
        createTestOption(
          String.fromCharCode(65 + index),
          text
        )
    );

  const safeCorrectIndex =
    correctIndex >= 0 &&
    correctIndex < options.length
      ? correctIndex
      : 0;

  return {
    id:
      `${technologyId}-q-${chapterNumber}-${questionNumber}`,

    technologyId,

    chapterId:
      `${technologyId}-chapter-${chapterNumber}`,

    question,

    options,

    answer:
      options[safeCorrectIndex]?.id ?? "A",

    explanation,

    marks: 1,

    displayOrder: questionNumber,

    available: true,
  };
}

// =====================================================
// GET ALL QUESTIONS
// =====================================================

export function getAllQuestions(): TestQuestion[] {
  return [...questions];
}

// =====================================================
// GET QUESTIONS BY TECHNOLOGY
// =====================================================

export function getQuestionsByTechnology(
  technologyId: string
): TestQuestion[] {
  return questions.filter(
    (question) =>
      question.technologyId === technologyId
  );
}

// =====================================================
// GET QUESTIONS BY CHAPTER
// =====================================================

export function getQuestionsByChapter(
  technologyId: string,
  chapterNumber: number
): TestQuestion[] {
  const chapterId =
    `${technologyId}-chapter-${chapterNumber}`;

  return questions.filter(
    (question) =>
      question.technologyId === technologyId &&
      question.chapterId === chapterId
  );
}

// =====================================================
// GET QUESTION BY ID
// =====================================================

export function getQuestionById(
  questionId: string
): TestQuestion | undefined {
  return questions.find(
    (question) =>
      question.id === questionId
  );
}

// =====================================================
// GET QUESTIONS BY CHAPTER RANGE
// =====================================================

export function getQuestionsByChapterRange(
  technologyId: string,
  fromChapter: number,
  toChapter: number
): TestQuestion[] {
  return questions.filter(
    (question) => {
      if (
        question.technologyId !==
        technologyId
      ) {
        return false;
      }

      const chapterNumber =
        Number(
          question.chapterId
            .split("-")
            .pop()
        );

      return (
        chapterNumber >= fromChapter &&
        chapterNumber <= toChapter
      );
    }
  );
}