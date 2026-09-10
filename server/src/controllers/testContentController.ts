
// =========================================================
// FILE: server/src/controllers/testContentController.ts
// PROJECT: DLTJ2.10 Dynamic Learning System
// DATE: 2026-09-07
// LOCATION: server/src/controllers
// =========================================================

import { Request, Response } from "express";

import {
    createTest,
    getTestById,
    getTestsByTechnology,
    updateTest,
    deleteTest,
    addQuestionToTest,
    getTestQuestionById,
    getQuestionsByTest,
    removeQuestionFromTest,
    reorderTestQuestions,
} from "../services/testContentService";

// =========================================================
// GET TESTS BY TECHNOLOGY
// =========================================================

export async function getTechnologyTests(
    req: Request,
    res: Response
) {
    try {
        const technologyId =
            String(
                req.params.technologyId
            );

        const tests =
            await getTestsByTechnology(
                technologyId
            );

        return res.status(200).json({
            success: true,
            data: tests,
        });
    } catch (error) {
        console.error(
            "[GET TECHNOLOGY TESTS ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch tests",
        });
    }
}

// =========================================================
// GET SINGLE TEST
// =========================================================

export async function getTest(
    req: Request,
    res: Response
) {
    try {
        const id =
            String(req.params.id);

        const test =
            await getTestById(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message:
                    "Test not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: test,
        });
    } catch (error) {
        console.error(
            "[GET TEST ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch test",
        });
    }
}

// =========================================================
// CREATE TEST
// =========================================================
// Service CreateTestInput does not accept isActive.
// =========================================================

export async function createTestController(
    req: Request,
    res: Response
) {
    try {
        const {
            technologyId,
            title,
            testType,
            startChapter,
            endChapter,
            passPercentage,
            displayOrder,
        } = req.body;

        if (!technologyId) {
            return res.status(400).json({
                success: false,
                message:
                    "technologyId is required",
            });
        }

        if (
            !title ||
            String(title).trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "title is required",
            });
        }

        const test =
            await createTest({
                technologyId:
                    String(technologyId),

                title:
                    String(title).trim(),

                testType:
                    testType !== undefined &&
                    testType !== null
                        ? String(testType)
                        : "CHAPTER_TEST",

                startChapter:
                    startChapter !== undefined &&
                    startChapter !== null
                        ? Number(startChapter)
                        : null,

                endChapter:
                    endChapter !== undefined &&
                    endChapter !== null
                        ? Number(endChapter)
                        : null,

                passPercentage:
                    passPercentage !== undefined &&
                    passPercentage !== null
                        ? Number(
                              passPercentage
                          )
                        : 60,

                displayOrder:
                    displayOrder !== undefined &&
                    displayOrder !== null
                        ? Number(displayOrder)
                        : 0,
            });

        return res.status(201).json({
            success: true,
            data: test,
            message:
                "Test created successfully",
        });
    } catch (error) {
        console.error(
            "[CREATE TEST ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create test",
        });
    }
}

// =========================================================
// UPDATE TEST
// PUT /api/content/tests/:id
// =========================================================

export async function updateTestController(
    req: Request,
    res: Response
) {
    try {
        const id = String(req.params.id);

        const {
            title,
            testType,
            startChapter,
            endChapter,
            passPercentage,
            displayOrder,
            isActive,
        } = req.body;

        const test = await updateTest(id, {
            title:
                title !== undefined
                    ? String(title).trim()
                    : undefined,

            testType:
                testType !== undefined
                    ? String(testType)
                    : undefined,

            startChapter:
                startChapter !== undefined
                    ? Number(startChapter)
                    : undefined,

            endChapter:
                endChapter !== undefined
                    ? Number(endChapter)
                    : undefined,

            passPercentage:
                passPercentage !== undefined
                    ? Number(passPercentage)
                    : undefined,

            displayOrder:
                displayOrder !== undefined
                    ? Number(displayOrder)
                    : undefined,

            isActive:
                isActive !== undefined
                    ? Boolean(isActive)
                    : undefined,
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: test,
            message: "Test updated successfully",
        });
    } catch (error) {
        console.error(
            "[UPDATE TEST ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update test",
        });
    }
}

