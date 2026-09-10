
// =====================================================
// DLTJ2.10
// TEST SERVICE
// FILE: src/services/testService.ts
// CREATED: 2026-09-06
// UPDATED: 2026-09-06
// LOCATION: src/services/testService.ts
// PHASE: 10
// =====================================================

import {
  getQuestionsByChapter,
  type Question,
} from "./questionService";

// =====================================================
// API CONFIG
// =====================================================

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api"
).replace(/\/+$/, "");

// =====================================================
// LOCAL STORAGE KEYS
// =====================================================

const TEST_RESULT_STORAGE_KEY =
  "dltj210.test.results";

const TEST_UNLOCK_STORAGE_KEY =
  "dltj210.test.unlocks";

// =====================================================
// TEST QUESTION
// =====================================================

export interface TestQuestion {
  id: string;

  technologyId?: string;

  chapterId?: string;

  questionType?: string;

  questionText: string;

  optionA?: string;

  optionB?: string;

  optionC?: string;

  optionD?: string;

  correctAnswer: string;

  explanation?: string;

  marks: number;

  displayOrder?: number;

  isActive?: boolean;
}

// =====================================================
// TEST DEFINITION
// =====================================================

export interface TestDefinition {
  id: string;

  technologyId: string;

  title: string;

  testType:
    | "chapter"
    | "final"
    | "practice"
    | string;

  startChapter?: number;

  endChapter?: number;

  passPercentage: number;

  displayOrder?: number;

  isActive?: boolean;
}

// =====================================================
// TEST ATTEMPT QUESTION
// =====================================================

export interface TestAttemptQuestion {
  questionId: string;

  selectedAnswer: string;

  correctAnswer: string;

  correct: boolean;

  marks: number;

  earnedMarks: number;
}

// =====================================================
// TEST ATTEMPT RESULT
// =====================================================

export interface TestAttemptResult {
  id: string;

  userId?: string;

  technologyId: string;

  chapterId?: string;

  testId?: string;

  testType:
    | "chapter"
    | "final"
    | string;

  testNumber?: number;

  totalQuestions: number;

  answeredQuestions: number;

  totalMarks: number;

  earnedMarks: number;

  score: number;

  percentage: number;

  passed: boolean;

  completedAt: string;

  questions: TestAttemptQuestion[];
}

// =====================================================
// CREATE UNIQUE ID
// =====================================================

