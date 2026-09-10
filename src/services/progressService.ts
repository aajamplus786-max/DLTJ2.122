// =====================================================
// DLTJ2.10
// FRONTEND PROGRESS SERVICE
// FILE: src/services/progressService.ts
// UPDATED: 2026-09-06
// LOCATION: E:\DLTJ2.122\src\services\progressService.ts
// =====================================================

// =====================================================
// API
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// STORAGE
// =====================================================

const PROGRESS_STORAGE_KEY =
  "dltj210.user.progress";

const USER_ID_STORAGE_KEY =
  "dltj210.current.user.id";

// =====================================================
// TYPES
// =====================================================

export type ProgressType =
  | "lesson"
  | "chapter"
  | "practice"
  | "chapter_test"
  | "final_test";

export interface UserProgress {
  id: string;
  userId: string;
  technologyId: string;
  chapterId?: string | null;
  lessonId?: string | null;
  testId?: string | null;
  progressType: ProgressType;
  completed: boolean;
  score: number | null;
  passed: boolean | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveProgressInput {
  userId: string;
  technologyId?: string | null;
  chapterId?: string | null;
  lessonId?: string | null;
  testId?: string | null;
  progressType: ProgressType;
  completed?: boolean;
  score?: number | null;
  passed?: boolean | null;
}

// =====================================================
// RESPONSE TYPES
// =====================================================

interface ProgressListResponse {
  success: boolean;
  progress?: UserProgress[];
  message?: string;
}

interface ProgressSingleResponse {
  success: boolean;
  progress?: UserProgress;
  message?: string;
}

// =====================================================
// CURRENT USER
// =====================================================

export function setCurrentUserId(
  userId: string | null | undefined,
): void {
  const value =
    String(userId ?? "").trim();

  if (!value) {
    return;
  }

  localStorage.setItem(
    USER_ID_STORAGE_KEY,
    value,
  );

  // Existing compatibility keys.
  localStorage.setItem(
    "userId",
    value,
  );

  localStorage.setItem(
    "user_id",
    value,
  );
}

export function getCurrentUserId(): string {
  return (
    localStorage.getItem(
      USER_ID_STORAGE_KEY,
    ) ??
    localStorage.getItem(
      "userId",
    ) ??
    localStorage.getItem(
      "user_id",
    ) ??
    ""
  );
}

// =====================================================
// SAFE JSON
// =====================================================

function parseJSON<T>(
  value: string | null,
  fallback: T,
): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(
      value,
    ) as T;
  } catch {
    return fallback;
  }
}

// =====================================================
// LOCAL PROGRESS
// =====================================================

function readLocalProgress(): UserProgress[] {
  return parseJSON<UserProgress[]>(
    localStorage.getItem(
      PROGRESS_STORAGE_KEY,
    ),
    [],
  );
}

function writeLocalProgress(
  progress: UserProgress[],
): void {
  localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify(progress),
  );
}

// =====================================================
// LOCAL UPSERT
// =====================================================

function sameProgress(
  a: UserProgress,
  b: UserProgress,
): boolean {
  return (
    a.userId === b.userId &&
    a.technologyId ===
      b.technologyId &&
    a.chapterId ===
      b.chapterId &&
    a.lessonId ===
      b.lessonId &&
    a.testId ===
      b.testId &&
    a.progressType ===
      b.progressType
  );
}

function upsertLocalProgress(
  item: UserProgress,
): void {
  const existing =
    readLocalProgress();

  const index =
    existing.findIndex(
      (entry) =>
        sameProgress(
          entry,
          item,
        ),
    );

  if (index >= 0) {
    existing[index] = {
      ...existing[index],
      ...item,
    };
  } else {
    existing.push(item);
  }

  writeLocalProgress(
    existing,
  );
}

