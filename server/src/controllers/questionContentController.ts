// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// QUESTION CONTENT CONTROLLER
// FILE: server/src/controllers/questionContentController.ts
// DATE: 2026-09-04
// CREATE BY: aajamthurinji
// =====================================================

import { Request, Response } from "express";

import {
    createQuestion,
    getQuestionById,
    getQuestionsByChapter,
    getQuestionsByTechnology,
    updateQuestion,
    deleteQuestion,
} from "../services/questionContentService";

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
// GET QUESTION BY ID
// =====================================================

export async function getQuestion(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Question ID is required",
            });
        }

        const question =
            await getQuestionById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: question,
        });
    } catch (error) {
        console.error(
            "[GET QUESTION ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get question",
        });
    }
}

// =====================================================
// GET QUESTIONS BY CHAPTER
// =====================================================

export async function getChapterQuestions(
    req: Request,
    res: Response,
) {
    try {
        const chapterId =
            getParam(req.params.chapterId);

        if (!chapterId) {
            return res.status(400).json({
                success: false,
                message:
                    "Chapter ID is required",
            });
        }

        const includeInactive =
            req.query.includeInactive === "true";

        const questions =
            await getQuestionsByChapter(
                chapterId,
                includeInactive,
            );

        return res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        console.error(
            "[GET CHAPTER QUESTIONS ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to get chapter questions",
        });
    }
}

// =====================================================
// GET QUESTIONS BY TECHNOLOGY
// =====================================================

export async function getTechnologyQuestions(
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

        const questions =
            await getQuestionsByTechnology(
                technologyId,
                includeInactive,
            );

        return res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        console.error(
            "[GET TECHNOLOGY QUESTIONS ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to get technology questions",
        });
    }
}

// =====================================================
// CREATE QUESTION
// =====================================================

export async function createQuestionController(
    req: Request,
    res: Response,
) {
    try {
        const {
            technologyId,
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
            typeof questionText !== "string" ||
            !questionText.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Question text is required",
            });
        }

        if (
            typeof correctAnswer !== "string" ||
            !correctAnswer.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Correct answer is required",
            });
        }

        const question =
            await createQuestion({
                technologyId,
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
            });

        return res.status(201).json({
            success: true,
            message:
                "Question created successfully",
            data: question,
        });
    } catch (error) {
        console.error(
            "[CREATE QUESTION ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create question",
        });
    }
}

// =====================================================
// UPDATE QUESTION
// =====================================================

export async function updateQuestionController(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Question ID is required",
            });
        }

        const question =
            await updateQuestion(
                id,
                req.body,
            );

        if (!question) {
            return res.status(404).json({
                success: false,
                message:
                    "Question not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Question updated successfully",
            data: question,
        });
    } catch (error) {
        console.error(
            "[UPDATE QUESTION ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update question",
        });
    }
}

// =====================================================
// DELETE QUESTION
// =====================================================

export async function deleteQuestionController(
    req: Request,
    res: Response,
) {
    try {
        const id = getParam(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Question ID is required",
            });
        }

        const deleted =
            await deleteQuestion(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message:
                    "Question not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Question deleted successfully",
        });
    } catch (error) {
        console.error(
            "[DELETE QUESTION ERROR]",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete question",
        });
    }
}