function createId(): string {
  return (
    Date.now().toString(36) +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
}

// =====================================================
// JSON READ
// =====================================================

function readJson(
  key: string,
): unknown {
  try {
    const raw =
      localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// =====================================================
// JSON WRITE
// =====================================================

function writeJson(
  key: string,
  value: unknown,
): void {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch {
    // Ignore localStorage errors.
  }
}

// =====================================================
// AUTH TOKEN
// =====================================================

function getToken():
  | string
  | null {
  try {
    return (
      localStorage.getItem(
        "token",
      ) ??
      localStorage.getItem(
        "authToken",
      ) ??
      localStorage.getItem(
        "accessToken",
      )
    );
  } catch {
    return null;
  }
}

// =====================================================
// USER ID
// =====================================================

function getUserId():
  | string
  | undefined {
  const keys = [
    "userId",
    "user_id",
    "loggedInUser",
    "currentUser",
  ];

  for (const key of keys) {
    try {
      const raw =
        localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      try {
        const parsed: unknown =
          JSON.parse(raw);

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          const record =
            parsed as Record<
              string,
              unknown
            >;

          const id =
            record.id ??
            record.userId ??
            record.user_id;

          if (
            typeof id === "string" &&
            id.trim()
          ) {
            return id.trim();
          }

          if (
            typeof id === "number"
          ) {
            return String(id);
          }
        }
      } catch {
        if (raw.trim()) {
          return raw.trim();
        }
      }
    } catch {
      // Continue searching.
    }
  }

  return undefined;
}

// =====================================================
// QUESTION NORMALIZER
// =====================================================

function normalizeQuestion(
  input: Question,
): TestQuestion {
  const item =
    input as unknown as Record<
      string,
      unknown
    >;

  return {
    id: String(
      item.id ??
        item.questionId ??
        "",
    ),

    technologyId:
      item.technologyId != null
        ? String(
            item.technologyId,
          )
        : undefined,

    chapterId:
      item.chapterId != null
        ? String(
            item.chapterId,
          )
        : undefined,

    questionType:
      typeof item.questionType ===
      "string"
        ? item.questionType
        : "mcq",

    questionText:
      String(
        item.questionText ??
          item.question ??
          item.text ??
          "",
      ),

    optionA:
      item.optionA != null
        ? String(item.optionA)
        : undefined,

    optionB:
      item.optionB != null
        ? String(item.optionB)
        : undefined,

    optionC:
      item.optionC != null
        ? String(item.optionC)
        : undefined,

    optionD:
      item.optionD != null
        ? String(item.optionD)
        : undefined,

    correctAnswer:
      String(
        item.correctAnswer ??
          item.answer ??
          "",
      ),

    explanation:
      item.explanation != null
        ? String(
            item.explanation,
          )
        : undefined,

    marks:
      Number(item.marks) || 1,

    displayOrder:
      Number(
        item.displayOrder ??
          item.questionNumber ??
          0,
      ),

    isActive:
      item.isActive !== false,
  };
}

// =====================================================
// API REQUEST
// =====================================================

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    getToken();

  const response =
    await fetch(
      `${API_BASE}${path}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

          ...(options.headers ?? {}),
        },
      },
    );

  let payload: unknown =
    null;

  try {
    payload =
      await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      `Test API request failed: ${response.status}`,
    );
  }

  return payload as T;
}

// =====================================================
// GET TESTS BY TECHNOLOGY
// =====================================================

export async function getTestsByTechnology(
  technologyId: string,
): Promise<TestDefinition[]> {
  try {
    const response =
      await apiRequest<{
        success?: boolean;
        tests?: TestDefinition[];
      }>(
        `/content/tests/technology/${encodeURIComponent(
          technologyId,
        )}`,
      );

    if (
      Array.isArray(
        response.tests,
      )
    ) {
      return response.tests.map(
        (item) => ({
          id:
            String(item.id),

          technologyId:
            String(
              item.technologyId,
            ),

          title:
            String(item.title),

          testType:
            item.testType ??
            "chapter",

          startChapter:
            item.startChapter,

          endChapter:
            item.endChapter,

          passPercentage:
            Number(
              item.passPercentage,
            ) || 60,

          displayOrder:
            Number(
              item.displayOrder,
            ) || 0,

          isActive:
            item.isActive !== false,
        }),
      );
    }
  } catch {
    // Return empty list when API is unavailable.
  }

  return [];
}

// =====================================================
// GET SINGLE TEST
// =====================================================

export async function getTest(
  testId: string,
): Promise<TestDefinition | null> {
  try {
    const response =
      await apiRequest<{
        success?: boolean;
        test?: TestDefinition;
      }>(
        `/content/tests/${encodeURIComponent(
          testId,
        )}`,
      );

    return (
      response.test ??
      null
    );
  } catch {
    return null;
  }
}

// =====================================================
// GET CHAPTER TEST QUESTIONS
// =====================================================

export async function getChapterTestQuestions(
  chapterId: string,
): Promise<TestQuestion[]> {
  const questions =
    await getQuestionsByChapter(
      chapterId,
    );

  return questions
    .map(normalizeQuestion)
    .filter(
      (question) =>
        question.isActive !== false,
    )
    .sort(
      (a, b) =>
        (a.displayOrder ?? 0) -
        (b.displayOrder ?? 0),
    );
}

// =====================================================
// GET FINAL TEST QUESTIONS
// =====================================================

export async function getFinalTestQuestions(
  technologyId: string,
  startChapter = 0,
  endChapter = 0,
): Promise<TestQuestion[]> {
  // ---------------------------------------------------
  // FIRST: backend final-test endpoint
  // ---------------------------------------------------

  try {
    const response =
      await apiRequest<{
        success?: boolean;
        questions?: TestQuestion[];
      }>(
        `/content/tests/final/${encodeURIComponent(
          technologyId,
        )}/questions`,
      );

    if (
      Array.isArray(
        response.questions,
      )
    ) {
      return response.questions
        .map(
          (item) => ({
            ...item,

            id:
              String(
                item.id,
              ),

            technologyId:
              String(
                item.technologyId ??
                  technologyId,
              ),

            marks:
              Number(
                item.marks,
              ) || 1,
          }),
        )
        .filter(
          (item) =>
            item.isActive !== false,
        );
    }
  } catch {
    // Use fallback below.
  }

  // ---------------------------------------------------
  // SECOND: test definition
  // ---------------------------------------------------

  const tests =
    await getTestsByTechnology(
      technologyId,
    );

  const finalTest =
    tests.find(
      (item) =>
        item.testType ===
        "final",
    );

  const fromChapter =
    startChapter ||
    finalTest?.startChapter ||
    0;

  const toChapter =
    endChapter ||
    finalTest?.endChapter ||
    0;

  // ---------------------------------------------------
  // THIRD: chapter range fallback
  // ---------------------------------------------------

  if (
    fromChapter > 0 &&
    toChapter >= fromChapter
  ) {
    const collected: TestQuestion[] =
      [];

    for (
      let chapter =
        fromChapter;
      chapter <=
        toChapter;
      chapter += 1
    ) {
      try {
        const chapterQuestions =
          await getQuestionsByChapter(
            String(chapter),
          );

        collected.push(
          ...chapterQuestions.map(
            normalizeQuestion,
          ),
        );
      } catch {
        // Continue with the next chapter.
      }
    }

    return collected.sort(
      (a, b) =>
        (a.displayOrder ?? 0) -
        (b.displayOrder ?? 0),
    );
  }

  return [];
}

// =====================================================
// GET ALL STORED TEST RESULTS
// =====================================================

export function getTestResults():
  TestAttemptResult[] {
  const parsed =
    readJson(
      TEST_RESULT_STORAGE_KEY,
    );

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(
    (
      item,
    ): item is TestAttemptResult =>
      Boolean(
        item &&
          typeof item ===
            "object",
      ),
  );
}

// =====================================================
// WRITE TEST RESULTS
// =====================================================

function writeTestResults(
  results: TestAttemptResult[],
): void {
  writeJson(
    TEST_RESULT_STORAGE_KEY,
    results.slice(-200),
  );
}

// =====================================================
// SAVE TEST RESULT
// =====================================================

export async function saveTestResult(
  result: TestAttemptResult,
): Promise<TestAttemptResult> {
  const normalized: TestAttemptResult =
    {
      ...result,

      id:
        result.id ||
        createId(),

      userId:
        result.userId ??
        getUserId(),

      technologyId:
        String(
          result.technologyId,
        ),

      chapterId:
        result.chapterId != null
          ? String(
              result.chapterId,
            )
          : undefined,

      testId:
        result.testId != null
          ? String(
              result.testId,
            )
          : undefined,

      totalQuestions:
        Number(
          result.totalQuestions,
        ) || 0,

      answeredQuestions:
        Number(
          result.answeredQuestions,
        ) || 0,

      totalMarks:
        Number(
          result.totalMarks,
        ) || 0,

      earnedMarks:
        Number(
          result.earnedMarks,
        ) || 0,

      score:
        Number(
          result.score,
        ) || 0,

      percentage:
        Number(
          result.percentage,
        ) || 0,

      passed:
        Boolean(
          result.passed,
        ),

      completedAt:
        result.completedAt ||
        new Date().toISOString(),

      questions:
        Array.isArray(
          result.questions,
        )
          ? result.questions
          : [],
    };

  // ---------------------------------------------------
  // LOCAL SAVE FIRST
  // ---------------------------------------------------

  const current =
    getTestResults();

  current.push(
    normalized,
  );

  writeTestResults(
    current,
  );

  // ---------------------------------------------------
  // BACKEND SAVE
  // ---------------------------------------------------

  try {
    await apiRequest(
      "/content/progress/test",
      {
        method: "POST",

        body:
          JSON.stringify({
            ...normalized,

            progressType:
              "test",

            completed:
              true,

            passed:
              normalized.passed,

            score:
              normalized.percentage,
          }),
      },
    );
  } catch {
    // Local result is already saved.
  }

  // ---------------------------------------------------
  // PERMANENT UNLOCK WHEN PASSED
  // ---------------------------------------------------

  if (
    normalized.passed
  ) {
    permanentUnlockTest(
      normalized,
    );
  }

  return normalized;
}

// =====================================================
// TEST UNLOCK STORAGE
// =====================================================

function readUnlocks():
  string[] {
  const parsed =
    readJson(
      TEST_UNLOCK_STORAGE_KEY,
    );

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.map(String);
}

// =====================================================
// WRITE UNLOCKS
// =====================================================

function writeUnlocks(
  unlocks: string[],
): void {
  writeJson(
    TEST_UNLOCK_STORAGE_KEY,
    Array.from(
      new Set(unlocks),
    ),
  );
}

// =====================================================
// CREATE UNLOCK KEY
// =====================================================

function makeUnlockKey(
  result: TestAttemptResult,
): string {
  if (
    result.testType ===
      "chapter" &&
    result.chapterId
  ) {
    return [
      "chapter",
      String(
        result.technologyId,
      ),
      String(
        result.chapterId,
      ),
    ].join(":");
  }

  return [
    "final",
    String(
      result.technologyId,
    ),
  ].join(":");
}

// =====================================================
// PERMANENT UNLOCK
// =====================================================

export function permanentUnlockTest(
  result: TestAttemptResult,
): void {
  const unlocks =
    readUnlocks();

  const key =
    makeUnlockKey(result);

  if (
    !unlocks.includes(key)
  ) {
    unlocks.push(key);

    writeUnlocks(
      unlocks,
    );
  }
}

// =====================================================
// CHECK TEST UNLOCKED
// =====================================================

export function isTestUnlocked(
  technologyId: string,
  chapterId?: string,
): boolean {
  const unlocks =
    readUnlocks();

  const key =
    chapterId
      ? [
          "chapter",
          String(
            technologyId,
          ),
          String(
            chapterId,
          ),
        ].join(":")
      : [
          "final",
          String(
            technologyId,
          ),
        ].join(":");

  return unlocks.includes(
    key,
  );
}

// =====================================================
// CHECK PASSED TEST
// =====================================================

export function hasPassedTest(
  technologyId: string,
  chapterId?: string,
): boolean {
  return getTestResults().some(
    (item) => {
      const technologyMatch =
        String(
          item.technologyId,
        ) ===
        String(
          technologyId,
        );

      const chapterMatch =
        chapterId == null
          ? item.chapterId ==
            null
          : String(
              item.chapterId,
            ) ===
            String(
              chapterId,
            );

      return (
        technologyMatch &&
        chapterMatch &&
        item.passed ===
          true
      );
    },
  );
}

// =====================================================
// COMPATIBILITY NAME
// Existing files may use hasTestPassed.
// =====================================================

export function hasTestPassed(
  technologyId: string,
  chapterId?: string,
): boolean {
  return hasPassedTest(
    technologyId,
    chapterId,
  );
}

// =====================================================
// CHECK FINAL TEST PASSED
// =====================================================

export function hasPassedFinalTest(
  technologyId: string,
): boolean {
  return hasPassedTest(
    technologyId,
  );
}

// =====================================================
// GET LATEST TEST RESULT
// =====================================================

export function getLatestTestResult(
  technologyId: string,
  chapterId?: string,
): TestAttemptResult | null {
  const results =
    getTestResults()
      .filter(
        (item) =>
          String(
            item.technologyId,
          ) ===
          String(
            technologyId,
          ),
      )
      .filter(
        (item) =>
          chapterId == null
            ? item.chapterId ==
              null
            : String(
                item.chapterId,
              ) ===
              String(
                chapterId,
              ),
      )
      .sort(
        (a, b) =>
          new Date(
            b.completedAt,
          ).getTime() -
          new Date(
            a.completedAt,
          ).getTime(),
      );

  return (
    results[0] ??
    null
  );
}

// =====================================================
// GET RESULT BY ID
// Compatibility for existing TestResult.tsx
// =====================================================

export function getTestResult(
  resultId: string | number,
): TestAttemptResult | null {
  return (
    getTestResults().find(
      (item) =>
        String(
          item.id,
        ) ===
        String(
          resultId,
        ),
    ) ??
    null
  );
}

// =====================================================
// GET CHAPTER TEST RESULTS
// =====================================================

export function getChapterTestResults(
  technologyId: string,
  chapterId: string,
): TestAttemptResult[] {
  return getTestResults()
    .filter(
      (item) =>
        String(
          item.technologyId,
        ) ===
          String(
            technologyId,
          ) &&
        String(
          item.chapterId,
        ) ===
          String(
            chapterId,
          ),
    )
    .sort(
      (a, b) =>
        new Date(
          b.completedAt,
        ).getTime() -
        new Date(
          a.completedAt,
        ).getTime(),
    );
}

// =====================================================
// GET FINAL TEST RESULTS
// =====================================================

export function getFinalTestResults(
  technologyId: string,
): TestAttemptResult[] {
  return getTestResults()
    .filter(
      (item) =>
        String(
          item.technologyId,
        ) ===
        String(
          technologyId,
        ) &&
        item.testType ===
          "final",
    )
    .sort(
      (a, b) =>
        new Date(
          b.completedAt,
        ).getTime() -
        new Date(
          a.completedAt,
        ).getTime(),
    );
}

// =====================================================
// CLEAR TEST RESULTS
// =====================================================

export function clearTestResults():
  void {
  try {
    localStorage.removeItem(
      TEST_RESULT_STORAGE_KEY,
    );

    localStorage.removeItem(
      TEST_UNLOCK_STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}
