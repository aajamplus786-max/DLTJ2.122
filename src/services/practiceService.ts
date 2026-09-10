
// =====================================================
// DLTJ2.10
// PRACTICE SERVICE
// FILE: src/services/practiceService.ts
// CREATED: 2026-09-06
// LOCATION: src/services/practiceService.ts
// =====================================================

export interface PracticeQuestionResult {
  questionId: string;
  correct: boolean;
  marks: number;
}

export interface PracticeResult {
  technologyId: string;
  chapterId: string;
  totalQuestions: number;
  answeredQuestions: number;
  totalMarks: number;
  score: number;
  percentage: number;
  results: PracticeQuestionResult[];
  completedAt: string;
}

const STORAGE_KEY =
  "dltj210.practice.results";

// =====================================================
// READ LOCAL RESULTS
// =====================================================

function readResults(): PracticeResult[] {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (
        item: unknown,
      ): item is PracticeResult => {
        if (
          !item ||
          typeof item !== "object"
        ) {
          return false;
        }

        const record =
          item as Record<string, unknown>;

        return (
          typeof record.technologyId ===
            "string" ||
          typeof record.technologyId ===
            "number"
        );
      },
    );
  } catch {
    return [];
  }
}

// =====================================================
// WRITE LOCAL RESULTS
// =====================================================

function writeResults(
  results: PracticeResult[],
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(results),
    );
  } catch {
    // LocalStorage may be unavailable
    // in restricted browser contexts.
  }
}

// =====================================================
// API BASE
// =====================================================

function getApiBase(): string {
  const configured =
    import.meta.env.VITE_API_URL;

  if (
    typeof configured === "string" &&
    configured.trim().length > 0
  ) {
    return configured
      .trim()
      .replace(/\/+$/, "");
  }

  return "http://localhost:3000/api";
}

// =====================================================
// AUTH TOKEN
// =====================================================

function getAuthToken():
  | string
  | null {
  try {
    return (
      localStorage.getItem("token") ??
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
// NORMALIZE PRACTICE RESULT
// =====================================================

function normalizePracticeResult(
  result: PracticeResult,
): PracticeResult {
  return {
    technologyId: String(
      result.technologyId,
    ),

    chapterId: String(
      result.chapterId,
    ),

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

    score:
      Number(
        result.score,
      ) || 0,

    percentage:
      Number(
        result.percentage,
      ) || 0,

    results:
      Array.isArray(
        result.results,
      )
        ? result.results.map(
            (
              item,
            ): PracticeQuestionResult => ({
              questionId:
                String(
                  item.questionId,
                ),

              correct:
                Boolean(
                  item.correct,
                ),

              marks:
                Number(
                  item.marks,
                ) || 0,
            }),
          )
        : [],

    completedAt:
      result.completedAt ||
      new Date().toISOString(),
  };
}

// =====================================================
// SAVE PRACTICE RESULT
// =====================================================

export async function savePracticeResult(
  result: PracticeResult,
): Promise<PracticeResult> {
  const normalized =
    normalizePracticeResult(
      result,
    );

  // ===================================================
  // LOCAL SAVE
  // ===================================================

  const current =
    readResults();

  current.push(
    normalized,
  );

  // Keep latest 100 practice attempts.
  writeResults(
    current.slice(-100),
  );

  // ===================================================
  // BACKEND SAVE
  //
  // Backend failure must NOT remove local result.
  // ===================================================

  const apiBase =
    getApiBase();

  const token =
    getAuthToken();

  try {
    const response =
      await fetch(
        `${apiBase}/content/progress/practice`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },

          body:
            JSON.stringify(
              normalized,
            ),
        },
      );

    // API failure does not invalidate
    // the local practice result.
    if (!response.ok) {
      return normalized;
    }

    return normalized;
  } catch {
    return normalized;
  }
}

// =====================================================
// GET ALL PRACTICE RESULTS
// =====================================================

export function getPracticeResults():
  PracticeResult[] {
  return readResults();
}

// =====================================================
// GET PRACTICE RESULTS BY CHAPTER
// =====================================================

export function getChapterPracticeResults(
  technologyId: string,
  chapterId: string,
): PracticeResult[] {
  return readResults().filter(
    (
      item,
    ) =>
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
  );
}

// =====================================================
// GET LATEST PRACTICE RESULT
// =====================================================

export function getLatestPracticeResult(
  technologyId: string,
  chapterId: string,
): PracticeResult | null {
  const results =
    getChapterPracticeResults(
      technologyId,
      chapterId,
    );

  if (results.length === 0) {
    return null;
  }

  return results[
    results.length - 1
  ];
}

// =====================================================
// GET LATEST RESULT FOR TECHNOLOGY
// =====================================================

export function getLatestTechnologyPracticeResult(
  technologyId: string,
): PracticeResult | null {
  const results =
    readResults().filter(
      (
        item,
      ) =>
        String(
          item.technologyId,
        ) ===
        String(
          technologyId,
        ),
    );

  if (results.length === 0) {
    return null;
  }

  return results[
    results.length - 1
  ];
}

// =====================================================
// GET RESULT BY CHAPTER
// =====================================================

export function hasPracticeResult(
  technologyId: string,
  chapterId: string,
): boolean {
  return (
    getChapterPracticeResults(
      technologyId,
      chapterId,
    ).length > 0
  );
}

// =====================================================
// CLEAR ALL PRACTICE RESULTS
// =====================================================

export function clearPracticeResults():
  void {
  try {
    localStorage.removeItem(
      STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}
