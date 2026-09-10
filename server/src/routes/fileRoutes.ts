// =====================================================
// DLTJ2.1
// WORKING TOOL
// BATCH 4 — FILE MANAGEMENT BACKEND
// FILE: server/src/routes/fileRoutes.ts
// DATE: 2026-08-31
// =====================================================

import {
    Router,
  } from "express";
  
  import {
    createFileController,
    getFileController,
    getWorkspaceFilesController,
    updateFileController,
    renameFileController,
    deleteFileController,
  
    createFolderController,
    getFolderController,
    getWorkspaceFoldersController,
    renameFolderController,
    deleteFolderController,
  
    searchFilesController,
  } from "../controllers/fileController";
  
  // =====================================================
  // ROUTER
  // =====================================================
  
  const router =
    Router();
  
  // =====================================================
  // FILES
  // =====================================================
  
  // Create file
  router.post(
    "/files",
    createFileController
  );
  
  // Get file
  router.get(
    "/files/:fileId",
    getFileController
  );
  
  // Get workspace files
  router.get(
    "/workspace/:workspaceId/files",
    getWorkspaceFilesController
  );
  
  // Update file
  router.put(
    "/files/:fileId",
    updateFileController
  );
  
  // Rename file
  router.patch(
    "/files/:fileId/rename",
    renameFileController
  );
  
  // Delete file
  router.delete(
    "/files/:fileId",
    deleteFileController
  );
  
  // Search files
  router.get(
    "/workspace/:workspaceId/files/search",
    searchFilesController
  );
  
  // =====================================================
  // FOLDERS
  // =====================================================
  
  // Create folder
  router.post(
    "/folders",
    createFolderController
  );
  
  // Get folder
  router.get(
    "/folders/:folderId",
    getFolderController
  );
  
  // Get workspace folders
  router.get(
    "/workspace/:workspaceId/folders",
    getWorkspaceFoldersController
  );
  
  // Rename folder
  router.patch(
    "/folders/:folderId/rename",
    renameFolderController
  );
  
  // Delete folder
  router.delete(
    "/folders/:folderId",
    deleteFolderController
  );
  
  // =====================================================
  // EXPORT
  // =====================================================
  
  export default router;