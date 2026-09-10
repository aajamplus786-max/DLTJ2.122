// =====================================================
// DLTJ2.1
// WORKING TOOL â€” BATCH 12
// FILE: server/src/controllers/projectController.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
  } from "express";
  
  import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    saveConnection,
    type ProjectConnection,
  } from "../services/projectService";
  
  export function createProjectController(
    request: Request,
    response: Response,
  ) {
    const {
      name,
      description,
    } = request.body as {
      name?: string;
      description?: string;
    };
  
    if (!name?.trim()) {
      response.status(400).json({
        success: false,
        error: "Project name is required.",
      });
      return;
    }
  
    const project = createProject(
      name,
      description ?? "",
    );
  
    response.status(201).json({
      success: true,
      project,
    });
  }
  
  export function listProjectsController(
    _request: Request,
    response: Response,
  ) {
    response.json({
      success: true,
      projects: getProjects(),
    });
  }
  
  export function getProjectController(
    request: Request,
    response: Response,
  ) {
    const project = getProject(
      String(request.params.id),
    );
  
    if (!project) {
      response.status(404).json({
        success: false,
        error: "Project not found.",
      });
      return;
    }
  
    response.json({
      success: true,
      project,
    });
  }
  
  export function deleteProjectController(
    request: Request,
    response: Response,
  ) {
    const deleted = deleteProject(
      String(request.params.id),
    );
  
    if (!deleted) {
      response.status(404).json({
        success: false,
        error: "Project not found.",
      });
      return;
    }
  
    response.json({
      success: true,
      message: "Project deleted.",
    });
  }
  
  export function saveConnectionController(
    request: Request,
    response: Response,
  ) {
    const project = saveConnection(
      String(request.params.id),
      request.body as ProjectConnection,
    );
  
    if (!project) {
      response.status(404).json({
        success: false,
        error: "Project not found.",
      });
      return;
    }
  
    response.json({
      success: true,
      project,
    });
  }
  
  export async function testConnectionController(
    request: Request,
    response: Response,
  ) {
    const connection =
      request.body as ProjectConnection;
  
    if (
      !connection?.mysqlHost ||
      !connection?.mysqlUser
    ) {
      response.status(400).json({
        success: false,
        message: "MySQL connection details are incomplete.",
      });
      return;
    }
  
    response.json({
      success: true,
      message:
        "Connection configuration received successfully.",
    });
  }
