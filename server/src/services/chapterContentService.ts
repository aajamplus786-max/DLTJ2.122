
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// CHAPTER CONTENT SERVICE
// FILE: server/src/services/chapterContentService.ts
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

export interface CreateChapterInput {
    technologyId: string;
    chapterNumber: number;
    title: string;
    description?: string | null;
    displayOrder?: number;
}

export interface UpdateChapterInput {
    chapterNumber?: number;
    title?: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
}

interface ChapterRow extends RowDataPacket {
    id: string;
    technologyId: string;
    chapterNumber: number;
    title: string;
    description: string | null;
    displayOrder: number;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

// =====================================================
// CREATE CHAPTER
// =====================================================

export async function createChapter(
    input: CreateChapterInput,
) {
    // ---------------------------------------------
    // Validate technology
    // ---------------------------------------------

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
        technologyRows.length === 0
    ) {
        throw new Error(
            "Technology not found",
        );
    }

    // ---------------------------------------------
    // Validate chapter title
    // ---------------------------------------------

    const title =
        input.title.trim();

    if (!title) {
        throw new Error(
            "Chapter title is required",
        );
    }

    const id =
        randomUUID();

    // ---------------------------------------------
    // Insert chapter
    // ---------------------------------------------

    await databasePool.execute<ResultSetHeader>(
        `
        INSERT INTO chapters
        (
            id,
            technology_id,
            chapter_number,
            title,
            description,
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

            input.technologyId,

            input.chapterNumber,

            title,

            input.description ??
                null,

            input.displayOrder ??
                input.chapterNumber,
        ],
    );

    return getChapterById(
        id,
    );
}

// =====================================================
// GET CHAPTERS BY TECHNOLOGY
// =====================================================

export async function getChaptersByTechnology(
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
        ChapterRow[]
    >(
        `
        SELECT
            id,
            technology_id AS technologyId,
            chapter_number AS chapterNumber,
            title,
            description,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM chapters
        WHERE technology_id = ?
        ${activeCondition}
        ORDER BY
            display_order ASC,
            chapter_number ASC
        `,
        [
            technologyId,
        ],
    );

    return rows;
}

// =====================================================
// GET CHAPTER BY ID
// =====================================================

export async function getChapterById(
    id: string,
) {
    const [
        rows,
    ] = await databasePool.execute<
        ChapterRow[]
    >(
        `
        SELECT
            id,
            technology_id AS technologyId,
            chapter_number AS chapterNumber,
            title,
            description,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM chapters
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
// UPDATE CHAPTER
// =====================================================

export async function updateChapter(
    id: string,
    input: UpdateChapterInput,
) {
    const existing =
        await getChapterById(
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
            "Chapter title is required",
        );
    }

    const chapterNumber =
        input.chapterNumber ??
        existing.chapterNumber;

    const description =
        input.description !==
        undefined
            ? input.description
            : existing.description;

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
        UPDATE chapters
        SET
            chapter_number = ?,
            title = ?,
            description = ?,
            display_order = ?,
            is_active = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            chapterNumber,
            title,
            description,
            displayOrder,
            isActive,
            id,
        ],
    );

    return getChapterById(
        id,
    );
}

// =====================================================
// DELETE CHAPTER
// =====================================================

export async function deleteChapter(
    id: string,
) {
    const existing =
        await getChapterById(
            id,
        );

    if (!existing) {
        return false;
    }

    await databasePool.execute<ResultSetHeader>(
        `
        UPDATE chapters
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
// REORDER CHAPTERS
// =====================================================

export async function reorderChapters(
    technologyId: string,
    chapterIds: string[],
) {
    const connection =
        await databasePool.getConnection();

    try {
        await connection.beginTransaction();

        for (
            let index = 0;
            index < chapterIds.length;
            index++
        ) {
            await connection.execute(
                `
                UPDATE chapters
                SET
                    display_order = ?,
                    updated_at = NOW()
                WHERE id = ?
                  AND technology_id = ?
                `,
                [
                    index + 1,

                    chapterIds[
                        index
                    ],

                    technologyId,
                ],
            );
        }

        await connection.commit();

        return getChaptersByTechnology(
            technologyId,
            true,
        );
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
