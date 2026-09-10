
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// LESSON CONTENT SERVICE
// FILE: server/src/services/lessonContentService.ts
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

export interface CreateLessonInput {
    chapterId: string;
    lessonNumber: number;
    title: string;
    content: string;
    displayOrder?: number;
}

export interface UpdateLessonInput {
    lessonNumber?: number;
    title?: string;
    content?: string;
    displayOrder?: number;
    isActive?: boolean;
}

interface LessonRow extends RowDataPacket {
    id: string;
    chapterId: string;
    lessonNumber: number;
    title: string;
    content: string;
    displayOrder: number;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

// =====================================================
// CREATE LESSON
// =====================================================

export async function createLesson(
    input: CreateLessonInput,
) {
    const [
        chapterRows,
    ] = await databasePool.execute<
        RowDataPacket[]
    >(
        `
        SELECT
            id
        FROM chapters
        WHERE id = ?
          AND is_active = 1
        LIMIT 1
        `,
        [
            input.chapterId,
        ],
    );

    if (
        chapterRows.length === 0
    ) {
        throw new Error(
            "Chapter not found",
        );
    }

    const title =
        input.title.trim();

    if (!title) {
        throw new Error(
            "Lesson title is required",
        );
    }

    if (
        !input.content.trim()
    ) {
        throw new Error(
            "Lesson content is required",
        );
    }

    const id =
        randomUUID();

    await databasePool.execute<ResultSetHeader>(
        `
        INSERT INTO lessons
        (
            id,
            chapter_id,
            lesson_number,
            title,
            content,
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
            1,
            NOW(),
            NOW()
        )
        `,
        [
            id,
            input.chapterId,
            input.lessonNumber,
            title,
            input.content,
            input.displayOrder ??
                input.lessonNumber,
        ],
    );

    return getLessonById(
        id,
    );
}

// =====================================================
// GET LESSONS BY CHAPTER
// =====================================================

export async function getLessonsByChapter(
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
        LessonRow[]
    >(
        `
        SELECT
            id,
            chapter_id AS chapterId,
            lesson_number AS lessonNumber,
            title,
            content,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM lessons
        WHERE chapter_id = ?
        ${activeCondition}
        ORDER BY
            display_order ASC,
            lesson_number ASC
        `,
        [
            chapterId,
        ],
    );

    return rows;
}

// =====================================================
// GET LESSON BY ID
// =====================================================

export async function getLessonById(
    id: string,
) {
    const [
        rows,
    ] = await databasePool.execute<
        LessonRow[]
    >(
        `
        SELECT
            id,
            chapter_id AS chapterId,
            lesson_number AS lessonNumber,
            title,
            content,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM lessons
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
// UPDATE LESSON
// =====================================================

export async function updateLesson(
    id: string,
    input: UpdateLessonInput,
) {
    const existing =
        await getLessonById(
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

    const content =
        input.content !==
        undefined
            ? input.content
            : existing.content;

    if (!title) {
        throw new Error(
            "Lesson title is required",
        );
    }

    if (!content.trim()) {
        throw new Error(
            "Lesson content is required",
        );
    }

    const lessonNumber =
        input.lessonNumber ??
        existing.lessonNumber;

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
        UPDATE lessons
        SET
            lesson_number = ?,
            title = ?,
            content = ?,
            display_order = ?,
            is_active = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            lessonNumber,
            title,
            content,
            displayOrder,
            isActive,
            id,
        ],
    );

    return getLessonById(
        id,
    );
}

// =====================================================
// DELETE LESSON
// =====================================================

export async function deleteLesson(
    id: string,
) {
    const existing =
        await getLessonById(
            id,
        );

    if (!existing) {
        return false;
    }

    await databasePool.execute<ResultSetHeader>(
        `
        UPDATE lessons
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
// REORDER LESSONS
// =====================================================

export async function reorderLessons(
    chapterId: string,
    lessonIds: string[],
) {
    const connection =
        await databasePool.getConnection();

    try {
        await connection.beginTransaction();

        for (
            let index = 0;
            index <
            lessonIds.length;
            index++
        ) {
            await connection.execute(
                `
                UPDATE lessons
                SET
                    display_order = ?,
                    updated_at = NOW()
                WHERE id = ?
                  AND chapter_id = ?
                `,
                [
                    index + 1,
                    lessonIds[index],
                    chapterId,
                ],
            );
        }

        await connection.commit();

        return getLessonsByChapter(
            chapterId,
            true,
        );
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
