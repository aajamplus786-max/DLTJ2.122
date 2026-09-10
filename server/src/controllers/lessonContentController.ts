// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// LESSON CONTENT CONTROLLER
// FILE: server/src/controllers/lessonContentController.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

import { Request, Response } from "express";

import {
    createLesson,
    getLessonsByChapter,
    getLessonById,
    updateLesson,
    deleteLesson,
    reorderLessons,
} from "../services/lessonContentService";

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
// GET LESSONS BY CHAPTER
// =====================================================

export async function getLessons(
    req: Request,
    res: Response,
) {
    try {
        const chapterId =
            getParam(req.params.chapterId);

        if (!chapterId) {
            return res.status(400).json({
                success: false,
                message: "Chapter ID is required",
            });
        }

        const includeInactive =
            req.query.includeInactive === "true";

        const lessons =
            await getLessonsByChapter(
                chapterId,
                includeInactive,
            );

        return res.status(200).json({
            success: true,
            data: lessons,
        });
    } catch (error) {
        console.error(
            "[GET LESSONS ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get lessons",
        });
    }
}

// =====================================================
// GET LESSON BY ID
// =====================================================

export async function getLesson(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Lesson ID is required",
            });
        }

        const lesson =
            await getLessonById(id);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: lesson,
        });
    } catch (error) {
        console.error(
            "[GET LESSON ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get lesson",
        });
    }
}

// =====================================================
// CREATE LESSON
// =====================================================

export async function createLessonController(
    req: Request,
    res: Response,
) {
    try {
        const {
            chapterId,
            lessonNumber,
            title,
            content,
            displayOrder,
        } = req.body;

        if (
            typeof chapterId !== "string" ||
            !chapterId
        ) {
            return res.status(400).json({
                success: false,
                message: "Chapter ID is required",
            });
        }

        if (
            typeof lessonNumber !== "number"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Lesson number is required",
            });
        }

        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Lesson title is required",
            });
        }

        if (
            typeof content !== "string" ||
            !content.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Lesson content is required",
            });
        }

        const lesson =
            await createLesson({
                chapterId,
                lessonNumber,
                title,
                content,
                displayOrder,
            });

        return res.status(201).json({
            success: true,
            message:
                "Lesson created successfully",
            data: lesson,
        });
    } catch (error) {
        console.error(
            "[CREATE LESSON ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create lesson",
        });
    }
}

// =====================================================
// UPDATE LESSON
// =====================================================

export async function updateLessonController(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Lesson ID is required",
            });
        }

        const lesson =
            await updateLesson(
                id,
                req.body,
            );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Lesson updated successfully",
            data: lesson,
        });
    } catch (error) {
        console.error(
            "[UPDATE LESSON ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update lesson",
        });
    }
}

// =====================================================
// DELETE LESSON
// =====================================================

export async function deleteLessonController(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Lesson ID is required",
            });
        }

        const deleted =
            await deleteLesson(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Lesson deleted successfully",
        });
    } catch (error) {
        console.error(
            "[DELETE LESSON ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete lesson",
        });
    }
}

// =====================================================
// REORDER LESSONS
// =====================================================

export async function reorderLessonController(
    req: Request,
    res: Response,
) {
    try {
        const chapterId =
            getParam(req.params.chapterId);

        if (!chapterId) {
            return res.status(400).json({
                success: false,
                message: "Chapter ID is required",
            });
        }

        const {
            lessonIds,
        } = req.body;

        if (
            !Array.isArray(lessonIds) ||
            !lessonIds.every(
                (id) => typeof id === "string",
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "lessonIds must be an array of strings",
            });
        }

        const lessons =
            await reorderLessons(
                chapterId,
                lessonIds,
            );

        return res.status(200).json({
            success: true,
            message:
                "Lessons reordered successfully",
            data: lessons,
        });
    } catch (error) {
        console.error(
            "[REORDER LESSONS ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to reorder lessons",
        });
    }
}