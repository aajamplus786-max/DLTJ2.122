
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// TEST CONTENT SERVICE
// FILE: server/src/services/testContentService.ts
// DATE: 2026-09-07
// =====================================================

import {
    ResultSetHeader,
    RowDataPacket,
} from "mysql2";

import {
    randomUUID,
} from "crypto";

import {
    databasePool,
} from "../config/database";

// =====================================================
// TYPES
// =====================================================

export interface CreateTestInput {
    technologyId: string;
    title: string;
    testType?: string;

    startChapter?: number | null;
    endChapter?: number | null;

    passPercentage?: number;
    displayOrder?: number;
}

export interface UpdateTestInput {
    title?: string;
    testType?: string;

    startChapter?: number | null;
    endChapter?: number | null;

    passPercentage?: number;
    displayOrder?: number;

    isActive?: boolean;
}

interface TestRow extends RowDataPacket {
    id: string;
    technologyId: string;
    title: string;
    testType: string;
    startChapter: number | null;
    endChapter: number | null;
    passPercentage: number;
    displayOrder: number;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

interface TestQuestionRow extends RowDataPacket {
    id: string;
    testId: string;
    questionId: string;
    marks: number;
    displayOrder: number;
    createdAt: Date;
}

// =====================================================
// CREATE TEST
// =====================================================

export async function createTest(
    input: CreateTestInput,
) {
    const title =
        input.title.trim();

    if (!title) {
        throw new Error(
            "Test title is required",
        );
    }

    const passPercentage =
        input.passPercentage ??
        60;

    if (
        passPercentage < 0 ||
        passPercentage > 100
    ) {
        throw new Error(
            "Pass percentage must be between 0 and 100",
        );
    }

    const [
        technologyRows,
    ] = await databasePool.execute<
        RowDataPacket[]
    >(
        `
        SELECT
            id
        FROM technologies
        WHERE id = ?
          AND is_active = 1
        LIMIT 1
        `,
        [
            input.technologyId,
        ],
    );

    if (
        technologyRows.length ===
        0
    ) {
        throw new Error(
            "Technology not found",
        );
    }

    const id =
        randomUUID();

    await databasePool.execute<ResultSetHeader>(
        `
        INSERT INTO tests
        (
            id,
            technology_id,
            title,
            test_type,
            start_chapter,
            end_chapter,
            pass_percentage,
            display_order,
            is_active,
            created_at,
            updated_at
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            1,
            NOW(),
            NOW()
        )
        `,
        [
            id,
            input.technologyId,
            title,
            input.testType ??
                "CHAPTER_TEST",
            input.startChapter ??
                null,
            input.endChapter ??
                null,
            passPercentage,
            input.displayOrder ??
                0,
        ],
    );

    return getTestById(
        id,
    );
}

// =====================================================
// GET TEST BY ID
// =====================================================

export async function getTestById(
    id: string,
) {
    const [
        rows,
    ] = await databasePool.execute<
        TestRow[]
    >(
        `
        SELECT
            id,
            technology_id AS technologyId,
            title,
            test_type AS testType,
            start_chapter AS startChapter,
            end_chapter AS endChapter,
            pass_percentage AS passPercentage,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM tests
        WHERE id = ?
        LIMIT 1
        `,
        [
            id,
        ],
    );

    return rows[0] ??
        null;
}

// =====================================================
// GET TESTS BY TECHNOLOGY
// =====================================================

export async function getTestsByTechnology(
    technologyId: string,
    includeInactive = false,
) {
    const activeCondition =
        includeInactive
            ? ""
            : "AND is_active = 1";

    const [
        rows,
    ] = await databasePool.execute<
        TestRow[]
    >(
        `
        SELECT
            id,
            technology_id AS technologyId,
            title,
            test_type AS testType,
            start_chapter AS startChapter,
            end_chapter AS endChapter,
            pass_percentage AS passPercentage,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM tests
        WHERE technology_id = ?
        ${activeCondition}
        ORDER BY
            display_order ASC,
            id ASC
        `,
        [
            technologyId,
        ],
    );

    return rows;
}

// =====================================================
// UPDATE TEST
// =====================================================

export async function updateTest(
    id: string,
    input: UpdateTestInput,
) {
    const existing =
        await getTestById(
            id,
        );

    if (!existing) {
        return null;
    }

    const title =
        input.title !==
        undefined
            ? input.title.trim()
            : existing.title;

    if (!title) {
        throw new Error(
            "Test title is required",
        );
    }

    const passPercentage =
        input.passPercentage ??
        existing.passPercentage;

    if (
        passPercentage < 0 ||
        passPercentage > 100
    ) {
        throw new Error(
            "Pass percentage must be between 0 and 100",
        );
    }

    const testType =
        input.testType ??
        existing.testType;

    const startChapter =
        input.startChapter !==
        undefined
            ? input.startChapter
            : existing.startChapter;

    const endChapter =
        input.endChapter !==
        undefined
            ? input.endChapter
            : existing.endChapter;

    const displayOrder =
        input.displayOrder ??
        existing.displayOrder;

    const isActive =
        input.isActive !==
        undefined
            ? input.isActive
                ? 1
                : 0
            : existing.isActive;

    await databasePool.execute<ResultSetHeader>(
        `
        UPDATE tests
        SET
            title = ?,
            test_type = ?,
            start_chapter = ?,
            end_chapter = ?,
            pass_percentage = ?,
            display_order = ?,
            is_active = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            title,
            testType,
            startChapter,
            endChapter,
            passPercentage,
            displayOrder,
            isActive,
            id,
        ],
    );

    return getTestById(
        id,
    );
}

// =====================================================
// DELETE TEST
// =====================================================

export async function deleteTest(
    id: string,
) {
    const existing =
        await getTestById(
            id,
        );

    if (!existing) {
        return false;
    }

    await databasePool.execute<ResultSetHeader>(
        `
        UPDATE tests
        SET
            is_active = 0,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            id,
        ],
    );

