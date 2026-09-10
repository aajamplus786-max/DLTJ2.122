// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 â€” FILE MANAGEMENT BACKEND
// FILE: server/src/controllers/fileController.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
  } from "express";
  
  import {
    createFile,
    getFile,
    getWorkspaceFiles,
    updateFile,
    renameFile,
    deleteFile,
    createFolder,
    getFolder,
    getWorkspaceFolders,
    renameFolder,
    deleteFolder,
    searchFiles,
  } from "../services/fileService";
  
  // =====================================================
  // CREATE FILE
  // =====================================================
  
  export function createFileController(
    req: Request,
    res: Response
  ): void {
    try {
      const {
        workspaceId,
        parentId,
        name,
        content,
        language,
      } = req.body;
  
      if (
        !workspaceId ||
        !name
      ) {
        res.status(400).json({
          success: false,
          message:
            "workspaceId and name are required.",
        });
  
        return;
      }
  
      const file =
        createFile({
          workspaceId,
          parentId:
            parentId ?? null,
          name,
          content,
          language,
        });
  
      res.status(201).json({
        success: true,
        file,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to create file.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }
  
  // =====================================================
  // GET FILE
  // =====================================================
  
  export function getFileController(
    req: Request,
    res: Response
  ): void {
    const file =
      getFile(
        String(req.params.fileId)
      );
  
    if (!file) {
      res.status(404).json({
        success: false,
        message:
          "File not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      file,
    });
  }
  
  // =====================================================
  // GET WORKSPACE FILES
  // =====================================================
  
  export function getWorkspaceFilesController(
    req: Request,
    res: Response
  ): void {
    const files =
      getWorkspaceFiles(
        String(req.params.workspaceId)
      );
  
    res.json({
      success: true,
      files,
    });
  }
  
  // =====================================================
  // UPDATE FILE
  // =====================================================
  
  export function updateFileController(
    req: Request,
    res: Response
  ): void {
    const file =
      updateFile(
        String(req.params.fileId),
        req.body
      );
  
    if (!file) {
      res.status(404).json({
        success: false,
        message:
          "File not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      file,
    });
  }
  
  // =====================================================
  // RENAME FILE
  // =====================================================
  
  export function renameFileController(
    req: Request,
    res: Response
  ): void {
    const file =
      renameFile(
        String(req.params.fileId),
        req.body.name
      );
  
    if (!file) {
      res.status(404).json({
        success: false,
        message:
          "File not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      file,
    });
  }
  
  // =====================================================
  // DELETE FILE
  // =====================================================
  
  export function deleteFileController(
    req: Request,
    res: Response
  ): void {
    const deleted =
      deleteFile(
        String(req.params.fileId)
      );
  
    if (!deleted) {
      res.status(404).json({
        success: false,
        message:
          "File not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      message:
        "File deleted successfully.",
    });
  }
  
  // =====================================================
  // CREATE FOLDER
  // =====================================================
  
  export function createFolderController(
    req: Request,
    res: Response
  ): void {
    const {
      workspaceId,
      parentId,
      name,
    } = req.body;
  
    if (
      !workspaceId ||
      !name
    ) {
      res.status(400).json({
        success: false,
        message:
          "workspaceId and name are required.",
      });
  
      return;
    }
  
    const folder =
      createFolder(
        workspaceId,
        name,
        parentId ?? null
      );
  
    res.status(201).json({
      success: true,
      folder,
    });
  }
  
  // =====================================================
  // GET FOLDER
  // =====================================================
  
  export function getFolderController(
    req: Request,
    res: Response
  ): void {
    const folder =
      getFolder(
        String(req.params.folderId)
      );
  
    if (!folder) {
      res.status(404).json({
        success: false,
        message:
          "Folder not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      folder,
    });
  }
  
  // =====================================================
  // GET WORKSPACE FOLDERS
  // =====================================================
  
  export function getWorkspaceFoldersController(
    req: Request,
    res: Response
  ): void {
    const folders =
      getWorkspaceFolders(
        String(req.params.workspaceId)
      );
  
    res.json({
      success: true,
      folders,
    });
  }
  
  // =====================================================
  // RENAME FOLDER
  // =====================================================
  
  export function renameFolderController(
    req: Request,
    res: Response
  ): void {
    const folder =
      renameFolder(
        String(req.params.folderId),
        req.body.name
      );
  
    if (!folder) {
      res.status(404).json({
        success: false,
        message:
          "Folder not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      folder,
    });
  }
  
  // =====================================================
  // DELETE FOLDER
  // =====================================================
  
  export function deleteFolderController(
    req: Request,
    res: Response
  ): void {
    const deleted =
      deleteFolder(
        String(req.params.folderId)
      );
  
    if (!deleted) {
      res.status(404).json({
        success: false,
        message:
          "Folder not found.",
      });
  
      return;
    }
  
    res.json({
      success: true,
      message:
        "Folder deleted successfully.",
    });
  }
  
  // =====================================================
  // SEARCH
  // =====================================================
  
  export function searchFilesController(
    req: Request,
    res: Response
  ): void {
    const files =
      searchFiles(
        String(req.params.workspaceId),
        String(
          req.query.q ?? ""
        )
      );
  
    res.json({
      success: true,
      files,
    });
  }
