// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 13
// FILE: server/src/routes/workspaceRoutes.ts
// DATE: 2026-08-31
// =====================================================

import {
    Router,
  } from "express";
  
  import {
    databasePool,
  } from "../config/database";
  
  const router = Router();
  
  router.get(
    "/:projectId",
    async (request, response) => {
      try {
        const [rows] =
          await databasePool.query(
            `
            SELECT
              project_id,
              file_id,
              name,
              path,
              content,
              language,
              updated_at
            FROM workspace_files
            WHERE project_id = ?
            ORDER BY path ASC
            `,
            [request.params.projectId],
          );
  
        response.json({
          success: true,
          workspace: {
            projectId: request.params.projectId,
            files: rows,
            folders: [],
            updatedAt: new Date().toISOString(),
          },
        });
      } catch {
        response.status(500).json({
          success: false,
          error:
            "Unable to load workspace.",
        });
      }
    },
  );
  
  router.post(
    "/",
    async (request, response) => {
      const workspace = request.body as {
        projectId?: string;
        files?: Array<{
          id: string;
          name: string;
          path: string;
          content: string;
          language?: string;
        }>;
      };
  
      if (!workspace.projectId) {
        response.status(400).json({
          success: false,
          error: "projectId is required.",
        });
        return;
      }
  
      try {
        for (const file of workspace.files ?? []) {
          await databasePool.execute(
            `
            INSERT INTO workspace_files
              (
                file_id,
                project_id,
                name,
                path,
                content,
                language
              )
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              path = VALUES(path),
              content = VALUES(content),
              language = VALUES(language)
            `,
            [
              file.id,
              workspace.projectId,
              file.name,
              file.path,
              file.content,
              file.language ?? null,
            ],
          );
        }
  
        response.json({
          success: true,
          workspace: {
            ...workspace,
            updatedAt:
              new Date().toISOString(),
          },
        });
      } catch {
        response.status(500).json({
          success: false,
          error:
            "Unable to save workspace.",
        });
      }
    },
  );
  
  export default router;