// =====================================================
// API REQUEST
// =====================================================

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response =
    await fetch(
      `${API_BASE}${path}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers ??
            {}),
        },
      },
    );

  const data =
    (await response
      .json()
      .catch(
        () => ({}),
      )) as T & {
      message?: string;
    };

  if (!response.ok) {
    throw new Error(
      data?.message ??
        `HTTP ${response.status}`,
    );
  }

  return data;
}

// =====================================================
// GET PROGRESS
// IMPORTANT:
// Existing useProgress.ts expects this export.
// =====================================================

export async function getProgress(
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress[]> {
  if (!userId) {
    return [];
  }

  try {
    const response =
      await request<ProgressListResponse>(
        `/content/progress/${encodeURIComponent(
          userId,
        )}`,
      );

    const progress =
      response.progress ??
      [];

    writeLocalProgress(
      progress,
    );

    return progress;
  } catch {
    return readLocalProgress().filter(
      (item) =>
        item.userId ===
        userId,
    );
  }
}

// =====================================================
// ALIAS
// =====================================================

export async function getUserProgress(
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress[]> {
  return getProgress(
    userId,
  );
}

// =====================================================
// SAVE PROGRESS
// =====================================================

export async function saveProgress(
  input: SaveProgressInput,
): Promise<UserProgress | null> {
  const now =
    new Date().toISOString();

  const localItem:
    UserProgress = {
    id:
      `local-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,

    userId:
      input.userId,

    technologyId:
      String(
        input.technologyId ??
          "",
      ),

    chapterId:
      input.chapterId ??
      null,

    lessonId:
      input.lessonId ??
      null,

    testId:
      input.testId ??
      null,

    progressType:
      input.progressType,

    completed:
      input.completed ??
      true,

    score:
      input.score ??
      null,

    passed:
      input.passed ??
      null,

    completedAt:
      input.completed !== false
        ? now
        : null,

    createdAt:
      now,

    updatedAt:
      now,
  };

  // ---------------------------------------------------
  // LOCAL FIRST
  // ---------------------------------------------------

  upsertLocalProgress(
    localItem,
  );

  // ---------------------------------------------------
  // BACKEND
  // ---------------------------------------------------

  try {
    const response =
      await request<ProgressSingleResponse>(
        "/content/progress",
        {
          method:
            "POST",

          body:
            JSON.stringify({
              ...input,

              technologyId:
                String(
                  input.technologyId ??
                    "",
                ),
            }),
        },
      );

    if (
      response.success &&
      response.progress
    ) {
      upsertLocalProgress(
        response.progress,
      );

      return response.progress;
    }
  } catch {
    // Local fallback is kept.
  }

  return localItem;
}

// =====================================================
// MARK LESSON COMPLETED
// IMPORTANT:
// Supports old 2-argument usage and
// new 3-argument usage.
// =====================================================

export async function markLessonCompleted(
  technologyIdOrChapterId:
    string | undefined,

  chapterIdOrLessonId:
    string | undefined,

  lessonId?:
    string,

  userId:
    string = getCurrentUserId(),
): Promise<UserProgress | null> {
  // ---------------------------------------------------
  // OLD:
  // markLessonCompleted(chapterId, lessonId)
  // ---------------------------------------------------

  if (
    lessonId === undefined
  ) {
    const chapterId =
      technologyIdOrChapterId ??
      "";

    const actualLessonId =
      chapterIdOrLessonId ??
      "";

    if (
      !userId ||
      !chapterId ||
      !actualLessonId
    ) {
      return null;
    }

    return saveProgress({
      userId,

      // Legacy record does not have technology info.
      technologyId:
        "",

      chapterId,

      lessonId:
        actualLessonId,

      progressType:
        "lesson",

      completed:
        true,
    });
  }

  // ---------------------------------------------------
  // NEW:
  // markLessonCompleted(
  //   technologyId,
  //   chapterId,
  //   lessonId
  // )
  // ---------------------------------------------------

  if (
    !userId ||
    !technologyIdOrChapterId ||
    !chapterIdOrLessonId ||
    !lessonId
  ) {
    return null;
  }

  return saveProgress({
    userId,

    technologyId:
      technologyIdOrChapterId,

    chapterId:
      chapterIdOrLessonId,

    lessonId,

    progressType:
      "lesson",

    completed:
      true,
  });
}

// =====================================================
// MARK CHAPTER COMPLETED
// IMPORTANT:
// Supports old 1-argument usage and
// new 2-argument usage.
// =====================================================

