// =====================================================
// DLTJ2.10
// FRONTEND LESSON SERVICE
// FILE: src/services/lessonService.ts
// =====================================================

export interface Lesson {
  id: string | number;
  chapterId: string | number;
  lessonNumber: number;
  title: string;
  content: string;
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
  (import.meta.env.VITE_API_URL as string | undefined) ??
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

export interface CreateLessonInput {
  chapterId: string | number;
  lessonNumber: number;
  title: string;
  content: string;
  displayOrder?: number;
}

export interface UpdateLessonInput {
  lessonNumber?: number;
  title?: string;
  content?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export async function getLessonsByChapter(
  chapterId: string | number,
): Promise<Lesson[]> {
  return request<Lesson[]>(
    `/content/lessons/chapter/${encodeURIComponent(String(chapterId))}`,
  );
}

export async function getLesson(
  id: string | number,
): Promise<Lesson | null> {
  return request<Lesson | null>(
    `/content/lessons/${encodeURIComponent(String(id))}`,
  );
}

export async function createLesson(
  input: CreateLessonInput,
): Promise<Lesson | null> {
  return request<Lesson | null>(
    "/content/lessons",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateLesson(
  id: string | number,
  input: UpdateLessonInput,
): Promise<Lesson | null> {
  return request<Lesson | null>(
    `/content/lessons/${encodeURIComponent(String(id))}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteLesson(
  id: string | number,
): Promise<boolean> {
  await request(
    `/content/lessons/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
    },
  );

  return true;
}

export async function reorderLessons(
  chapterId: string | number,
  lessonIds: Array<string | number>,
): Promise<Lesson[]> {
  return request<Lesson[]>(
    `/content/lessons/chapter/${encodeURIComponent(String(chapterId))}/reorder`,
    {
      method: "PUT",
      body: JSON.stringify({
        lessonIds:
          lessonIds.map((id) => String(id)),
      }),
    },
  );
}

const lessonService = {
  getLessonsByChapter,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
};

export default lessonService;