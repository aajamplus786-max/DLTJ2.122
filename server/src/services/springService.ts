// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: server/src/services/springService.ts
// DATE: 2026-08-31
// =====================================================

import crypto from "node:crypto";
import path from "node:path";

export interface SpringProject {
  id: string;
  name: string;
  path: string;
  port: number;
  profile: string;
  status:
    | "stopped"
    | "starting"
    | "running"
    | "error";
}

const projects =
  new Map<string, SpringProject>();

export async function createProject(
  name: string,
  requestedPath?: string,
) {
  const id =
    crypto.randomUUID();

  const projectPath =
    requestedPath?.trim() ||
    path.resolve(
      process.cwd(),
      "workspace",
      name,
    );

  const project: SpringProject = {
    id,
    name: name.trim(),
    path: projectPath,
    port: 8080,
    profile: "dev",
    status: "stopped",
  };

  projects.set(id, project);

  return {
    success: true,
    project,
  };
}

export async function getProject(
  id: string,
) {
  const project =
    projects.get(id);

  if (!project) {
    return {
      success: false,
      error: "Spring project not found.",
    };
  }

  return {
    success: true,
    project,
  };
}

export async function startProject(
  id: string,
) {
  const project =
    projects.get(id);

  if (!project) {
    return {
      success: false,
      error: "Spring project not found.",
    };
  }

  /*
   * IMPORTANT:
   * Actual Maven/Gradle process execution is
   * intentionally not started here.
   *
   * Batch 8 security/sandbox layer must approve
   * the command before a public execution environment
   * launches it.
   */

  project.status = "starting";

  projects.set(id, project);

  return {
    success: true,
    message:
      "Spring project accepted for secure startup.",
    project,
  };
}

export async function stopProject(
  id: string,
) {
  const project =
    projects.get(id);

  if (!project) {
    return {
      success: false,
      error: "Spring project not found.",
    };
  }

  project.status = "stopped";

  projects.set(id, project);

  return {
    success: true,
    message: "Spring project stopped.",
    project,
  };
}