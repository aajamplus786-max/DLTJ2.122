// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: server/src/routes/springRoutes.ts
// DATE: 2026-08-31
// =====================================================

import {
    Router,
  } from "express";
  
  const router = Router();
  
  router.get(
    "/health",
    async (_request, response) => {
      response.json({
        success: true,
        service: "Spring Connection",
        status: "ready",
      });
    },
  );
  
  export default router;