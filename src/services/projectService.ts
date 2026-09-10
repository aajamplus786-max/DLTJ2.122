
// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: src/services/projectService.ts
// DATE: 2026-09-06
// LOCATION: src/services/projectService.ts
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// PROJECT CONNECTION
// =====================================================

export interface ProjectConnection {
  name: string;

  springUrl: string;

  mysqlHost: string;

  mysqlPort: number;

  mysqlDatabase: string;

  mysqlUser: string;

  mysqlPassword: string;
}

// =====================================================
// PROJECT RECORD
// =====================================================

export interface ProjectRecord {
  id: string;

  name: string;

  description?: string;

  createdAt: string;

  updatedAt: string;

  connection?: ProjectConnection;
}

// =====================================================
// COMMON REQUEST HELPER
// =====================================================

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(options.headers ?? {}),
      },
    },
  );

  let data: T;

  try {
    data =
      (await response.json()) as T;
  } catch {
    throw new Error(
      "Invalid response received from project API.",
    );
  }

  if (!response.ok) {
    throw new Error(
      "Project request failed.",
    );
  }

  return data;
}

// =====================================================
// CREATE PROJECT
// =====================================================

export function createProject(
  name: string,
  description = "",
) {
  return request<{
    success: boolean;

    project?: ProjectRecord;

    error?: string;
  }>("/projects", {
    method: "POST",

    body: JSON.stringify({
      name,

      description,
    }),
  });
}

// =====================================================
// GET ALL PROJECTS
// =====================================================

export function getProjects() {
  return request<{
    success: boolean;

    projects: ProjectRecord[];
  }>("/projects", {
    method: "GET",
  });
}

// =====================================================
// GET SINGLE PROJECT
// =====================================================

export function getProject(
  id: string,
) {
  return request<{
    success: boolean;

    project?: ProjectRecord;
  }>(
    `/projects/${encodeURIComponent(
      id,
    )}`,
    {
      method: "GET",
    },
  );
}

// =====================================================
// SAVE PROJECT CONNECTION
// =====================================================

export function saveProjectConnection(
  projectId: string,

  connection: ProjectConnection,
) {
  return request<{
    success: boolean;

    project?: ProjectRecord;
  }>(
    `/projects/${encodeURIComponent(
      projectId,
    )}/connection`,
    {
      method: "PUT",

      body:
        JSON.stringify(
          connection,
        ),
    },
  );
}

// =====================================================
// TEST PROJECT CONNECTION
// =====================================================

export function testProjectConnection(
  connection: ProjectConnection,
) {
  return request<{
    success: boolean;

    message: string;
  }>("/projects/test-connection", {
    method: "POST",

    body:
      JSON.stringify(
        connection,
      ),
  });
}

// =====================================================
// DELETE PROJECT
// =====================================================

export function deleteProject(
  id: string,
) {
  return request<{
    success: boolean;

    message: string;
  }>(
    `/projects/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );
}
