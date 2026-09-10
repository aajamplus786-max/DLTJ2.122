
// =====================================================
// DLTJ2.2
// USER AUTHENTICATION SERVICE
// FILE: server/src/services/authService.ts
// =====================================================

import crypto from "node:crypto";

import {
  databasePool,
} from "../config/database";

import {
  createOTP,
  verifyOTPCode,
} from "./otpService";

import type {
  User,
  AuthSession,
} from "../models/User";

// =====================================================
// CONSTANTS
// =====================================================

const SESSION_DURATION =
  1000 *
  60 *
  60 *
  24 *
  365;

const MAX_LOGIN_ATTEMPTS = 7;

const LOGIN_LOCK_DURATION =
  1000 *
  60 *
  60 *
  75;

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
      await databasePool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          mobile VARCHAR(20) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          created_at VARCHAR(50) NOT NULL,
          mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
          failed_login_attempts INT NOT NULL DEFAULT 0,
          locked_until BIGINT NULL
        )
      `);

      await databasePool.query(`
        CREATE TABLE IF NOT EXISTS auth_sessions (
          token VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(100) NOT NULL,
          mobile VARCHAR(20) NOT NULL,
          created_at BIGINT NOT NULL,
          expires_at BIGINT NOT NULL
        )
      `);
    })();

  return databaseReady;
}

// =====================================================
// HELPERS
// =====================================================

function normalizeMobile(
  mobile: string,
): string {
  return mobile.replace(
    /\D/g,
    "",
  );
}

function generateId(): string {
  return crypto.randomUUID();
}

function generateToken(): string {
  return crypto
    .randomBytes(48)
    .toString("hex");
}

// =====================================================
// PASSWORD HASH
// =====================================================

async function hashPassword(
  password: string,
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
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

  if (!salt || !hash) {
    return false;
  }

  return new Promise(
    (resolve, reject) => {
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
// GET USER BY MOBILE
// =====================================================

async function getUserByMobile(
  mobile: string,
): Promise<User | null> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          id,
          name,
          mobile,
          password_hash AS passwordHash,
          created_at AS createdAt,
          mobile_verified AS mobileVerified,
          failed_login_attempts AS failedLoginAttempts,
          locked_until AS lockedUntil
        FROM users
        WHERE mobile = ?
        LIMIT 1
      `,
      [mobile],
    );

  const user =
    (rows as User[])[0];

  return user ?? null;
}

// =====================================================
// GET USER BY ID
// IMPORTANT: PUBLIC FOR AUTH CONTROLLER
// =====================================================

export async function getUserById(
  userId: string,
): Promise<User | null> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          id,
          name,
          mobile,
          password_hash AS passwordHash,
          created_at AS createdAt,
          mobile_verified AS mobileVerified,
          failed_login_attempts AS failedLoginAttempts,
          locked_until AS lockedUntil
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [userId],
    );

  const user =
    (rows as User[])[0];

  return user ?? null;
}

// =====================================================
// REGISTER
// =====================================================

