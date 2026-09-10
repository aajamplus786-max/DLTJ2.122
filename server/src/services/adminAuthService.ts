// =====================================================
// DLTJ2.10
// ADMIN AUTHENTICATION SERVICE
// FILE: server/src/services/adminAuthService.ts
// UPDATED: 2026-09-06
// LOCATION: E:\DLTJ2.122\server\src\services\adminAuthService.ts
// =====================================================

import crypto from "node:crypto";

import {
  databasePool,
} from "../config/database";

import type {
  Admin,
  AdminSession,
} from "../models/Admin";

// =====================================================
// CONSTANTS
// =====================================================

const ADMIN_SESSION_DURATION =
  1000 *
  60 *
  60 *
  24;

const ADMIN_USERNAME =
  "MyAathil";

const ADMIN_PASSWORD =
  "DLTJAdmin@2026";

// =====================================================
// MYSQL DATETIME HELPER
// =====================================================
// JavaScript:
//   2026-09-06T16:34:00.675Z
//
// MySQL DATETIME:
//   2026-09-06 16:34:00
//
// MySQL DATETIME columns should receive the second format.
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
// DATABASE INITIALIZATION
// =====================================================

let databaseReady:
  Promise<void> | null = null;

function ensureDatabase(): Promise<void> {
  if (databaseReady) {
    return databaseReady;
  }

  databaseReady =
    (async () => {
      // =================================================
      // ADMINS TABLE
      // =================================================

      await databasePool.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(100) PRIMARY KEY,
          username VARCHAR(150) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          created_at DATETIME NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE
        )
      `);

      // =================================================
      // MIGRATE EXISTING CREATED_AT COLUMN
      // =================================================
      // This fixes older versions where the column may have
      // been created with a different type.
      // =================================================

      try {
        await databasePool.query(`
          ALTER TABLE admins
          MODIFY COLUMN created_at DATETIME NOT NULL
        `);
      } catch (error) {
        console.warn(
          "[DLTJ2.10] admins.created_at migration skipped:",
          error instanceof Error
            ? error.message
            : error,
        );
      }

      // =================================================
      // ADMIN SESSIONS TABLE
      // =================================================

      await databasePool.query(`
        CREATE TABLE IF NOT EXISTS admin_sessions (
          token VARCHAR(255) PRIMARY KEY,
          admin_id VARCHAR(100) NOT NULL,
          username VARCHAR(150) NOT NULL,
          created_at BIGINT NOT NULL,
          expires_at BIGINT NOT NULL
        )
      `);

      // =================================================
      // FIND DEFAULT ADMIN
      // =================================================

      const [
        rows,
      ] =
        await databasePool.query(
          `
            SELECT id
            FROM admins
            WHERE username = ?
            LIMIT 1
          `,
          [
            ADMIN_USERNAME,
          ],
        );

      const existingAdmins =
        rows as Array<{
          id: string;
        }>;

      // =================================================
      // CREATE DEFAULT ADMIN
      // =================================================

      if (
        existingAdmins.length ===
        0
      ) {
        const passwordHash =
          await hashPassword(
            ADMIN_PASSWORD,
          );

        const createdAt =
          toMySQLDateTime();

        await databasePool.query(
          `
            INSERT INTO admins (
              id,
              username,
              password_hash,
              created_at,
              active
            )
            VALUES (?, ?, ?, ?, ?)
          `,
          [
            crypto.randomUUID(),
            ADMIN_USERNAME,
            passwordHash,
            createdAt,
            true,
          ],
        );

        console.info(
          "[DLTJ2.10] Default admin account initialized.",
        );
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
// PASSWORD HASH
// =====================================================

async function hashPassword(
  password: string,
): Promise<string> {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const salt =
        crypto
          .randomBytes(16)
          .toString("hex");

      crypto.scrypt(
        password,
        salt,
        64,
        (
          error,
          derivedKey,
        ) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(
            `${salt}:${derivedKey.toString(
              "hex",
            )}`,
          );
        },
      );
    },
  );
}

// =====================================================
// PASSWORD VERIFY
// =====================================================

async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [
    salt,
    hash,
  ] =
    storedHash.split(":");

  if (
    !salt ||
    !hash
  ) {
    return false;
  }

  return new Promise(
    (
      resolve,
      reject,
    ) => {
      crypto.scrypt(
        password,
        salt,
        64,
        (
          error,
          derivedKey,
        ) => {
          if (error) {
            reject(error);
            return;
          }

          const stored =
            Buffer.from(
              hash,
              "hex",
            );

          if (
            stored.length !==
            derivedKey.length
          ) {
            resolve(false);
            return;
          }

          resolve(
            crypto.timingSafeEqual(
              stored,
              derivedKey,
            ),
          );
        },
      );
    },
  );
}

// =====================================================
// GET ADMIN BY USERNAME
// =====================================================

async function getAdminByUsername(
  username: string,
): Promise<Admin | null> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          id,
          username,
          password_hash AS passwordHash,
          created_at AS createdAt,
          active
        FROM admins
        WHERE username = ?
        LIMIT 1
      `,
      [
        username,
      ],
    );

  return (
    (rows as Admin[])[0] ??
    null
  );
}

