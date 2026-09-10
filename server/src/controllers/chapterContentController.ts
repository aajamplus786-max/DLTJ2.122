// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// CHAPTER CONTENT CONTROLLER
// FILE: server/src/controllers/chapterContentController.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

import { Request, Response } from "express";

import {
    createChapter,
    getChaptersByTechnology,
    getChapterById,
    updateChapter,
    deleteChapter,
    reorderChapters,
} from "../services/chapterContentService";

// =====================================================
// PARAM HELPER
// =====================================================

function getParam(
    value: string | string[] | undefined,
): string | null {
    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value) && value.length > 0) {
        return value[0];
    }

    return null;
}

// =====================================================
// GET CHAPTERS BY TECHNOLOGY
// =====================================================

export async function getChapters(
    req: Request,
    res: Response,
) {
    try {
        const technologyId =
            getParam(req.params.technologyId);

        if (!technologyId) {
            return res.status(400).json({
                success: false,
                message:
                    "Technology ID is required",
            });
        }

        const includeInactive =
            req.query.includeInactive === "true";

        const chapters =
            await getChaptersByTechnology(
                technologyId,
                includeInactive,
            );

        return res.status(200).json({
            success: true,
            data: chapters,
        });
    } catch (error) {
        console.error(
            "[GET CHAPTERS ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get chapters",
        });
    }
}

// =====================================================
// GET CHAPTER BY ID
// =====================================================

export async function getChapter(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Chapter ID is required",
            });
        }

        const chapter =
            await getChapterById(id);

        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: chapter,
        });
    } catch (error) {
        console.error(
            "[GET CHAPTER ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get chapter",
        });
    }
}

// =====================================================
// CREATE CHAPTER
// =====================================================

export async function createChapterController(
    req: Request,
    res: Response,
) {
    try {
        const {
            technologyId,
            chapterNumber,
            title,
            description,
            displayOrder,
        } = req.body;

        if (
            typeof technologyId !== "string" ||
            !technologyId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Technology ID is required",
            });
        }

        if (
            typeof chapterNumber !== "number"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Chapter number is required",
            });
        }

        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Chapter title is required",
            });
        }

        const chapter =
            await createChapter({
                technologyId,
                chapterNumber,
                title,
                description,
                displayOrder,
            });

        return res.status(201).json({
            success: true,
            message:
                "Chapter created successfully",
            data: chapter,
        });
    } catch (error) {
        console.error(
            "[CREATE CHAPTER ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create chapter",
        });
    }
}

// =====================================================
// UPDATE CHAPTER
// =====================================================

export async function updateChapterController(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Chapter ID is required",
            });
        }

        const chapter =
            await updateChapter(
                id,
                req.body,
            );

        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Chapter updated successfully",
            data: chapter,
        });
    } catch (error) {
        console.error(
            "[UPDATE CHAPTER ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update chapter",
        });
    }
}

// =====================================================
// DELETE CHAPTER
// =====================================================

export async function deleteChapterController(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Chapter ID is required",
            });
        }

        const deleted =
            await deleteChapter(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Chapter deleted successfully",
        });
    } catch (error) {
        console.error(
            "[DELETE CHAPTER ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete chapter",
        });
    }
}

// =====================================================
// REORDER CHAPTERS
// =====================================================

export async function reorderChapterController(
    req: Request,
    res: Response,
) {
    try {
        const technologyId =
            getParam(req.params.technologyId);

        if (!technologyId) {
            return res.status(400).json({
                success: false,
                message:
                    "Technology ID is required",
            });
        }

        const {
            chapterIds,
        } = req.body;

        if (
            !Array.isArray(chapterIds) ||
            !chapterIds.every(
                (id) => typeof id === "string",
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "chapterIds must be an array of strings",
            });
        }

        const chapters =
            await reorderChapters(
                technologyId,
                chapterIds,
            );

        return res.status(200).json({
            success: true,
            message:
                "Chapters reordered successfully",
            data: chapters,
        });
    } catch (error) {
        console.error(
            "[REORDER CHAPTERS ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to reorder chapters",
        });
    }
}