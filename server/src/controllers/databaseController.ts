// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: server/src/controllers/databaseController.ts
// DATE: 2026-08-31
// =====================================================

import type {
    Request,
    Response,
  } from "express";
  
  import {
    connectMySQL,
    executeQuery,
    getDatabases,
    getTables,
  } from "../services/databaseService";
  
  export async function connectDatabase(
    request: Request,
    response: Response,
  ) {
    const result =
      await connectMySQL(request.body);
  
    response.json(result);
  }
  
  export async function runDatabaseQuery(
    request: Request,
    response: Response,
  ) {
    const { config, query } =
      request.body;
  
    if (
      !config ||
      typeof query !== "string" ||
      !query.trim()
    ) {
      response.status(400).json({
        success: false,
        error: "Connection config and query are required.",
      });
  
      return;
    }
  
    const result =
      await executeQuery(
        config,
        query,
      );
  
    response
      .status(result.success ? 200 : 400)
      .json(result);
  }
  
  export async function listDatabases(
    request: Request,
    response: Response,
  ) {
    const result =
      await getDatabases(request.body);
  
    response.json(result);
  }
  
  export async function listTables(
    request: Request,
    response: Response,
  ) {
    const {
      config,
      database,
    } = request.body;
  
    const result =
      await getTables(
        config,
        database,
      );
  
    response.json(result);
  }