// =====================================================
// DLTJ2.1
// WORKING TOOL â€” BATCH 14
// FILE: server/src/controllers/shareController.ts
// DATE: 2026-08-31
// =====================================================

import type {
  Request,
  Response,
} from "express";

import {
  createShare,
  getProjectShares,
  revokeShare,
} from "../services/shareService";

export async function createShareController(
  request: Request,
  response: Response,
) {
  try {
    const {
      projectId,
      permission,
    } = request.body as {
      projectId?: unknown;
      permission?: unknown;
    };

    if (
      typeof projectId !==
        "string" ||
      !projectId.trim()
    ) {
      response.status(400).json({
        success: false,
        message:
          "Project ID is required.",
      });

      return;
    }

    if (
      permission !== "view" &&
      permission !== "edit"
    ) {
      response.status(400).json({
        success: false,
        message:
          "Invalid share permission.",
      });

      return;
    }

    const result =
      await createShare(
        projectId.trim(),
        permission,
      );

    response
      .status(
        result.success
          ? 201
          : 400,
      )
      .json(result);
  } catch {
    response.status(500).json({
      success: false,
      message:
        "Unable to create share link.",
    });
  }
}

export async function getProjectSharesController(
  request: Request,
  response: Response,
) {
  try {
    const projectId =
      String(request.params.projectId);

    if (!projectId) {
      response.status(400).json({
        success: false,
        message:
          "Project ID is required.",
      });

      return;
    }

    const result =
      await getProjectShares(
        projectId,
      );

    response.json(result);
  } catch {
    response.status(500).json({
      success: false,
      message:
        "Unable to load share links.",
    });
  }
}

export async function revokeShareController(
  request: Request,
  response: Response,
) {
  try {
    const shareId =
      String(request.params.shareId);

    if (!shareId) {
      response.status(400).json({
        success: false,
        message:
          "Share ID is required.",
      });

      return;
    }

    const result =
      await revokeShare(
        shareId,
      );

    response
      .status(
        result.success
          ? 200
          : 404,
      )
      .json(result);
  } catch {
    response.status(500).json({
      success: false,
      message:
        "Unable to revoke share link.",
    });
  }
}
