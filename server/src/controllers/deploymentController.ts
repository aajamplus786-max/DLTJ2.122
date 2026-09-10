// =====================================================
// DLTJ2.1
// WORKING TOOL â€” BATCH 15
// FILE: server/src/controllers/deploymentController.ts
// DATE: 2026-08-31
// =====================================================

import type {
  Request,
  Response,
} from "express";

import {
  cancelDeployment,
  createDeployment,
  getDeploymentStatus,
} from "../services/deploymentService";

// =====================================================
// CREATE DEPLOYMENT
// =====================================================

export async function createDeploymentController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result =
      await createDeployment(
        req.body,
      );

    res.status(
      result.success ? 200 : 400,
    ).json(result);
  } catch {
    res.status(500).json({
      success: false,
      message:
        "Unable to create deployment.",
    });
  }
}

// =====================================================
// STATUS
// =====================================================

export async function getDeploymentStatusController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const deploymentId =
      String(req.params.deploymentId);

    const result =
      await getDeploymentStatus(
        deploymentId,
      );

    if (!result) {
      res.status(404).json({
        success: false,
        message:
          "Deployment not found.",
      });

      return;
    }

    res.json(result);
  } catch {
    res.status(500).json({
      success: false,
      message:
        "Unable to retrieve deployment status.",
    });
  }
}

// =====================================================
// CANCEL
// =====================================================

export async function cancelDeploymentController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const deploymentId =
      String(req.params.deploymentId);

    const result =
      await cancelDeployment(
        deploymentId,
      );

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch {
    res.status(500).json({
      success: false,
      message:
        "Unable to cancel deployment.",
    });
  }
}
