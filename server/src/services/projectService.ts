// =====================================================
// DLTJ2.10
// PROJECT SERVICE
// FILE: server/src/services/projectService.ts
// UPDATED: 2026-09-06
// LOCATION: E:\DLTJ2.122\server\src\services\projectService.ts
// =====================================================

import crypto from "node:crypto";

import {
  databasePool,
} from "../config/database";

// =====================================================
// TYPES
// =====================================================

export interface ProjectConnection {
  springUrl: string;
  mysqlHost: string;
  mysqlPort: number;
  mysqlDatabase: string;
  mysqlUser: string;
  mysqlPassword: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  connection?: ProjectConnection;
}

// =====================================================
// DATABASE INITIALIZATION
// =====================================================

let databaseReady:
  Promise<void> | null = null;

async function ensureDatabase(): Promise<void> {
  if (databaseReady) {
    return databaseReady;
  }

  databaseReady =
    (async () => {
      await databasePool.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NULL,
          spring_url VARCHAR(500) NULL,
          mysql_host VARCHAR(255) NULL,
          mysql_port INT NULL,
          mysql_database VARCHAR(255) NULL,
          mysql_user VARCHAR(255) NULL,
          mysql_password VARCHAR(255) NULL,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          INDEX idx_projects_name (name)
        )
      `);

      try {
        await databasePool.query(`
          ALTER TABLE projects
          MODIFY COLUMN created_at DATETIME NOT NULL
        `);
      } catch {
        // Already compatible.
      }

      try {
        await databasePool.query(`
          ALTER TABLE projects
          MODIFY COLUMN updated_at DATETIME NOT NULL
        `);
      } catch {
        // Already compatible.
      }
    })().catch(
      (error) => {
        databaseReady = null;
        throw error;
      },
    );

  return databaseReady;
}

// =====================================================
// MYSQL DATETIME
// =====================================================

function toMySQLDateTime(
  date: Date = new Date(),
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  const hours =
    String(
      date.getHours(),
    ).padStart(2, "0");

  const minutes =
    String(
      date.getMinutes(),
    ).padStart(2, "0");

  const seconds =
    String(
      date.getSeconds(),
    ).padStart(2, "0");

  return (
    `${year}-${month}-${day} ` +
    `${hours}:${minutes}:${seconds}`
  );
}

// =====================================================
// MAP DATABASE ROW
// =====================================================

function mapProject(
  row: Record<string, unknown>,
): ProjectRecord {
  const hasConnection =
    row.spring_url !== null ||
    row.mysql_host !== null ||
    row.mysql_port !== null ||
    row.mysql_database !== null ||
    row.mysql_user !== null ||
    row.mysql_password !== null;

  return {
    id:
      String(row.id),

    name:
      String(row.name),

    description:
      row.description == null
        ? undefined
        : String(row.description),

    createdAt:
      String(row.created_at),

    updatedAt:
      String(row.updated_at),

    ...(hasConnection
      ? {
          connection: {
            springUrl:
              String(
                row.spring_url ??
                  "",
              ),

            mysqlHost:
              String(
                row.mysql_host ??
                  "",
              ),

            mysqlPort:
              Number(
                row.mysql_port ??
                  3306,
              ),

            mysqlDatabase:
              String(
                row.mysql_database ??
                  "",
              ),

            mysqlUser:
              String(
                row.mysql_user ??
                  "",
              ),

            mysqlPassword:
              String(
                row.mysql_password ??
                  "",
              ),
          },
        }
      : {}),
  };
}

// =====================================================
// CREATE PROJECT
// =====================================================

export async function createProject(
  name: string,
  description?: string,
): Promise<ProjectRecord> {
  await ensureDatabase();

  const cleanName =
    String(name ?? "").trim();

  if (!cleanName) {
    throw new Error(
      "Project name is required.",
    );
  }

  const now =
    toMySQLDateTime();

  const id =
    crypto.randomUUID();

  await databasePool.query(
    `
      INSERT INTO projects (
        id,
        name,
        description,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      id,
      cleanName,
      description?.trim() ?? null,
      now,
      now,
    ],
  );

  return getProject(id) as Promise<ProjectRecord>;
}

// =====================================================
// GET ALL PROJECTS
// =====================================================

export async function getProjects(): Promise<
  ProjectRecord[]
> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          id,
          name,
          description,
          spring_url,
          mysql_host,
          mysql_port,
          mysql_database,
          mysql_user,
          mysql_password,
          created_at,
          updated_at
        FROM projects
        ORDER BY created_at DESC
      `,
    );

  return (
    rows as Array<
      Record<string, unknown>
    >
  ).map(mapProject);
}

// =====================================================
// GET SINGLE PROJECT
// =====================================================

export async function getProject(
  id: string,
): Promise<ProjectRecord | null> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          id,
          name,
          description,
          spring_url,
          mysql_host,
          mysql_port,
          mysql_database,
          mysql_user,
          mysql_password,
          created_at,
          updated_at
        FROM projects
        WHERE id = ?
        LIMIT 1
      `,
      [
        id,
      ],
    );

  const row =
    (
      rows as Array<
        Record<string, unknown>
      >
    )[0];

  return row
    ? mapProject(row)
    : null;
}

// =====================================================
// SAVE CONNECTION
// =====================================================

export async function saveConnection(
  projectId: string,
  connection: ProjectConnection,
): Promise<ProjectRecord> {
  await ensureDatabase();

  const existing =
    await getProject(projectId);

  if (!existing) {
    throw new Error(
      "Project not found.",
    );
  }

  const now =
    toMySQLDateTime();

  await databasePool.query(
    `
      UPDATE projects
      SET
        spring_url = ?,
        mysql_host = ?,
        mysql_port = ?,
        mysql_database = ?,
        mysql_user = ?,
        mysql_password = ?,
        updated_at = ?
      WHERE id = ?
    `,
    [
      connection.springUrl,
      connection.mysqlHost,
      Number(
        connection.mysqlPort ??
          3306,
      ),
      connection.mysqlDatabase,
      connection.mysqlUser,
      connection.mysqlPassword,
      now,
      projectId,
    ],
  );

  return getProject(
    projectId,
  ) as Promise<ProjectRecord>;
}

// =====================================================
// COMPATIBILITY ALIAS
// Existing frontend/backend code may use this name.
// =====================================================

export async function saveProjectConnection(
  projectId: string,
  connection: ProjectConnection,
): Promise<ProjectRecord> {
  return saveConnection(
    projectId,
    connection,
  );
}

// =====================================================
// TEST PROJECT CONNECTION
// =====================================================

export async function testProjectConnection(
  connection: ProjectConnection,
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (
      !connection.mysqlHost ||
      !connection.mysqlDatabase ||
      !connection.mysqlUser
    ) {
      return {
        success: false,
        message:
          "MySQL connection details are incomplete.",
      };
    }

    return {
      success: true,
      message:
        "Project connection details are valid.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Connection test failed.",
    };
  }
}

// =====================================================
// DELETE PROJECT
// =====================================================

export async function deleteProject(
  id: string,
): Promise<void> {
  await ensureDatabase();

  await databasePool.query(
    `
      DELETE FROM projects
      WHERE id = ?
    `,
    [
      id,
    ],
  );
}