// =========================================================
// DELETE TEST
// =========================================================

export async function deleteTestController(
    req: Request,
    res: Response
) {
    try {
        const id =
            String(req.params.id);

        const deleted =
            await deleteTest(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message:
                    "Test not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Test deleted successfully",
        });
    } catch (error) {
        console.error(
            "[DELETE TEST ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete test",
        });
    }
}

// =========================================================
// GET TEST QUESTIONS
// =========================================================

export async function getTestQuestionsController(
    req: Request,
    res: Response
) {
    try {
        const testId =
            String(req.params.testId);

        const questions =
            await getQuestionsByTest(
                testId
            );

        return res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        console.error(
            "[GET TEST QUESTIONS ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch test questions",
        });
    }
}

// =========================================================
// GET SINGLE TEST QUESTION
// =========================================================

export async function getTestQuestion(
    req: Request,
    res: Response
) {
    try {
        const id =
            String(req.params.id);

        const question =
            await getTestQuestionById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message:
                    "Test question not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: question,
        });
    } catch (error) {
        console.error(
            "[GET TEST QUESTION ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch test question",
        });
    }
}

// =========================================================
// ADD QUESTION TO TEST
// Service expects:
// addQuestionToTest(
//   testId,
//   questionId,
//   marks,
//   displayOrder
// )
// =========================================================

export async function addQuestionToTestController(
    req: Request,
    res: Response
) {
    try {
        const testId =
            String(req.params.testId);

        const {
            questionId,
            marks,
            displayOrder,
        } = req.body;

        if (!questionId) {
            return res.status(400).json({
                success: false,
                message:
                    "questionId is required",
            });
        }

        const result =
            await addQuestionToTest(
                testId,
                String(questionId),
                marks !== undefined &&
                marks !== null
                    ? Number(marks)
                    : 1,
                displayOrder !== undefined &&
                displayOrder !== null
                    ? Number(
                          displayOrder
                      )
                    : 0
            );

        return res.status(201).json({
            success: true,
            data: result,
            message:
                "Question added to test successfully",
        });
    } catch (error) {
        console.error(
            "[ADD QUESTION TO TEST ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to add question to test",
        });
    }
}

// =========================================================
// REMOVE QUESTION FROM TEST
// Service expects testQuestionId only.
// =========================================================

export async function removeQuestionFromTestController(
    req: Request,
    res: Response
) {
    try {
        const questionId =
            String(
                req.params.questionId
            );

        const removed =
            await removeQuestionFromTest(
                questionId
            );

        if (!removed) {
            return res.status(404).json({
                success: false,
                message:
                    "Test question not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Question removed from test successfully",
        });
    } catch (error) {
        console.error(
            "[REMOVE QUESTION FROM TEST ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to remove question from test",
        });
    }
}

// =========================================================
// REORDER TEST QUESTIONS
// Service expects an array of question IDs.
// =========================================================

export async function reorderTestQuestionsController(
    req: Request,
    res: Response
) {
    try {
        const testId =
            String(req.params.testId);

        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message:
                    "items must be an array",
            });
        }

        const orderedQuestionIds =
            items
                .map((item) => {
                    if (
                        typeof item ===
                        "string"
                    ) {
                        return item;
                    }

                    return item?.questionId
                        ? String(
                              item.questionId
                          )
                        : "";
                })
                .filter(
                    (id: string) =>
                        id.trim() !== ""
                );

        await reorderTestQuestions(
            testId,
            orderedQuestionIds
        );

        return res.status(200).json({
            success: true,
            message:
                "Test questions reordered successfully",
        });
    } catch (error) {
        console.error(
            "[REORDER TEST QUESTIONS ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to reorder test questions",
        });
    }
}
