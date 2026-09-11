// =====================================================
// DLTJ2.10
// FRONTEND TECHNOLOGY SERVICE
// FILE: src/services/technologyService.ts
// =====================================================

export interface Technology {
  id: string | number;
  name: string;
  section?: string | null;
  displayOrder: number;
  isActive: boolean | number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateTechnologyInput {
  name: string;
  displayOrder?: number;
  section?: string | null;
}

export interface UpdateTechnologyInput {
  name?: string;
  displayOrder?: number;
  section?: string | null;
  isActive?: boolean;
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

export async function getTechnologies(
  includeInactive = false,
): Promise<Technology[]> {
  const query = includeInactive
    ? "?includeInactive=true"
    : "";

  return request<Technology[]>(
    `/content/technologies${query}`,
  );
}

export async function getTechnology(
  id: string | number,
): Promise<Technology | null> {
  return request<Technology | null>(
    `/content/technologies/${encodeURIComponent(String(id))}`,
  );
}

export async function createTechnology(
  input: CreateTechnologyInput,
): Promise<Technology | null> {
  return request<Technology | null>(
    "/content/technologies",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateTechnology(
  id: string | number,
  input: UpdateTechnologyInput,
): Promise<Technology | null> {
  return request<Technology | null>(
    `/content/technologies/${encodeURIComponent(String(id))}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteTechnology(
  id: string | number,
): Promise<boolean> {
  await request(
    `/content/technologies/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
    },
  );

  return true;
}

export async function reorderTechnologies(
  technologyIds: Array<string | number>,
): Promise<Technology[]> {
  return request<Technology[]>(
    "/content/technologies/reorder",
    {
      method: "PUT",
      body: JSON.stringify({
        technologyIds:
          technologyIds.map((id) => String(id)),
      }),
    },
  );
}

export const technologyService = {
  getTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  reorderTechnologies,
};

export default technologyService;