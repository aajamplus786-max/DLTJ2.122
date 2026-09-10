// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 15
// FILE: server/src/utils/paths.ts
// DATE: 2026-08-31
// =====================================================

import path from "node:path";

// =====================================================
// PROJECT ROOT
// =====================================================

export const SERVER_ROOT =
  path.resolve(
    __dirname,
    "../../..",
  );

// =====================================================
// WORKSPACE ROOT
// =====================================================

export const WORKSPACE_ROOT =
  path.join(
    SERVER_ROOT,
    "workspace-data",
  );

// =====================================================
// PROJECT ROOT BUILDER
// =====================================================

export function getProjectPath(
  projectId: string,
): string {
  return path.join(
    WORKSPACE_ROOT,
    sanitizePathPart(projectId),
  );
}

// =====================================================
// DEPLOYMENT ROOT
// =====================================================

export function getDeploymentPath(
  projectId: string,
  deploymentId: string,
): string {
  return path.join(
    getProjectPath(projectId),
    "deployments",
    sanitizePathPart(
      deploymentId,
    ),
  );
}

// =====================================================
// BUILD OUTPUT
// =====================================================

export function getBuildOutputPath(
  projectId: string,
  deploymentId: string,
  outputDirectory = "dist",
): string {
  return path.join(
    getDeploymentPath(
      projectId,
      deploymentId,
    ),
    sanitizeRelativePath(
      outputDirectory,
    ),
  );
}

// =====================================================
// SANITIZE SINGLE PATH PART
// =====================================================

function sanitizePathPart(
  value: string,
): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

// =====================================================
// SANITIZE RELATIVE PATH
// =====================================================
//
// Prevents absolute paths and parent traversal.
//

function sanitizeRelativePath(
  value: string,
): string {
  const normalized =
    value
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

  const parts =
    normalized
      .split("/")
      .filter(
        (part) =>
          part.length > 0 &&
          part !== "." &&
          part !== "..",
      );

  if (parts.length === 0) {
    return "dist";
  }

  return parts
    .map(sanitizePathPart)
    .join(path.sep);
}

// =====================================================
// SAFE CHILD PATH
// =====================================================

export function isPathInside(
  parentPath: string,
  childPath: string,
): boolean {
  const parent =
    path.resolve(parentPath) +
    path.sep;

  const child =
    path.resolve(childPath);

  return (
    child.startsWith(parent) ||
    child ===
      path.resolve(parentPath)
  );
}