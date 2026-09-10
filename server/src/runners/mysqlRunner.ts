// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: server/src/runners/mysqlRunner.ts
// DATE: 2026-08-31
// =====================================================

import {
    executeQuery,
    type MySQLConfig,
  } from "../services/databaseService";
  
  export interface MySQLRunnerRequest {
    config: MySQLConfig;
    query: string;
  }
  
  export async function runMySQL(
    request: MySQLRunnerRequest,
  ) {
    if (
      !request.config ||
      !request.query?.trim()
    ) {
      return {
        success: false,
        rows: [],
        fields: [],
        affectedRows: 0,
        error:
          "MySQL configuration and query are required.",
      };
    }
  
    return executeQuery(
      request.config,
      request.query,
    );
  }