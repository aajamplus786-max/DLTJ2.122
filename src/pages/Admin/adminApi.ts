
// =====================================================
// DLTJ2.10
// ADMIN API HELPER
// FILE: src/pages/Admin/adminApi.ts
// =====================================================

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data: T;
  [key: string]: unknown;
}

export const ADMIN_API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// RECORD NORMALIZER
// Converts backend snake_case fields to frontend
// camelCase fields.
// =====================================================

export function normalizeRecord<
  T extends Record<string, unknown>,
>(
  record: T,
): T {
  const normalized: Record<string, unknown> = {
    ...record,
  };

  const fieldMap: Record<
    string,
    string
  > = {
    technology_id: "technologyId",
    chapter_id: "chapterId",
    lesson_id: "lessonId",
    question_id: "questionId",
    test_id: "testId",

    chapter_number: "chapterNumber",

    display_order: "displayOrder",

    question_type: "questionType",
    question_text: "questionText",

    option_a: "optionA",
    option_b: "optionB",
    option_c: "optionC",
    option_d: "optionD",

    correct_answer: "correctAnswer",

    test_type: "testType",

    start_chapter: "startChapter",
    end_chapter: "endChapter",

    pass_percentage: "passPercentage",

    is_active: "isActive",

    created_at: "createdAt",
    updated_at: "updatedAt",

    completed_at: "completedAt",

    progress_type: "progressType",
  };

  Object.entries(fieldMap).forEach(
    ([snakeCase, camelCase]) => {
      if (
        Object.prototype.hasOwnProperty.call(
          normalized,
          snakeCase,
        )
      ) {
        normalized[camelCase] =
          normalized[snakeCase];

        delete normalized[snakeCase];
      }
    },
  );

  return normalized as T;
}

// =====================================================
// LIST NORMALIZER
// =====================================================

export function normalizeList<T>(
  value: unknown,
): T[] {
  let list: unknown = value;

  if (
    list &&
    typeof list === "object" &&
    !Array.isArray(list)
  ) {
    const object =
      list as Record<string, unknown>;

    if (Array.isArray(object.data)) {
      list = object.data;
    } else if (
      Array.isArray(object.items)
    ) {
      list = object.items;
    } else if (
      Array.isArray(object.results)
    ) {
      list = object.results;
    }
  }

  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((item) => {
    if (
      item &&
      typeof item === "object" &&
      !Array.isArray(item)
    ) {
      return normalizeRecord(
        item as Record<
          string,
          unknown
        >,
      ) as T;
    }

    return item as T;
  });
}

// =====================================================
// RESPONSE PARSER
// =====================================================

async function parseResponse(
  response: Response,
): Promise<ApiResponse<unknown>> {
  const contentType =
    response.headers.get(
      "content-type",
    ) ?? "";

  let body: unknown;

  if (
    contentType.includes(
      "application/json",
    )
  ) {
    body =
      await response.json();
  } else {
    const text =
      await response.text();

    body = text
      ? text
      : null;
  }

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}.`;

    if (
      body &&
      typeof body === "object"
    ) {
      const object =
        body as Record<
          string,
          unknown
        >;

      if (
        typeof object.message ===
        "string"
      ) {
        message =
          object.message;
      } else if (
        typeof object.error ===
        "string"
      ) {
        message =
          object.error;
      }
    } else if (
      typeof body === "string" &&
      body.trim()
    ) {
      message =
        body;
    }

    throw new Error(
      message,
    );
  }

  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body)
  ) {
    return body as ApiResponse<unknown>;
  }

  return {
    success: true,
    data: body,
  };
}

// =====================================================
// URL HELPER
// =====================================================

function buildUrl(
  path: string,
): string {
  if (
    path.startsWith(
      "http://",
    ) ||
    path.startsWith(
      "https://",
    )
  ) {
    return path;
  }

  const base =
    ADMIN_API_BASE.replace(
      /\/$/,
      "",
    );

  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${base}${normalizedPath}`;
}

// =====================================================
// REQUEST HEADERS
// =====================================================

function getHeaders(
  hasBody: boolean,
): HeadersInit {
  const headers: HeadersInit = {
    Accept:
      "application/json",
  };

  if (hasBody) {
    headers[
      "Content-Type"
    ] =
      "application/json";
  }

  const token =
    localStorage.getItem(
      "adminToken",
    ) ??
    localStorage.getItem(
      "admin_token",
    ) ??
    localStorage.getItem(
      "token",
    );

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  return headers;
}

// =====================================================
// GET
// IMPORTANT:
// Return type is ApiResponse instead of unknown.
// This fixes response.data TypeScript errors.
// =====================================================

export async function apiGet<
  T = unknown,
>(
  path: string,
): Promise<ApiResponse<T>> {
  const response =
    await fetch(
      buildUrl(path),
      {
        method: "GET",
        headers:
          getHeaders(false),
      },
    );

  return (await parseResponse(
    response,
  )) as ApiResponse<T>;
}

// =====================================================
// POST
// =====================================================

export async function apiPost<
  T = unknown,
>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const hasBody =
    body !== undefined;

  const response =
    await fetch(
      buildUrl(path),
      {
        method: "POST",
        headers:
          getHeaders(hasBody),
        body: hasBody
          ? JSON.stringify(
              body,
            )
          : undefined,
      },
    );

  return (await parseResponse(
    response,
  )) as ApiResponse<T>;
}

// =====================================================
// PUT
// =====================================================

export async function apiPut<
  T = unknown,
>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const hasBody =
    body !== undefined;

  const response =
    await fetch(
      buildUrl(path),
      {
        method: "PUT",
        headers:
          getHeaders(hasBody),
        body: hasBody
          ? JSON.stringify(
              body,
            )
          : undefined,
      },
    );

  return (await parseResponse(
    response,
  )) as ApiResponse<T>;
}

// =====================================================
// DELETE
// =====================================================

export async function apiDelete<
  T = unknown,
>(
  path: string,
): Promise<ApiResponse<T>> {
  const response =
    await fetch(
      buildUrl(path),
      {
        method: "DELETE",
        headers:
          getHeaders(false),
      },
    );

  return (await parseResponse(
    response,
  )) as ApiResponse<T>;
}

// =====================================================
// ID ENCODER
// =====================================================

export function encodeId(
  id: string | number,
): string {
  return encodeURIComponent(
    String(id),
  );
}