    return true;
}

// =====================================================
// ADD QUESTION TO TEST
// =====================================================

export async function addQuestionToTest(
    testId: string,
    questionId: string,
    marks: number,
    displayOrder: number,
) {
    const [
        testRows,
    ] = await databasePool.execute<
        RowDataPacket[]
    >(
        `
        SELECT
            id
        FROM tests
        WHERE id = ?
          AND is_active = 1
        LIMIT 1
        `,
        [
            testId,
        ],
    );

    if (
        testRows.length === 0
    ) {
        throw new Error(
            "Test not found",
        );
    }

    const [
        questionRows,
    ] = await databasePool.execute<
        RowDataPacket[]
    >(
        `
        SELECT
            id
        FROM questions
        WHERE id = ?
          AND is_active = 1
        LIMIT 1
        `,
        [
            questionId,
        ],
    );

    if (
        questionRows.length === 0
    ) {
        throw new Error(
            "Question not found",
        );
    }

    const id =
        randomUUID();

    await databasePool.execute<ResultSetHeader>(
        `
        INSERT INTO test_questions
        (
            id,
            test_id,
            question_id,
            marks,
            display_order,
            created_at
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            NOW()
        )
        `,
        [
            id,
            testId,
            questionId,
            marks,
            displayOrder,
        ],
    );

    return getTestQuestionById(
        id,
    );
}

// =====================================================
// GET TEST QUESTION BY ID
// =====================================================

export async function getTestQuestionById(
    id: string,
) {
    const [
        rows,
    ] = await databasePool.execute<
        TestQuestionRow[]
    >(
        `
        SELECT
            id,
            test_id AS testId,
            question_id AS questionId,
            marks,
            display_order AS displayOrder,
            created_at AS createdAt
        FROM test_questions
        WHERE id = ?
        LIMIT 1
        `,
        [
            id,
        ],
    );

    return rows[0] ??
        null;
}

// =====================================================
// GET QUESTIONS BY TEST
// =====================================================

export async function getQuestionsByTest(
    testId: string,
) {
    const [
        rows,
    ] = await databasePool.execute<
        TestQuestionRow[]
    >(
        `
        SELECT
            id,
            test_id AS testId,
            question_id AS questionId,
            marks,
            display_order AS displayOrder,
            created_at AS createdAt
        FROM test_questions
        WHERE test_id = ?
        ORDER BY
            display_order ASC,
            id ASC
        `,
        [
            testId,
        ],
    );

    return rows;
}

// =====================================================
// REMOVE QUESTION FROM TEST
// =====================================================

export async function removeQuestionFromTest(
    testQuestionId: string,
) {
    const [
        result,
    ] =
        await databasePool.execute<ResultSetHeader>(
            `
            DELETE FROM test_questions
            WHERE id = ?
            `,
            [
                testQuestionId,
            ],
        );

    return result.affectedRows >
        0;
}

// =====================================================
// REORDER TEST QUESTIONS
// =====================================================

export async function reorderTestQuestions(
    testId: string,
    questionIds: string[],
) {
    const connection =
        await databasePool.getConnection();

    try {
        await connection.beginTransaction();

        for (
            let index = 0;
            index <
            questionIds.length;
            index++
        ) {
            await connection.execute(
                `
                UPDATE test_questions
                SET
                    display_order = ?
                WHERE id = ?
                  AND test_id = ?
                `,
                [
                    index + 1,
                    questionIds[
                        index
                    ],
                    testId,
                ],
            );
        }

        await connection.commit();

        return getQuestionsByTest(
            testId,
        );
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
