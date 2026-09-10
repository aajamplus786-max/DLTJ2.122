// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// CONTENT IMPORT CONTROLLER
// FILE: server/src/controllers/contentImportController.ts
// DATE: 2026-09-07
// =====================================================

import {
    Request,
    Response,
} from "express";

import {
    importContent,
} from "../services/contentImportService";

// =====================================================
// PARAM HELPER
// =====================================================

function getParam(
    value: string | string[] | undefined,
): string | null {
    if (typeof value === "string") {
        return value;
    }

    if (
        Array.isArray(value) &&
        value.length > 0
    ) {
        return value[0];
    }

    return null;
}

// =====================================================
// IMPORT AI CONTENT
// =====================================================

export async function importContentController(
    req: Request,
    res: Response,
) {
    try {
        const technologyId =
            getParam(
                req.params.technologyId,
            );

        if (!technologyId) {
            return res.status(400).json({
                success: false,
                message:
                    "Technology ID is required.",
            });
        }

        let rawContent = "";

        if (
            typeof req.body === "string"
        ) {
            rawContent =
                req.body;
        } else if (
            req.body &&
            typeof req.body.rawContent ===
                "string"
        ) {
            rawContent =
                req.body.rawContent;
        }

        if (!rawContent.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "rawContent is required.",
            });
        }

        const result =
            await importContent(
                technologyId,
                rawContent,
            );

        return res.status(201).json({
            success: true,
            message:
                "Content imported successfully.",
            data: result,
        });
    } catch (error) {
        console.error(
            "[CONTENT IMPORT ERROR]",
            error,
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to import content.";

        return res.status(500).json({
            success: false,
            message,
        });
    }
}