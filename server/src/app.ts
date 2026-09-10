// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// FILE: server/src/app.ts
// DATE: 2026-09-05
// CREATE BY: aajamthurinji
// =====================================================

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

// =====================================================
// WORKING TOOL ROUTES
// =====================================================

import executionRoutes from "./routes/executionRoutes";
import projectRoutes from "./routes/projectRoutes";
import databaseRoutes from "./routes/databaseRoutes";
import springRoutes from "./routes/springRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes";
import adminAuthRoutes from "./routes/adminAuthRoutes";

// =====================================================
// DYNAMIC LEARNING SYSTEM — CONTENT ROUTES
// =====================================================

import technologyContentRoutes from "./routes/technologyContentRoutes";
import chapterContentRoutes from "./routes/chapterContentRoutes";
import lessonContentRoutes from "./routes/lessonContentRoutes";
import questionContentRoutes from "./routes/questionContentRoutes";
import testContentRoutes from "./routes/testContentRoutes";
import progressContentRoutes from "./routes/progressContentRoutes";
import contentImportRoutes from "./routes/contentImportRoutes";

// =====================================================
// UTILITIES
// =====================================================

import { AppError } from "./utils/errors";
import logger from "./utils/logger";

const app = express();

// =====================================================
// CORS — DLTJ FRONTEND
// =====================================================

app.use(
  (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const origin = request.headers.origin;

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ];

    if (
      origin &&
      allowedOrigins.includes(origin)
    ) {
      response.setHeader(
        "Access-Control-Allow-Origin",
        origin,
      );
    }

    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );

    response.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    response.setHeader(
      "Access-Control-Allow-Credentials",
      "true",
    );

    if (
      request.method === "OPTIONS"
    ) {
      response.status(204).end();
      return;
    }

    next();
  },
);

// =====================================================
// BODY PARSERS
// =====================================================

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

// =====================================================
// SECURITY HEADERS
// =====================================================

app.use(
  (
    _request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    response.setHeader(
      "X-Content-Type-Options",
      "nosniff",
    );

    response.setHeader(
      "X-Frame-Options",
      "DENY",
    );

    response.setHeader(
      "Referrer-Policy",
      "no-referrer",
    );

    response.setHeader(
      "X-XSS-Protection",
      "0",
    );

    next();
  },
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (
    _request: Request,
    response: Response,
  ) => {
    response.json({
      success: true,
      service: "DLTJ2.10 Dynamic Learning System",
      status: "online",
      timestamp: new Date().toISOString(),
    });
  },
);

// =====================================================
// ADMIN AUTHENTICATION
// =====================================================

app.use(
  "/api/admin/auth",
  adminAuthRoutes,
);

// =====================================================
// USER AUTHENTICATION
// =====================================================

app.use(
  "/api/auth",
  authRoutes,
);

// =====================================================
// WORKING TOOL — EXECUTION
// =====================================================

app.use(
  "/api/execution",
  executionRoutes,
);

// =====================================================
// WORKING TOOL — PROJECT
// =====================================================

app.use(
  "/api/project",
  projectRoutes,
);

// =====================================================
// WORKING TOOL — DATABASE / MYSQL
// =====================================================

app.use(
  "/api/database",
  databaseRoutes,
);

// =====================================================
// WORKING TOOL — SPRING
// =====================================================

app.use(
  "/api/spring",
  springRoutes,
);

// =====================================================
// WORKING TOOL — WORKSPACE
// =====================================================

app.use(
  "/api/workspace",
  workspaceRoutes,
);

// =====================================================
// DYNAMIC LEARNING SYSTEM
// TECHNOLOGY CONTENT
// =====================================================

app.use(
  "/api/content/technologies",
  technologyContentRoutes,
);

// =====================================================
// DYNAMIC LEARNING SYSTEM
// CHAPTER CONTENT
// =====================================================

app.use(
  "/api/content/chapters",
  chapterContentRoutes,
);

// =====================================================
// DYNAMIC LEARNING SYSTEM
// LESSON CONTENT
// =====================================================

app.use(
  "/api/content/lessons",
  lessonContentRoutes,
);

// =====================================================
// DYNAMIC LEARNING SYSTEM
// QUESTION CONTENT
// =====================================================

app.use(
  "/api/content/questions",
  questionContentRoutes,
);

// =====================================================
// DYNAMIC LEARNING SYSTEM
// TEST CONTENT
// =====================================================

app.use(
  "/api/content/tests",
  testContentRoutes,
);

// =====================================================
// DYNAMIC LEARNING SYSTEM
// USER PROGRESS
// =====================================================

app.use(
  "/api/content/progress",
  progressContentRoutes,
);

// =====================================================
// DYNAMIC LEARNING SYSTEM
// AI CONTENT IMPORT
// =====================================================

app.use(
  "/api/content/import",
  contentImportRoutes,
);

// =====================================================
// API 404 HANDLER
// =====================================================

app.use(
  (
    _request: Request,
    response: Response,
  ) => {
    response.status(404).json({
      success: false,
      error: "API route not found.",
    });
  },
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    logger.error(
      error instanceof Error
        ? error.message
        : "Unhandled server error.",
    );

    if (error instanceof AppError) {
      response
        .status(error.statusCode)
        .json({
          success: false,
          error: error.message,
          code: error.code,
        });

      return;
    }

    if (
      error instanceof SyntaxError
    ) {
      response.status(400).json({
        success: false,
        error: "Invalid JSON request.",
      });

      return;
    }

    response.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  },
);

// =====================================================
// EXPORT
// =====================================================

export default app;