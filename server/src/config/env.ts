// =====================================================
// DLTJ2.10
// DATABASE / SERVER ENVIRONMENT CONFIG
// FILE: server/src/config/env.ts
// =====================================================

export const env = {

  // ===================================================
  // SERVER
  // ===================================================

  port: Number(
    process.env.PORT ?? 3000,
  ),

  // ===================================================
  // MYSQL DATABASE
  // ===================================================

  databaseHost:
    process.env.DB_HOST ?? "localhost",

  databasePort:
    Number(
      process.env.DB_PORT ?? 3306,
    ),

  databaseUser:
    process.env.DB_USER ?? "root",

  databasePassword:
    process.env.DB_PASSWORD ?? "",

  databaseName:
    process.env.DB_NAME ?? "dltj210",
};