// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: src/services/databaseService.ts
// DATE: 2026-08-31
// =====================================================

import type { MySQLConnectionConfig } from "../components/mysql/MySQLConnection";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export interface DatabaseQueryResponse {
  success: boolean;
  rows: Record<string, unknown>[];
  fields: unknown[];
  affectedRows: number;
  error?: string;
  code?: string;
}

async function request<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const response = await fetch(
    `${API_BASE}${path}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(
      "Database request failed.",
    );
  }

  return data;
}

export async function testMySQLConnection(
  config: MySQLConnectionConfig,
) {
  return request<{
    success: boolean;
    message: string;
  }>("/database/connect", config);
}

export async function executeMySQLQuery(
  config: MySQLConnectionConfig,
  query: string,
) {
  return request<DatabaseQueryResponse>(
    "/database/query",
    {
      config,
      query,
    },
  );
}

export async function getMySQLDatabases(
  config: MySQLConnectionConfig,
) {
  return request<{
    success: boolean;
    databases: string[];
  }>("/database/databases", config);
}

export async function getMySQLTables(
  config: MySQLConnectionConfig,
  database: string,
) {
  return request<{
    success: boolean;
    tables: string[];
  }>("/database/tables", {
    config,
    database,
  });
}