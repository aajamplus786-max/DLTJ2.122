// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 10
// FILE: server/src/services/databaseService.ts
// DATE: 2026-08-31
// =====================================================

import type {
    ConnectionOptions,
  } from "mysql2/promise";
  
  import mysql from "mysql2/promise";
  
  export interface MySQLConfig {
    host: string;
    port?: number;
    database?: string;
    username: string;
    password: string;
  }
  
  function createConfig(
    config: MySQLConfig,
  ): ConnectionOptions {
    return {
      host: config.host,
      port: config.port ?? 3306,
      user: config.username,
      password: config.password,
      database: config.database || undefined,
      connectTimeout: 5000,
    };
  }
  
  export async function connectMySQL(
    config: MySQLConfig,
  ) {
    try {
      const connection =
        await mysql.createConnection(
          createConfig(config),
        );
  
      await connection.ping();
      await connection.end();
  
      return {
        success: true,
        message: "MySQL connection successful.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "MySQL connection failed.",
      };
    }
  }
  
  export async function executeQuery(
    config: MySQLConfig,
    query: string,
  ) {
    let connection:
      | mysql.Connection
      | undefined;
  
    try {
      connection =
        await mysql.createConnection(
          createConfig(config),
        );
  
      const [result, fields] =
        await connection.query(
          query,
        );
  
      const rows =
        Array.isArray(result)
          ? result
          : [];
  
      const affectedRows =
        !Array.isArray(result) &&
        "affectedRows" in result
          ? Number(
              result.affectedRows,
            )
          : 0;
  
      return {
        success: true,
        rows: rows as Record<
          string,
          unknown
        >[],
        fields: Array.isArray(fields)
          ? fields
          : [],
        affectedRows,
      };
    } catch (error) {
      return {
        success: false,
        rows: [],
        fields: [],
        affectedRows: 0,
        error:
          error instanceof Error
            ? error.message
            : "Query execution failed.",
      };
    } finally {
      await connection?.end();
    }
  }
  
  export async function getDatabases(
    config: MySQLConfig,
  ) {
    const result =
      await executeQuery(
        {
          ...config,
          database: undefined,
        },
        "SHOW DATABASES",
      );
  
    return {
      success: result.success,
      databases: result.rows
        .map((row) =>
          String(
            row.Database ?? "",
          ),
        )
        .filter(Boolean),
      error: result.error,
    };
  }
  
  export async function getTables(
    config: MySQLConfig,
    database: string,
  ) {
    const result =
      await executeQuery(
        {
          ...config,
          database,
        },
        "SHOW TABLES",
      );
  
    return {
      success: result.success,
      tables: result.rows.map(
        (row) =>
          String(
            Object.values(row)[0] ?? "",
          ),
      ),
      error: result.error,
    };
  }