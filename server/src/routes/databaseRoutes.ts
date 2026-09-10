// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: server/src/routes/databaseRoutes.ts
// DATE: 2026-08-31
// =====================================================

import {
    Router,
  } from "express";
  
  import {
    testConnectionController,
  } from "../controllers/projectController";
  
  const router = Router();
  
  router.post(
    "/test",
    testConnectionController,
  );
  
  export default router;