export async function registerUser(
  name: string,
  mobile: string,
  password: string,
) {
  await ensureDatabase();

  const cleanName =
    name.trim();

  const cleanMobile =
    normalizeMobile(mobile);

  if (
    !cleanName ||
    cleanName.length < 2
  ) {
    return {
      success: false,
      message:
        "Enter a valid name.",
    };
  }

  if (
    cleanMobile.length !== 10
  ) {
    return {
      success: false,
      message:
        "Enter a valid 10-digit mobile number.",
    };
  }

  if (
    password.length < 6
  ) {
    return {
      success: false,
      message:
        "Password must contain at least 6 characters.",
    };
  }

  const existing =
    await getUserByMobile(
      cleanMobile,
    );

  if (existing) {
    return {
      success: false,
      message:
        "An account with this mobile number already exists.",
    };
  }

  const userId =
    generateId();

  const passwordHash =
    await hashPassword(
      password,
    );

  await databasePool.query(
    `
      INSERT INTO users (
        id,
        name,
        mobile,
        password_hash,
        created_at,
        mobile_verified,
        failed_login_attempts,
        locked_until
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      cleanName,
      cleanMobile,
      passwordHash,
      new Date().toISOString(),
      false,
      0,
      null,
    ],
  );

  // ---------------------------------------------------
  // CREATE REGISTRATION OTP
  // ---------------------------------------------------

  const otp =
    await createOTP(
      userId,
      cleanMobile,
    );

  // ---------------------------------------------------
  // SUCCESS
  // DEV MODE:
  // OTP is returned so frontend can display it.
  // Later this can be removed when SMS is connected.
  // ---------------------------------------------------

  return {
    success: true,
    message:
      "Registration successful. OTP sent for verification.",
    userId,
    otp: otp.otp,
    expiresAt:
      otp.expiresAt,
  };
}

// =====================================================
// LOGIN
// =====================================================

export async function loginUser(
  mobile: string,
  password: string,
) {
  const cleanMobile =
    normalizeMobile(mobile);

  if (
    cleanMobile.length !== 10
  ) {
    return {
      success: false,
      message:
        "Enter a valid 10-digit mobile number.",
    };
  }

  if (!password) {
    return {
      success: false,
      message:
        "Password is required.",
    };
  }

  const user =
    await getUserByMobile(
      cleanMobile,
    );

  if (!user) {
    return {
      success: false,
      message:
        "Invalid mobile number or password.",
    };
  }

  // ---------------------------------------------------
  // ACCOUNT LOCK
  // ---------------------------------------------------

  if (
    user.lockedUntil &&
    Date.now() <
      Number(
        user.lockedUntil,
      )
  ) {
    return {
      success: false,
      message:
        "Account is temporarily locked.",
    };
  }

  // ---------------------------------------------------
  // VERIFY PASSWORD
  // ---------------------------------------------------

  const correct =
    await verifyPassword(
      password,
      user.passwordHash,
    );

  if (!correct) {
    const attempts =
      Number(
        user.failedLoginAttempts ?? 0,
      ) + 1;

    const lockedUntil =
      attempts >=
      MAX_LOGIN_ATTEMPTS
        ? Date.now() +
          LOGIN_LOCK_DURATION
        : null;

    await databasePool.query(
      `
        UPDATE users
        SET
          failed_login_attempts = ?,
          locked_until = ?
        WHERE id = ?
      `,
      [
        attempts,
        lockedUntil,
        user.id,
      ],
    );

    return {
      success: false,
      message:
        attempts >=
        MAX_LOGIN_ATTEMPTS
          ? "Too many failed login attempts. Your account is temporarily locked."
          : "Invalid mobile number or password.",
    };
  }

  // ---------------------------------------------------
  // RESET LOGIN ATTEMPTS
  // ---------------------------------------------------

  await databasePool.query(
    `
      UPDATE users
      SET
        failed_login_attempts = 0,
        locked_until = NULL
      WHERE id = ?
    `,
    [user.id],
  );

  // ---------------------------------------------------
  // CREATE LOGIN OTP
  // ---------------------------------------------------

  const otp =
    await createOTP(
      user.id,
      user.mobile,
    );

  // ---------------------------------------------------
  // SUCCESS
  // DEV MODE:
  // OTP is returned so frontend can display it.
  // ---------------------------------------------------

  return {
    success: true,
    message:
      "Password verified. OTP required.",
    requiresOTP: true,
    userId: user.id,
    otp: otp.otp,
    expiresAt:
      otp.expiresAt,
  };
}

// =====================================================
// VERIFY LOGIN OTP
// =====================================================

export async function verifyLoginOTP(
  userId: string,
  otp: string,
) {
  const result =
    await verifyOTPCode(
      userId,
      otp,
    );

  if (!result.success) {
    return result;
  }

  await databasePool.query(
    `
      UPDATE users
      SET mobile_verified = TRUE
      WHERE id = ?
    `,
    [userId],
  );

  const user =
    await getUserById(
      userId,
    );

  if (!user) {
    return {
      success: false,
      message:
        "User account was not found.",
    };
  }

  const session =
    await createSession(
      user,
    );

  return {
    success: true,
    message:
      "Login successful.",
    token:
      session.token,
    user,
    expiresAt:
      session.expiresAt,
  };
}

// =====================================================
// CREATE SESSION
// =====================================================

export async function createSession(
  user: User,
): Promise<AuthSession> {
  await ensureDatabase();

  const now =
    Date.now();

  const session:
    AuthSession = {
    token:
      generateToken(),

    userId:
      user.id,

    mobile:
      user.mobile,

    createdAt:
      now,

    expiresAt:
      now +
      SESSION_DURATION,
  };

  await databasePool.query(
    `
      INSERT INTO auth_sessions (
        token,
        user_id,
        mobile,
        created_at,
        expires_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      session.token,
      session.userId,
      session.mobile,
      session.createdAt,
      session.expiresAt,
    ],
  );

  return session;
}

// =====================================================
// GET USER FROM SESSION
// =====================================================

export async function getUserFromSession(
  token: string,
): Promise<User | null> {
  await ensureDatabase();

  const [
    rows,
  ] =
    await databasePool.query(
      `
        SELECT
          u.id,
          u.name,
          u.mobile,
          u.password_hash AS passwordHash,
          u.created_at AS createdAt,
          u.mobile_verified AS mobileVerified,
          u.failed_login_attempts AS failedLoginAttempts,
          u.locked_until AS lockedUntil
        FROM auth_sessions s
        INNER JOIN users u
          ON u.id = s.user_id
        WHERE
          s.token = ?
          AND s.expires_at > ?
        LIMIT 1
      `,
      [
        token,
        Date.now(),
      ],
    );

  const user =
    (rows as User[])[0];

  return user ?? null;
}

// =====================================================
// LOGOUT
// =====================================================

export async function logoutUser(
  token: string,
): Promise<void> {
  await ensureDatabase();

  await databasePool.query(
    `
      DELETE FROM auth_sessions
      WHERE token = ?
    `,
    [token],
  );
}
