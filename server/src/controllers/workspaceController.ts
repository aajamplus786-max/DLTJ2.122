// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 â€” FILE MANAGEMENT BACKEND
// FILE: server/src/controllers/workspaceController.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
  } from "express";
  
  import {
    createWorkspace,
    getWorkspace,
    getWorkspaceContent,
    createDefaultWorkspaceFile,
    addFolder,
    deleteWorkspace,
    refreshWorkspace,
  } from "../services/workspaceService";
  
  // =====================================================
  // CREATE WORKSPACE
  // =====================================================
  
  export function createWorkspaceController(
    req: Request,
    res: Response
  ): void {
    const {
      technologyId,
    } = req.body;
  
    if (!technologyId) {
      res.status(400).json({
        success: false,
        message:
          "technologyId is required.",
      });
  
      return;
    }
  
    const workspace =
      createWorkspace(
        technologyId
      );
  
    res.status(201).json({
      success: true,
      workspace,
    });
  }
  
  // =====================================================
  // GET WORKSPACE
  // =====================================================
  
  export function getWorkspaceController(
    req: Request,
    res: Response
  ): void {
    const workspace =
      getWorkspace(
        String(req.params.workspaceId)
      );
  
    if (!workspace) {
      res.status(404).json({
        success: false,
        message:
          "Workspace not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      workspace,
    });
  }
  
  // =====================================================
  // GET CONTENT
  // =====================================================
  
  export function getWorkspaceContentController(
    req: Request,
    res: Response
  ): void {
    const content =
      getWorkspaceContent(
        String(req.params.workspaceId)
      );
  
    if (!content) {
      res.status(404).json({
        success: false,
        message:
          "Workspace not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      ...content,
    });
  }
  
  // =====================================================
  // DEFAULT FILE
  // =====================================================
  
  export function createDefaultFileController(
    req: Request,
    res: Response
  ): void {
    const file =
      createDefaultWorkspaceFile(
        String(req.params.workspaceId)
      );
  
    if (!file) {
      res.status(404).json({
        success: false,
        message:
          "Workspace not found.",
      });
  
      return;
    }
  
    res.status(201).json({
      success: true,
      file,
    });
  }
  
  // =====================================================
  // CREATE FOLDER
  // =====================================================
  
  export function createWorkspaceFolderController(
    req: Request,
    res: Response
  ): void {
    const {
      name,
      parentId,
    } = req.body;
  
    if (!name) {
      res.status(400).json({
        success: false,
        message:
          "Folder name is required.",
      });
  
      return;
    }
  
    const folder =
      addFolder(
        String(req.params.workspaceId),
        name,
        parentId ?? null
      );
  
    if (!folder) {
      res.status(404).json({
        success: false,
        message:
          "Workspace not found.",
      });
  
      return;
    }
  
    res.status(201).json({
      success: true,
      folder,
    });
  }
  
  // =====================================================
  // REFRESH
  // =====================================================
  
  export function refreshWorkspaceController(
    req: Request,
    res: Response
  ): void {
    const workspace =
      refreshWorkspace(
        String(req.params.workspaceId)
      );
  
    if (!workspace) {
      res.status(404).json({
        success: false,
        message:
          "Workspace not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      workspace,
    });
  }
  
  // =====================================================
  // DELETE
  // =====================================================
  
  export function deleteWorkspaceController(
    req: Request,
    res: Response
  ): void {
    const deleted =
      deleteWorkspace(
        String(req.params.workspaceId)
      );
  
    if (!deleted) {
      res.status(404).json({
        success: false,
        message:
          "Workspace not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      message:
        "Workspace deleted successfully.",
    });
  }
