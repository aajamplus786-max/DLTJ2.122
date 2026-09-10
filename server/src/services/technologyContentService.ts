
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// TECHNOLOGY CONTENT SERVICE
// FILE: server/src/services/technologyContentService.ts
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

export interface CreateTechnologyInput {
    name: string;
    section?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface UpdateTechnologyInput {
    name?: string;
    section?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface Technology {
    id: string;
    name: string;
    section: string;
    displayOrder: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TechnologyRow extends RowDataPacket {
    id: string;
    name: string;
    section: string;
    displayOrder: number;
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

// =====================================================
// GET ALL TECHNOLOGIES
// =====================================================

export async function getAllTechnologies(
    includeInactive = false,
) {
    const activeCondition =
        includeInactive
            ? ""
            : "AND is_active = 1";

    const [
        rows,
    ] = await databasePool.execute<
        TechnologyRow[]
    >(
        `
        SELECT
            id,
            name,
            section,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM technologies
        WHERE 1 = 1
        ${activeCondition}
        ORDER BY
            display_order ASC,
            name ASC
        `,
    );

    return rows;
}

// =====================================================
// GET TECHNOLOGY BY ID
// =====================================================

export async function getTechnologyById(
    id: string,
    includeInactive = false,
) {
    const activeCondition =
        includeInactive
            ? ""
            : "AND is_active = 1";

    const [
        rows,
    ] = await databasePool.execute<
        TechnologyRow[]
    >(
        `
        SELECT
            id,
            name,
            section,
            display_order AS displayOrder,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM technologies
        WHERE id = ?
        ${activeCondition}
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
// CREATE TECHNOLOGY
// =====================================================

export async function createTechnology(
    input: CreateTechnologyInput,
) {
    const name =
        input.name.trim();

    const section =
        (input.section ??
            "").trim();

    const displayOrder =
        Number(
            input.displayOrder ??
                1,
        );

    const isActive =
        input.isActive !==
        false;

    if (!name) {
        throw new Error(
            "Technology name is required.",
        );
    }

    if (
        !Number.isFinite(
            displayOrder,
        ) ||
        displayOrder < 1
    ) {
        throw new Error(
            "Display order must be at least 1.",
        );
    }

    // -------------------------------------------------
    // Prevent duplicate technology names
    // -------------------------------------------------

    const [
        existingRows,
    ] = await databasePool.execute<
        RowDataPacket[]
    >(
        `
        SELECT
            id
        FROM technologies
        WHERE LOWER(name) = LOWER(?)
        LIMIT 1
        `,
        [
            name,
        ],
    );

    if (
        existingRows.length >
        0
    ) {
        throw new Error(
            "Technology already exists.",
        );
    }

    const id =
        randomUUID();

    await databasePool.execute<ResultSetHeader>(
        `
        INSERT INTO technologies
        (
            id,
            name,
            section,
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
            NOW(),
            NOW()
        )
        `,
        [
            id,
            name,
            section,
            displayOrder,
            isActive
                ? 1
                : 0,
        ],
    );

    return getTechnologyById(
        id,
        true,
    );
}

// =====================================================
// UPDATE TECHNOLOGY
// =====================================================

export async function updateTechnology(
    id: string,
    input: UpdateTechnologyInput,
) {
    const existing =
        await getTechnologyById(
            id,
            true,
        );

    if (!existing) {
        return null;
    }

    const name =
        input.name !==
        undefined
            ? input.name.trim()
            : existing.name;

    const section =
        input.section !==
        undefined
            ? input.section.trim()
            : existing.section;

    const displayOrder =
        input.displayOrder !==
        undefined
            ? Number(
                input.displayOrder,
            )
            : Number(
                existing.displayOrder,
            );

    const isActive =
        input.isActive !==
        undefined
            ? input.isActive
                ? 1
                : 0
            : Number(
                existing.isActive,
            );

    if (!name) {
        throw new Error(
            "Technology name is required.",
        );
    }

    if (
        !Number.isFinite(
            displayOrder,
        ) ||
        displayOrder < 1
    ) {
        throw new Error(
            "Display order must be at least 1.",
        );
    }

    // -------------------------------------------------
    // Prevent duplicate names
    // -------------------------------------------------

    const [
        duplicateRows,
    ] = await databasePool.execute<
        RowDataPacket[]
    >(
        `
        SELECT
            id
        FROM technologies
        WHERE LOWER(name) = LOWER(?)
          AND id <> ?
        LIMIT 1
        `,
        [
            name,
            id,
        ],
    );

    if (
        duplicateRows.length >
        0
    ) {
        throw new Error(
            "Another technology with this name already exists.",
        );
    }

    await databasePool.execute<ResultSetHeader>(
        `
        UPDATE technologies
        SET
            name = ?,
            section = ?,
            display_order = ?,
            is_active = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [
            name,
            section,
            displayOrder,
            isActive,
            id,
        ],
    );

    return getTechnologyById(
        id,
        true,
    );
}

// =====================================================
// DELETE TECHNOLOGY
// =====================================================

export async function deleteTechnology(
    id: string,
) {
    const existing =
        await getTechnologyById(
            id,
            true,
        );

    if (!existing) {
        return false;
    }

    // -------------------------------------------------
    // Soft delete
    // -------------------------------------------------

    await databasePool.execute<ResultSetHeader>(
        `
        UPDATE technologies
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
// REORDER TECHNOLOGIES
// =====================================================

export async function reorderTechnologies(
    technologyIds: string[],
) {
    const connection =
        await databasePool.getConnection();

    try {
        await connection.beginTransaction();

        for (
            let index = 0;
            index <
            technologyIds.length;
            index++
        ) {
            await connection.execute(
                `
                UPDATE technologies
                SET
                    display_order = ?,
                    updated_at = NOW()
                WHERE id = ?
                `,
                [
                    index + 1,
                    technologyIds[
                        index
                    ],
                ],
            );
        }

        await connection.commit();

        return getAllTechnologies(
            true,
        );
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