export async function markChapterCompleted(
  technologyIdOrChapterId:
    string | undefined,

  chapterId?:
    string,

  userId:
    string = getCurrentUserId(),
): Promise<UserProgress | null> {
  // ---------------------------------------------------
  // OLD:
  // markChapterCompleted(chapterId)
  // ---------------------------------------------------

  if (
    chapterId === undefined
  ) {
    const actualChapterId =
      technologyIdOrChapterId ??
      "";

    if (
      !userId ||
      !actualChapterId
    ) {
      return null;
    }

    return saveProgress({
      userId,

      technologyId:
        "",

      chapterId:
        actualChapterId,

      progressType:
        "chapter",

      completed:
        true,
    });
  }

  // ---------------------------------------------------
  // NEW:
  // markChapterCompleted(
  //   technologyId,
  //   chapterId
  // )
  // ---------------------------------------------------

  if (
    !userId ||
    !technologyIdOrChapterId
  ) {
    return null;
  }

  return saveProgress({
    userId,

    technologyId:
      technologyIdOrChapterId,

    chapterId,

    progressType:
      "chapter",

    completed:
      true,
  });
}

// =====================================================
// COMPLETE LESSON
// =====================================================

export async function completeLesson(
  technologyId: string,
  chapterId: string,
  lessonId: string,
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress | null> {
  return markLessonCompleted(
    technologyId,
    chapterId,
    lessonId,
    userId,
  );
}

// =====================================================
// COMPLETE CHAPTER
// =====================================================

export async function completeChapter(
  technologyId: string,
  chapterId: string,
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress | null> {
  return markChapterCompleted(
    technologyId,
    chapterId,
    userId,
  );
}

// =====================================================
// PRACTICE RESULT
// =====================================================

export async function savePracticeProgress(
  technologyId: string,
  chapterId: string,
  score: number,
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress | null> {
  if (
    !userId
  ) {
    return null;
  }

  return saveProgress({
    userId,
    technologyId,
    chapterId,
    progressType:
      "practice",
    completed:
      true,
    score,
  });
}

// =====================================================
// CHAPTER TEST RESULT
// =====================================================

export async function saveChapterTestProgress(
  technologyId: string,
  chapterId: string,
  score: number,
  passed: boolean,
  testId:
    string | null = null,
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress | null> {
  if (
    !userId
  ) {
    return null;
  }

  return saveProgress({
    userId,
    technologyId,
    chapterId,
    testId,
    progressType:
      "chapter_test",
    completed:
      true,
    score,
    passed,
  });
}

// =====================================================
// FINAL TEST RESULT
// =====================================================

export async function saveFinalTestProgress(
  technologyId: string,
  score: number,
  passed: boolean,
  testId:
    string | null = null,
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress | null> {
  if (
    !userId
  ) {
    return null;
  }

  return saveProgress({
    userId,
    technologyId,
    testId,
    progressType:
      "final_test",
    completed:
      true,
    score,
    passed,
  });
}

// =====================================================
// LOCAL PROGRESS
// =====================================================

export function getLocalProgress(
  userId:
    string = getCurrentUserId(),
): UserProgress[] {
  return readLocalProgress().filter(
    (item) =>
      !userId ||
      item.userId ===
        userId,
  );
}

// =====================================================
// CHAPTER PROGRESS
// =====================================================

export function getChapterProgress(
  technologyId:
    string | undefined,
  chapterId:
    string | undefined,
  userId:
    string = getCurrentUserId(),
): UserProgress[] {
  if (
    !technologyId ||
    !chapterId
  ) {
    return [];
  }

  return getLocalProgress(
    userId,
  ).filter(
    (item) =>
      item.technologyId ===
        technologyId &&
      item.chapterId ===
        chapterId,
  );
}

// =====================================================
// LESSON COMPLETION
//
// Supported:
// isLessonCompleted(chapterId, lessonId)
// isLessonCompleted(
//   technologyId,
//   chapterId,
//   lessonId
// )
// =====================================================

export function isLessonCompleted(
  firstId:
    string | undefined,

  secondId:
    string | undefined,

  thirdId?:
    string,

  userId:
    string = getCurrentUserId(),
): boolean {
  if (
    !firstId ||
    !secondId
  ) {
    return false;
  }

  // ---------------------------------------------------
  // OLD 2-ARGUMENT FORM
  // ---------------------------------------------------

  if (
    thirdId === undefined
  ) {
    const chapterId =
      firstId;

    const lessonId =
      secondId;

    return getLocalProgress(
      userId,
    ).some(
      (item) =>
        item.chapterId ===
          chapterId &&
        item.lessonId ===
          lessonId &&
        item.progressType ===
          "lesson" &&
        item.completed,
    );
  }

  // ---------------------------------------------------
  // NEW 3-ARGUMENT FORM
  // ---------------------------------------------------

  const technologyId =
    firstId;

  const chapterId =
    secondId;

  const lessonId =
    thirdId;

  return getLocalProgress(
    userId,
  ).some(
    (item) =>
      item.technologyId ===
        technologyId &&
      item.chapterId ===
        chapterId &&
      item.lessonId ===
        lessonId &&
      item.progressType ===
        "lesson" &&
      item.completed,
  );
}

// =====================================================
// CHAPTER COMPLETION
//
// Supported:
// isChapterCompleted(chapterId)
// isChapterCompleted(
//   technologyId,
//   chapterId
// )
// =====================================================

export function isChapterCompleted(
  firstId?:
    string,

  secondId?:
    string,

  userId:
    string = getCurrentUserId(),
): boolean {
  if (
    !firstId
  ) {
    return false;
  }

  // ---------------------------------------------------
  // OLD 1-ARGUMENT FORM
  // ---------------------------------------------------

  if (
    secondId === undefined
  ) {
    const chapterId =
      firstId;

    return getLocalProgress(
      userId,
    ).some(
      (item) =>
        item.chapterId ===
          chapterId &&
        item.progressType ===
          "chapter" &&
        item.completed,
    );
  }

  // ---------------------------------------------------
  // NEW 2-ARGUMENT FORM
  // ---------------------------------------------------

  const technologyId =
    firstId;

  const chapterId =
    secondId;

  return getLocalProgress(
    userId,
  ).some(
    (item) =>
      item.technologyId ===
        technologyId &&
      item.chapterId ===
        chapterId &&
      item.progressType ===
        "chapter" &&
      item.completed,
  );
}

// =====================================================
// CHAPTER TEST PASSED
// =====================================================

export function hasPassedChapterTest(
  technologyId:
    string | undefined,
  chapterId:
    string | undefined,
  userId:
    string = getCurrentUserId(),
): boolean {
  if (
    !technologyId ||
    !chapterId
  ) {
    return false;
  }

  return getLocalProgress(
    userId,
  ).some(
    (item) =>
      item.technologyId ===
        technologyId &&
      item.chapterId ===
        chapterId &&
      item.progressType ===
        "chapter_test" &&
      item.passed ===
        true,
  );
}

// =====================================================
// FINAL TEST PASSED
// =====================================================

export function hasPassedFinalTest(
  technologyId:
    string | undefined,
  userId:
    string = getCurrentUserId(),
): boolean {
  if (
    !technologyId
  ) {
    return false;
  }

  return getLocalProgress(
    userId,
  ).some(
    (item) =>
      item.technologyId ===
        technologyId &&
      item.progressType ===
        "final_test" &&
      item.passed ===
        true,
  );
}

// =====================================================
// GENERIC TEST CHECK
// =====================================================

export function hasPassedTest(
  technologyId:
    string | undefined,
  chapterId?:
    string,
  userId:
    string = getCurrentUserId(),
): boolean {
  if (
    !technologyId
  ) {
    return false;
  }

  if (
    chapterId
  ) {
    return hasPassedChapterTest(
      technologyId,
      chapterId,
      userId,
    );
  }

  return hasPassedFinalTest(
    technologyId,
    userId,
  );
}

// =====================================================
// COMPATIBILITY
// =====================================================

export function hasTestPassed(
  technologyId:
    string | undefined,
  chapterId?:
    string,
  userId:
    string = getCurrentUserId(),
): boolean {
  return hasPassedTest(
    technologyId,
    chapterId,
    userId,
  );
}

// =====================================================
// RESTORE PROGRESS
// =====================================================

export async function restoreProgress(
  userId:
    string = getCurrentUserId(),
): Promise<UserProgress[]> {
  return getProgress(
    userId,
  );
}

// =====================================================
// LOCK STATE
// =====================================================

export function isChapterUnlocked(
  technologyId:
    string | undefined,
  chapterId:
    string | undefined,
  previousChapterId?:
    string,
  userId:
    string = getCurrentUserId(),
): boolean {
  if (
    !technologyId ||
    !chapterId
  ) {
    return false;
  }

  if (
    !previousChapterId
  ) {
    return true;
  }

  return (
    isChapterCompleted(
      technologyId,
      previousChapterId,
      userId,
    ) ||
    hasPassedChapterTest(
      technologyId,
      previousChapterId,
      userId,
    )
  );
}

// =====================================================
// CLEAR LOCAL PROGRESS
// =====================================================

export function clearLocalProgress(): void {
  localStorage.removeItem(
    PROGRESS_STORAGE_KEY,
  );
}