// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 13
// FILE: src/services/fileService.ts
// DATE: 2026-08-31
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

export interface StoredWorkspaceFile {
  id: string;
  projectId: string;
  name: string;
  path: string;
  content: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    },
  );

  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(
      "File service request failed.",
    );
  }

  return data;
}

export function getProjectFiles(
  projectId: string,
) {
  return request<{
    success: boolean;
    files: StoredWorkspaceFile[];
  }>(
    `/files/project/${encodeURIComponent(projectId)}`,
    {
      method: "GET",
    },
  );
}

export function saveProjectFile(
  file: StoredWorkspaceFile,
) {
  return request<{
    success: boolean;
    file: StoredWorkspaceFile;
  }>("/files", {
    method: "POST",
    body: JSON.stringify(file),
  });
}

export function deleteProjectFile(
  fileId: string,
) {
  return request<{
    success: boolean;
    message: string;
  }>(
    `/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
    },
  );
}