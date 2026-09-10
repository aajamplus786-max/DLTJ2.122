// =====================================================
// DLTJ2.10
// FRONTEND CHAPTER SERVICE
// FILE: src/services/chapterService.ts
// =====================================================

export interface Chapter {
  id: string | number;
  technologyId: string | number;
  chapterNumber: number;
  title: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean | number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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

export interface CreateChapterInput {
  technologyId: string | number;
  chapterNumber: number;
  title: string;
  description?: string | null;
  displayOrder?: number;
}

export interface UpdateChapterInput {
  chapterNumber?: number;
  title?: string;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export async function getChaptersByTechnology(
  technologyId: string | number,
): Promise<Chapter[]> {
  return request<Chapter[]>(
    `/content/chapters/technology/${encodeURIComponent(String(technologyId))}`,
  );
}

export async function getChapter(
  id: string | number,
): Promise<Chapter | null> {
  return request<Chapter | null>(
    `/content/chapters/${encodeURIComponent(String(id))}`,
  );
}

export async function createChapter(
  input: CreateChapterInput,
): Promise<Chapter | null> {
  return request<Chapter | null>(
    "/content/chapters",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateChapter(
  id: string | number,
  input: UpdateChapterInput,
): Promise<Chapter | null> {
  return request<Chapter | null>(
    `/content/chapters/${encodeURIComponent(String(id))}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteChapter(
  id: string | number,
): Promise<boolean> {
  await request(
    `/content/chapters/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
    },
  );

  return true;
}

export async function reorderChapters(
  technologyId: string | number,
  chapterIds: Array<string | number>,
): Promise<Chapter[]> {
  return request<Chapter[]>(
    `/content/chapters/technology/${encodeURIComponent(String(technologyId))}/reorder`,
    {
      method: "PUT",
      body: JSON.stringify({
        chapterIds:
          chapterIds.map((id) => String(id)),
      }),
    },
  );
}

const chapterService = {
  getChaptersByTechnology,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
};

export default chapterService;