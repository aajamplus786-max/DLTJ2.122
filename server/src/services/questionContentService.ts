
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// QUESTION CONTENT SERVICE
// FILE: server/src/services/questionContentService.ts
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

export interface CreateQuestionInput {
    technologyId: string;
    chapterId?: string | null;

    questionType?: string;
    questionText: string;

    optionA?: string | null;
    optionB?: string | null;
    optionC?: string | null;
    optionD?: string | null;

    correctAnswer: string;

    explanation?: string | null;

    marks?: number;
    displayOrder?: number;
}

export interface UpdateQuestionInput {
    chapterId?: string | null;
    questionType?: string;
    questionText?: string;

    optionA?: string | null;
    optionB?: string | null;
    optionC?: string | null;
    optionD?: string | null;

    correctAnswer?: string;
    explanation?: string | null;

    marks?: number;
    displayOrder?: number;
    isActive?: boolean;
}

interface QuestionRow extends RowDataPacket {
    id: string;
    technologyId: string;
    chapterId: string | null;
    questionType: string;
    questionText: string;

    optionA: string | null;
    optionB: string | null;
    optionC: string | null;
    optionD: string | null;

    correctAnswer: string;
    explanation: string | null;

    marks: number;
    displayOrder: number;

    isActive: number;

    createdAt: Date;
    updatedAt: Date;
}

// =====================================================
// CREATE QUESTION
// =====================================================

export async function createQuestion(
    input: CreateQuestionInput,
) {
    if (
        !input.questionText.trim()
    ) {
        throw new Error(
            "Question text is required",
        );
    }

    if (
        !input.correctAnswer.trim()
    ) {
        throw new Error(
            "Correct answer is required",
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

    if (input.chapterId) {
        const [
            chapterRows,
        ] =
            await databasePool.execute<
                RowDataPacket[]
            >(
                `
                SELECT
                    id
                FROM chapters
                WHERE id = ?
                  AND technology_id = ?
                  AND is_active = 1
                LIMIT 1
                `,
                [
                    input.chapterId,
                    input.technologyId,
                ],
            );

        if (
            chapterRows.length ===
            0
        ) {
            throw new Error(
                "Chapter does not belong to technology",
            );
        }
    }

    const id =
        randomUUID();

    await databasePool.execute<ResultSetHeader>(
        `
        INSERT INTO questions
        (
            id,
            technology_id,
            chapter_id,
            question_type,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            explanation,
            marks,
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
            input.chapterId ??
                null,
            input.questionType ??
                "MCQ",
            input.questionText.trim(),
            input.optionA ??
                null,
            input.optionB ??
                null,
            input.optionC ??
                null,
            input.optionD ??
                null,
            input.correctAnswer.trim(),
            input.explanation ??
                null,
            input.marks ?? 1,
            input.displayOrder ??
                0,
        ],
    );

    return getQuestionById(
        id,
    );
}

// =====================================================
// GET QUESTION BY ID
// =====================================================

export async function getQuestionById(
    id: string,
) {
    const [
        rows,
    ] = await databasePool.execute<
        QuestionRow[]
    >(
        `
        SELECT
            id,
            technology_id AS technologyId,
            chapter_id AS chapterId,
            question_type AS questionType,
            question_text AS questionText,
            option_a AS optionA,
            option_b AS optionB,
            option_c AS optionC,
            option_d AS optionD,
            correct_answer AS correctAnswer,
            explanation,
            marks,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM questions
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
// GET QUESTIONS BY CHAPTER
// =====================================================

export async function getQuestionsByChapter(
    chapterId: string,
    includeInactive = false,
) {
    const activeCondition =
        includeInactive
            ? ""
            : "AND is_active = 1";

    const [
        rows,
    ] = await databasePool.execute<
        QuestionRow[]
    >(
        `
        SELECT
            id,
            technology_id AS technologyId,
            chapter_id AS chapterId,
            question_type AS questionType,
            question_text AS questionText,
            option_a AS optionA,
            option_b AS optionB,
            option_c AS optionC,
            option_d AS optionD,
            correct_answer AS correctAnswer,
            explanation,
            marks,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM questions
        WHERE chapter_id = ?
        ${activeCondition}
        ORDER BY
            display_order ASC,
            id ASC
        `,
        [
            chapterId,
        ],
    );

    return rows;
}

// =====================================================
// GET QUESTIONS BY TECHNOLOGY
// =====================================================

export async function getQuestionsByTechnology(
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
        QuestionRow[]
    >(
        `
        SELECT
            id,
            technology_id AS technologyId,
            chapter_id AS chapterId,
            question_type AS questionType,
            question_text AS questionText,
            option_a AS optionA,
            option_b AS optionB,
            option_c AS optionC,
            option_d AS optionD,
            correct_answer AS correctAnswer,
            explanation,
            marks,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM questions
        WHERE technology_id = ?
        ${activeCondition}
        ORDER BY
            chapter_id ASC,
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
// UPDATE QUESTION
// =====================================================

export async function updateQuestion(
    id: string,
    input: UpdateQuestionInput,
) {
    const existing =
        await getQuestionById(
            id,
        );

    if (!existing) {
        return null;
    }

    const questionText =
        input.questionText !==
        undefined
            ? input.questionText.trim()
            : existing.questionText;

    const correctAnswer =
        input.correctAnswer !==
        undefined
            ? input.correctAnswer.trim()
            : existing.correctAnswer;

    if (!questionText) {
        throw new Error(
            "Question text is required",
        );
    }

    if (!correctAnswer) {
        throw new Error(
            "Correct answer is required",
        );
    }

    const chapterId =
        input.chapterId !==
        undefined
            ? input.chapterId
            : existing.chapterId;

    const questionType =
        input.questionType ??
        existing.questionType;

    const optionA =
        input.optionA !==
        undefined
            ? input.optionA
            : existing.optionA;

    const optionB =
        input.optionB !==
        undefined
            ? input.optionB
            : existing.optionB;

    const optionC =
        input.optionC !==
        undefined
            ? input.optionC
            : existing.optionC;

    const optionD =
        input.optionD !==
        undefined
            ? input.optionD
            : existing.optionD;

    const explanation =
        input.explanation !==
        undefined
            ? input.explanation
            : existing.explanation;

    const marks =
        input.marks ??
        existing.marks;

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
        UPDATE questions
        SET
            chapter_id = ?,
            question_type = ?,
            question_text = ?,
            option_a = ?,
            option_b = ?,
            option_c = ?,
            option_d = ?,
            correct_answer = ?,
            explanation = ?,
            marks = ?,
            display_order = ?,
            is_active = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            chapterId,
            questionType,
            questionText,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            explanation,
            marks,
            displayOrder,
            isActive,
            id,
        ],
    );

    return getQuestionById(
        id,
    );
}

// =====================================================
// DELETE QUESTION
// =====================================================

export async function deleteQuestion(
    id: string,
) {
    const existing =
        await getQuestionById(
            id,
        );

    if (!existing) {
        return false;
    }

    await databasePool.execute<ResultSetHeader>(
        `
        UPDATE questions
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
