// =========================================================
// FILE: server/src/controllers/technologyContentController.ts
// PROJECT: DLTJ2.10 Dynamic Learning System
// DATE: 2026-09-07
// LOCATION: server/src/controllers
// =========================================================

import { Request, Response } from "express";

import {
    getAllTechnologies,
    getTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology,
    reorderTechnologies,
} from "../services/technologyContentService";

// =========================================================
// GET ALL TECHNOLOGIES
// =========================================================

export async function getTechnologies(
    _req: Request,
    res: Response
) {
    try {
        const technologies =
            await getAllTechnologies(false);

        return res.status(200).json({
            success: true,
            data: technologies,
        });
    } catch (error) {
        console.error(
            "[GET TECHNOLOGIES ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch technologies",
        });
    }
}

// =========================================================
// GET SINGLE TECHNOLOGY
// =========================================================

export async function getTechnology(
    req: Request,
    res: Response
) {
    try {
        const id = String(req.params.id);

        const technology =
            await getTechnologyById(id, false);

        if (!technology) {
            return res.status(404).json({
                success: false,
                message:
                    "Technology not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: technology,
        });
    } catch (error) {
        console.error(
            "[GET TECHNOLOGY ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch technology",
        });
    }
}

// =========================================================
// CREATE TECHNOLOGY
// =========================================================

export async function createTechnologyController(
    req: Request,
    res: Response
) {
    try {
        const {
            name,
            section,
            displayOrder,
            isActive,
        } = req.body;

        if (
            !name ||
            String(name).trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Technology name is required",
            });
        }

        const technology =
            await createTechnology({
                name: String(name).trim(),

                section:
                    section !== undefined &&
                    section !== null &&
                    String(section).trim() !== ""
                        ? String(section).trim()
                        : "General",

                displayOrder:
                    displayOrder !== undefined &&
                    displayOrder !== null &&
                    Number.isFinite(
                        Number(displayOrder)
                    )
                        ? Number(displayOrder)
                        : 0,

                isActive:
                    isActive === undefined
                        ? true
                        : Boolean(isActive),
            });

        return res.status(201).json({
            success: true,
            data: technology,
            message:
                "Technology created successfully",
        });
    } catch (error) {
        console.error(
            "[CREATE TECHNOLOGY ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create technology",
        });
    }
}

// =========================================================
// UPDATE TECHNOLOGY
// =========================================================

export async function updateTechnologyController(
    req: Request,
    res: Response
) {
    try {
        const id = String(req.params.id);

        const {
            name,
            section,
            displayOrder,
            isActive,
        } = req.body;

        if (
            !name ||
            String(name).trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Technology name is required",
            });
        }

        const technology =
            await updateTechnology(id, {
                name: String(name).trim(),

                section:
                    section !== undefined &&
                    section !== null
                        ? String(section).trim()
                        : "General",

                displayOrder:
                    displayOrder !== undefined &&
                    displayOrder !== null &&
                    Number.isFinite(
                        Number(displayOrder)
                    )
                        ? Number(displayOrder)
                        : 0,

                isActive:
                    isActive === undefined
                        ? true
                        : Boolean(isActive),
            });

        if (!technology) {
            return res.status(404).json({
                success: false,
                message:
                    "Technology not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: technology,
            message:
                "Technology updated successfully",
        });
    } catch (error) {
        console.error(
            "[UPDATE TECHNOLOGY ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update technology",
        });
    }
}

// =========================================================
// DELETE TECHNOLOGY
// =========================================================

export async function deleteTechnologyController(
    req: Request,
    res: Response
) {
    try {
        const id = String(req.params.id);

        const deleted =
            await deleteTechnology(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message:
                    "Technology not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Technology deleted successfully",
        });
    } catch (error) {
        console.error(
            "[DELETE TECHNOLOGY ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete technology",
        });
    }
}

// =========================================================
// REORDER TECHNOLOGIES
// Service expects ordered string[] of technology IDs.
// =========================================================

export async function reorderTechnologyController(
    req: Request,
    res: Response
) {
    try {
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message:
                    "items must be an array",
            });
        }

        const orderedIds = items
            .map((item) => {
                if (
                    typeof item === "string"
                ) {
                    return item;
                }

                return item?.id
                    ? String(item.id)
                    : "";
            })
            .filter(
                (id: string) =>
                    id.trim() !== ""
            );

        await reorderTechnologies(
            orderedIds
        );

        return res.status(200).json({
            success: true,
            message:
                "Technologies reordered successfully",
        });
    } catch (error) {
        console.error(
            "[REORDER TECHNOLOGIES ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to reorder technologies",
        });
    }
}