// =====================================================
// LOGIN ADMIN
// =====================================================

export async function loginAdmin(
  username: string,
  password: string,
) {
  await ensureDatabase();

  const cleanUsername =
    username.trim();

  if (!cleanUsername) {
    return {
      success: false,
      message:
        "Username is required.",
    };
  }

  if (!password) {
    return {
      success: false,
      message:
        "Password is required.",
    };
  }

  const admin =
    await getAdminByUsername(
      cleanUsername,
    );

  if (
    !admin ||
    !admin.active
  ) {
    return {
      success: false,
      message:
        "Invalid administrator credentials.",
    };
  }

  const correct =
    await verifyPassword(
      password,
      admin.passwordHash,
    );

  if (!correct) {
    return {
      success: false,
      message:
        "Invalid administrator credentials.",
    };
  }

  const session =
    await createAdminSession(
      admin,
    );

  return {
    success: true,
    message:
      "Administrator login successful.",
    token:
      session.token,
    admin: {
      id:
        admin.id,
      username:
        admin.username,
    },
    expiresAt:
      session.expiresAt,
  };
}

// =====================================================
// CREATE ADMIN SESSION
// =====================================================

async function createAdminSession(
  admin: Admin,
): Promise<AdminSession> {
  await ensureDatabase();

  const now =
    Date.now();

  const session:
    AdminSession = {
      token:
        crypto
          .randomBytes(48)
          .toString("hex"),

      adminId:
        admin.id,

      username:
        admin.username,

      createdAt:
        now,

      expiresAt:
        now +
        ADMIN_SESSION_DURATION,
    };

  await databasePool.query(
    `
      INSERT INTO admin_sessions (
        token,
        admin_id,
        username,
        created_at,
        expires_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      session.token,
      session.adminId,
      session.username,
      session.createdAt,
      session.expiresAt,
    ],
  );

  return session;
}

// =====================================================
// GET ADMIN FROM SESSION
// =====================================================

export async function getAdminFromSession(
  token: string,
): Promise<
  {
    id: string;
    username: string;
  } | null
> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          a.id,
          a.username
        FROM admin_sessions s
        INNER JOIN admins a
          ON a.id = s.admin_id
        WHERE
          s.token = ?
          AND s.expires_at > ?
          AND a.active = TRUE
        LIMIT 1
      `,
      [
        token,
        Date.now(),
      ],
    );

  const admin =
    (
      rows as Array<{
        id: string;
        username: string;
      }>
    )[0];

  return (
    admin ??
    null
  );
}

// =====================================================
// LOGOUT ADMIN
// =====================================================

export async function logoutAdmin(
  token: string,
): Promise<void> {
  await ensureDatabase();

  await databasePool.query(
    `
      DELETE FROM admin_sessions
      WHERE token = ?
    `,
    [
      token,
    ],
  );
}