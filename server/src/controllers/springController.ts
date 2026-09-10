// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: server/src/controllers/springController.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
  } from "express";
  
  import {
    createProject,
    getProject,
    startProject,
    stopProject,
  } from "../services/springService";
  
  export async function createSpringProject(
    request: Request,
    response: Response,
  ) {
    const {
      name,
      path,
    } = request.body;
  
    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      response.status(400).json({
        success: false,
        error: "Project name is required.",
      });
  
      return;
    }
  
    const result =
      await createProject(
        name,
        path,
      );
  
    response
      .status(result.success ? 200 : 400)
      .json(result);
  }
  
  export async function getSpringProject(
    request: Request,
    response: Response,
  ) {
    const result =
      await getProject(
        request.body.projectId,
      );
  
    response.json(result);
  }
  
  export async function startSpringProject(
    request: Request,
    response: Response,
  ) {
    const result =
      await startProject(
        request.body.projectId,
      );
  
    response
      .status(result.success ? 200 : 400)
      .json(result);
  }
  
  export async function stopSpringProject(
    request: Request,
    response: Response,
  ) {
    const result =
      await stopProject(
        request.body.projectId,
      );
  
    response.json(result);
  }