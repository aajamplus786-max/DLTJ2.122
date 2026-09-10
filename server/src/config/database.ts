// =====================================================
// DLTJ2.9
// DATABASE CONFIGURATION
// FILE: server/src/config/database.ts
// =====================================================

import mysql from "mysql2/promise";

import {
  env,
} from "./env";

// =====================================================
// MYSQL CONNECTION POOL
// =====================================================

export const databasePool =
  mysql.createPool({
    host:
      env.databaseHost,

    port:
      env.databasePort,

    user:
      env.databaseUser,

    password:
      env.databasePassword,

    database:
      env.databaseName,

    waitForConnections:
      true,

    connectionLimit:
      10,

    queueLimit:
      0,
  });

// =====================================================
// TEST DATABASE CONNECTION
// =====================================================

export async function testDatabaseConnection(): Promise<boolean> {
  const connection =
    await databasePool.getConnection();

  try {
    await connection.ping();

    return true;
  } finally {
    connection.release();
  }
}