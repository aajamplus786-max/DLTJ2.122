// =====================================================
// DLTJ2.10
// FRONTEND CONTENT IMPORT SERVICE
// FILE: src/services/contentImportService.ts
// =====================================================

export interface ContentImportPayload {
  technologyId: string | number;
  content: unknown;
}

export interface ContentImportResult {
  imported?: number;
  technologies?: number;
  chapters?: number;
  lessons?: number;
  questions?: number;
  tests?: number;
  testQuestions?: number;
  [key: string]: unknown;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    },
  );

  const result =
    (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ??
        result.error ??
        `Request failed with status ${response.status}`,
    );
  }

  return result.data as T;
}

/**
 * Sends already-parsed content to the backend importer.
 *
 * Phase 7 will provide the fixed AI text parser.
 * This service intentionally accepts unknown so the
 * parser format can evolve without changing API calls.
 */
export async function importContent(
  technologyId: string | number,
  content: unknown,
): Promise<ContentImportResult> {
  return request<ContentImportResult>(
    `/content/import/${encodeURIComponent(String(technologyId))}`,
    {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
    },
  );
}

export async function importContentBlock(
  payload: ContentImportPayload,
): Promise<ContentImportResult> {
  return importContent(
    payload.technologyId,
    payload.content,
  );
}

const contentImportService = {
  importContent,
  importContentBlock,
};

export default contentImportService;