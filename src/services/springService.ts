// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: src/services/springService.ts
// DATE: 2026-08-31
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

export interface SpringProject {
  id: string;
  name: string;
  path: string;
  port: number;
  profile: string;
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
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const data =
    (await response.json()) as T;

  if (!response.ok) {
    throw new Error(
      "Spring service request failed.",
    );
  }

  return data;
}

export function createSpringProject(
  name: string,
  path: string,
) {
  return request<{
    success: boolean;
    project?: SpringProject;
    error?: string;
  }>("/spring/projects", {
    name,
    path,
  });
}

export function getSpringProject(
  projectId: string,
) {
  return request<{
    success: boolean;
    project?: SpringProject;
  }>("/spring/project", {
    projectId,
  });
}

export function startSpringProject(
  projectId: string,
) {
  return request<{
    success: boolean;
    message: string;
  }>("/spring/start", {
    projectId,
  });
}

export function stopSpringProject(
  projectId: string,
) {
  return request<{
    success: boolean;
    message: string;
  }>("/spring/stop", {
    projectId,
  });
}