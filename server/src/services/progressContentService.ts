// =====================================================
// DLTJ2.10
// PROGRESS CONTENT SERVICE
// FILE: server/src/services/progressContentService.ts
// UPDATED: 2026-09-06
// LOCATION: E:\DLTJ2.122\server\src\services\progressContentService.ts
// =====================================================

import { databasePool } from "../config/database";

// =====================================================
// TYPES
// =====================================================

export type ProgressType =
  | "lesson"
  | "chapter"
  | "practice"
  | "chapter_test"
  | "final_test";

export interface UserProgressRecord {
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

// =====================================================
// MYSQL DATETIME HELPER
// =====================================================

function toMySQLDateTime(
  date: Date = new Date(),
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  const hours =
    String(
      date.getHours(),
    ).padStart(2, "0");

  const minutes =
    String(
      date.getMinutes(),
    ).padStart(2, "0");

  const seconds =
    String(
      date.getSeconds(),
    ).padStart(2, "0");

  return (
    `${year}-${month}-${day} ` +
    `${hours}:${minutes}:${seconds}`
  );
}

// =====================================================
// UUID HELPER
// =====================================================

function createId(): string {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}

// =====================================================
// ENSURE USER PROGRESS TABLE
// =====================================================

let databaseReady:
  Promise<void> | null = null;

async function ensureDatabase(): Promise<void> {
  if (databaseReady) {
    return databaseReady;
  }

  databaseReady =
    (async () => {
      await databasePool.query(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id VARCHAR(100) PRIMARY KEY,
          user_id VARCHAR(100) NOT NULL,
          technology_id VARCHAR(100) NOT NULL,
          chapter_id VARCHAR(100) NULL,
          lesson_id VARCHAR(100) NULL,
          test_id VARCHAR(100) NULL,
          progress_type VARCHAR(50) NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          score DECIMAL(10,2) NULL,
          passed BOOLEAN NULL,
          completed_at DATETIME NULL,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          INDEX idx_user_progress_user (
            user_id
          ),
          INDEX idx_user_progress_technology (
            technology_id
          ),
          INDEX idx_user_progress_chapter (
            chapter_id
          ),
          INDEX idx_user_progress_lesson (
            lesson_id
          ),
          INDEX idx_user_progress_test (
            test_id
          )
        )
      `);

      // =================================================
      // NORMALIZE EXISTING DATETIME COLUMNS
      // =================================================

      try {
        await databasePool.query(`
          ALTER TABLE user_progress
          MODIFY COLUMN created_at DATETIME NOT NULL
        `);
      } catch {
        // Existing compatible schema.
      }

      try {
        await databasePool.query(`
          ALTER TABLE user_progress
          MODIFY COLUMN updated_at DATETIME NOT NULL
        `);
      } catch {
        // Existing compatible schema.
      }

      try {
        await databasePool.query(`
          ALTER TABLE user_progress
          MODIFY COLUMN completed_at DATETIME NULL
        `);
      } catch {
        // Existing compatible schema.
      }
    })().catch(
      (error) => {
        databaseReady = null;
        throw error;
      },
    );

  return databaseReady;
}

// =====================================================
// MAP DATABASE ROW
// =====================================================

function mapProgressRow(
  row: Record<string, unknown>,
): UserProgressRecord {
  return {
    id: String(row.id),

    userId:
      String(row.user_id),

    technologyId:
      String(row.technology_id),

    chapterId:
      row.chapter_id === null ||
      row.chapter_id === undefined
        ? null
        : String(row.chapter_id),

    lessonId:
      row.lesson_id === null ||
      row.lesson_id === undefined
        ? null
        : String(row.lesson_id),

    testId:
      row.test_id === null ||
      row.test_id === undefined
        ? null
        : String(row.test_id),

    progressType:
      String(
        row.progress_type,
      ) as ProgressType,

    completed:
      Boolean(row.completed),

    score:
      row.score === null ||
      row.score === undefined
        ? null
        : Number(row.score),

    passed:
      row.passed === null ||
      row.passed === undefined
        ? null
        : Boolean(row.passed),

    completedAt:
      row.completed_at === null ||
      row.completed_at === undefined
        ? null
        : String(row.completed_at),

    createdAt:
      String(row.created_at),

    updatedAt:
      String(row.updated_at),
  };
}

// =====================================================
// GET ALL USER PROGRESS
// =====================================================

export async function getUserProgress(
  userId: string,
): Promise<UserProgressRecord[]> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          id,
          user_id,
          technology_id,
          chapter_id,
          lesson_id,
          test_id,
          progress_type,
          completed,
          score,
          passed,
          completed_at,
          created_at,
          updated_at
        FROM user_progress
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `,
      [
        userId,
      ],
    );

  return (
    rows as Array<
      Record<string, unknown>
    >
  ).map(mapProgressRow);
}

// =====================================================
// FIND EXISTING PROGRESS
// =====================================================

async function findExistingProgress(
  userId: string,
  technologyId: string,
  progressType: ProgressType,
  chapterId?: string,
  lessonId?: string,
  testId?: string,
): Promise<UserProgressRecord | null> {
  await ensureDatabase();

  let sql = `
    SELECT
      id,
      user_id,
      technology_id,
      chapter_id,
      lesson_id,
      test_id,
      progress_type,
      completed,
      score,
      passed,
      completed_at,
      created_at,
      updated_at
    FROM user_progress
    WHERE
      user_id = ?
      AND technology_id = ?
      AND progress_type = ?
  `;

  const params: unknown[] = [
    userId,
    technologyId,
    progressType,
  ];

  if (chapterId !== undefined) {
    sql += `
      AND chapter_id = ?
    `;

    params.push(chapterId);
  }

  if (lessonId !== undefined) {
    sql += `
      AND lesson_id = ?
    `;

    params.push(lessonId);
  }

  if (testId !== undefined) {
    sql += `
      AND test_id = ?
    `;

    params.push(testId);
  }

  sql += `
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  const [
    rows,
  ] =
    await databasePool.query(
      sql,
      params,
    );

  const row =
    (
      rows as Array<
        Record<string, unknown>
      >
    )[0];

  return row
    ? mapProgressRow(row)
    : null;
}

// =====================================================
// SAVE / UPSERT PROGRESS
// =====================================================

export async function saveProgress(
  input: {
    userId: string;
    technologyId: string;
    chapterId?: string | null;
    lessonId?: string | null;
    testId?: string | null;
    progressType: ProgressType;
    completed?: boolean;
    score?: number | null;
    passed?: boolean | null;
  },
): Promise<UserProgressRecord> {
  await ensureDatabase();

  const now =
    toMySQLDateTime();

  const existing =
    await findExistingProgress(
      input.userId,
      input.technologyId,
      input.progressType,
      input.chapterId ?? undefined,
      input.lessonId ?? undefined,
      input.testId ?? undefined,
    );

  const completed =
    input.completed ?? true;

  const score =
    input.score ?? null;

  const passed =
    input.passed ?? null;

  const completedAt =
    completed
      ? now
      : null;

  if (existing) {
    await databasePool.query(
      `
        UPDATE user_progress
        SET
          completed = ?,
          score = ?,
          passed = ?,
          completed_at = ?,
          updated_at = ?
        WHERE id = ?
      `,
      [
        completed,
        score,
        passed,
        completedAt,
        now,
        existing.id,
      ],
    );

    const [
      rows,
    ] =
      await databasePool.query(
        `
          SELECT
            id,
            user_id,
            technology_id,
            chapter_id,
            lesson_id,
            test_id,
            progress_type,
            completed,
            score,
            passed,
            completed_at,
            created_at,
            updated_at
          FROM user_progress
          WHERE id = ?
          LIMIT 1
        `,
        [
          existing.id,
        ],
      );

    return mapProgressRow(
      (
        rows as Array<
          Record<string, unknown>
        >
      )[0],
    );
  }

  const id =
    createId();

  await databasePool.query(
    `
      INSERT INTO user_progress (
        id,
        user_id,
        technology_id,
        chapter_id,
        lesson_id,
        test_id,
        progress_type,
        completed,
        score,
        passed,
        completed_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      input.userId,
      input.technologyId,
      input.chapterId ?? null,
      input.lessonId ?? null,
      input.testId ?? null,
      input.progressType,
      completed,
      score,
      passed,
      completedAt,
      now,
      now,
    ],
  );

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          id,
          user_id,
          technology_id,
          chapter_id,
          lesson_id,
          test_id,
          progress_type,
          completed,
          score,
          passed,
          completed_at,
          created_at,
          updated_at
        FROM user_progress
        WHERE id = ?
        LIMIT 1
      `,
      [
        id,
      ],
    );

  return mapProgressRow(
    (
      rows as Array<
        Record<string, unknown>
      >
    )[0],
  );
}

// =====================================================
// COMPLETE LESSON
// =====================================================

export async function completeLesson(
  userId: string,
  technologyId: string,
  chapterId: string,
  lessonId: string,
): Promise<UserProgressRecord> {
  return saveProgress({
    userId,
    technologyId,
    chapterId,
    lessonId,
    progressType: "lesson",
    completed: true,
  });
}

// =====================================================
// COMPLETE CHAPTER
// =====================================================

export async function completeChapter(
  userId: string,
  technologyId: string,
  chapterId: string,
): Promise<UserProgressRecord> {
  return saveProgress({
    userId,
    technologyId,
    chapterId,
    progressType: "chapter",
    completed: true,
  });
}

// =====================================================
// SAVE PRACTICE RESULT
// =====================================================

export async function savePracticeProgress(
  userId: string,
  technologyId: string,
  chapterId: string,
  score: number,
): Promise<UserProgressRecord> {
  return saveProgress({
    userId,
    technologyId,
    chapterId,
    progressType: "practice",
    completed: true,
    score,
  });
}

// =====================================================
// SAVE CHAPTER TEST RESULT
// =====================================================

export async function saveChapterTestProgress(
  userId: string,
  technologyId: string,
  chapterId: string,
  testId: string | null,
  score: number,
  passed: boolean,
): Promise<UserProgressRecord> {
  return saveProgress({
    userId,
    technologyId,
    chapterId,
    testId,
    progressType: "chapter_test",
    completed: true,
    score,
    passed,
  });
}

// =====================================================
// SAVE FINAL TEST RESULT
// =====================================================

export async function saveFinalTestProgress(
  userId: string,
  technologyId: string,
  testId: string | null,
  score: number,
  passed: boolean,
): Promise<UserProgressRecord> {
  return saveProgress({
    userId,
    technologyId,
    testId,
    progressType: "final_test",
    completed: true,
    score,
    passed,
  });
}

// =====================================================
// CHECK LESSON COMPLETION
// =====================================================

export async function isLessonCompleted(
  userId: string,
  technologyId: string,
  chapterId: string,
  lessonId: string,
): Promise<boolean> {
  const result =
    await findExistingProgress(
      userId,
      technologyId,
      "lesson",
      chapterId,
      lessonId,
    );

  return (
    result?.completed ===
    true
  );
}

// =====================================================
// CHECK CHAPTER COMPLETION
// =====================================================

export async function isChapterCompleted(
  userId: string,
  technologyId: string,
  chapterId: string,
): Promise<boolean> {
  const result =
    await findExistingProgress(
      userId,
      technologyId,
      "chapter",
      chapterId,
    );

  return (
    result?.completed ===
    true
  );
}

// =====================================================
// CHECK PASSED CHAPTER TEST
// =====================================================

export async function hasPassedChapterTest(
  userId: string,
  technologyId: string,
  chapterId: string,
): Promise<boolean> {
  const result =
    await findExistingProgress(
      userId,
      technologyId,
      "chapter_test",
      chapterId,
    );

  return (
    result?.passed ===
    true
  );
}

// =====================================================
// CHECK PASSED FINAL TEST
// =====================================================

export async function hasPassedFinalTest(
  userId: string,
  technologyId: string,
): Promise<boolean> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT id
        FROM user_progress
        WHERE
          user_id = ?
          AND technology_id = ?
          AND progress_type = 'final_test'
          AND passed = TRUE
        LIMIT 1
      `,
      [
        userId,
        technologyId,
      ],
    );

  return (
    (
      rows as Array<{
        id: string;
      }>
    ).length > 0
  );
}