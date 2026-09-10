// =====================================================
// DLTJ2.10
// FRONTEND QUESTION SERVICE
// FILE: src/services/questionService.ts
// =====================================================

export type QuestionType =
  | "mcq"
  | "true_false"
  | "short_answer"
  | "code"
  | string;

// =====================================================
// QUESTION MODEL
// =====================================================

export interface Question {
  id: string | number;

  technologyId?: string | number | null;
  chapterId?: string | number | null;

  questionType: QuestionType;
  questionText: string;

  optionA?: string | null;
  optionB?: string | null;
  optionC?: string | null;
  optionD?: string | null;

  correctAnswer?: string | null;
  explanation?: string | null;

  marks?: number;
  displayOrder?: number;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

// =====================================================
// API RESPONSE
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// =====================================================
// INPUT MODELS
// =====================================================

export interface CreateQuestionInput {
  technologyId: string | number;

  chapterId?: string | number | null;

  questionType: QuestionType;

  questionText: string;

  optionA?: string | null;
  optionB?: string | null;
  optionC?: string | null;
  optionD?: string | null;

  correctAnswer?: string | null;
  explanation?: string | null;

  marks?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateQuestionInput
  extends Partial<CreateQuestionInput> {
  id?: string | number;
}

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// INTERNAL REQUEST HELPER
// =====================================================

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  let body: ApiResponse<T>;

  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      `Server returned invalid JSON (${response.status}).`
    );
  }

  if (!response.ok || !body.success) {
    throw new Error(
      body.message ??
        body.error ??
        `Request failed with status ${response.status}.`
    );
  }

  return body;
}

// =====================================================
// GET SINGLE QUESTION
// =====================================================

export async function getQuestion(
  questionId: string | number
): Promise<Question> {
  const result = await request<Question>(
    `${API_BASE_URL}/content/questions/${encodeURIComponent(
      String(questionId)
    )}`
  );

  return (
    result.data ?? {
      id: questionId,
      questionType: "mcq",
      questionText: "",
    }
  );
}

// =====================================================
// GET QUESTIONS BY TECHNOLOGY
// =====================================================

export async function getQuestionsByTechnology(
  technologyId: string | number
): Promise<Question[]> {
  const result = await request<Question[]>(
    `${API_BASE_URL}/content/questions/technology/${encodeURIComponent(
      String(technologyId)
    )}`
  );

  return result.data ?? [];
}

// =====================================================
// GET QUESTIONS BY CHAPTER
// =====================================================

export async function getQuestionsByChapter(
  chapterId: string | number
): Promise<Question[]> {
  const result = await request<Question[]>(
    `${API_BASE_URL}/content/questions/chapter/${encodeURIComponent(
      String(chapterId)
    )}`
  );

  return result.data ?? [];
}

// =====================================================
// GET QUESTIONS BETWEEN CHAPTER NUMBERS
// =====================================================

export async function getChapterRangeQuestions(
  technologyId: string | number,
  startChapter: number,
  endChapter: number
): Promise<Question[]> {
  if (startChapter > endChapter) {
    return [];
  }

  // ---------------------------------------------------
  // Load chapters for technology
  // ---------------------------------------------------

  type ChapterSummary = {
    id: string | number;
    chapterNumber: number;
  };

  const chapterResponse = await fetch(
    `${API_BASE_URL}/content/chapters/technology/${encodeURIComponent(
      String(technologyId)
    )}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let chapterResult: ApiResponse<ChapterSummary[]>;

  try {
    chapterResult =
      (await chapterResponse.json()) as ApiResponse<ChapterSummary[]>;
  } catch {
    throw new Error(
      `Failed to read chapter response (${chapterResponse.status}).`
    );
  }

  if (!chapterResponse.ok || !chapterResult.success) {
    throw new Error(
      chapterResult.message ??
        chapterResult.error ??
        "Failed to load chapters."
    );
  }

  const chapters: ChapterSummary[] =
    chapterResult.data ?? [];

  // ---------------------------------------------------
  // Find matching chapter numbers
  // ---------------------------------------------------

  const matchingChapters: ChapterSummary[] =
    chapters.filter(
      (chapter: ChapterSummary) =>
        Number(chapter.chapterNumber) >=
          Number(startChapter) &&
        Number(chapter.chapterNumber) <=
          Number(endChapter)
    );

  // ---------------------------------------------------
  // Load questions from every matching chapter
  // ---------------------------------------------------

  const questionGroups: Question[][] =
    await Promise.all(
      matchingChapters.map(
        (chapter: ChapterSummary) =>
          getQuestionsByChapter(chapter.id)
      )
    );

  const questions: Question[] =
    questionGroups.flat();

  // ---------------------------------------------------
  // Stable ordering
  // ---------------------------------------------------

  return questions.sort(
    (a: Question, b: Question) => {
      const chapterA = Number(a.chapterId ?? 0);
      const chapterB = Number(b.chapterId ?? 0);

      if (chapterA !== chapterB) {
        return chapterA - chapterB;
      }

      const orderA = Number(a.displayOrder ?? 0);
      const orderB = Number(b.displayOrder ?? 0);

      return orderA - orderB;
    }
  );
}

// =====================================================
// CREATE QUESTION
// =====================================================

export async function createQuestion(
  input: CreateQuestionInput
): Promise<Question> {
  const result = await request<Question>(
    `${API_BASE_URL}/content/questions`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!result.data) {
    throw new Error("Question was created but no data was returned.");
  }

  return result.data;
}

// =====================================================
// UPDATE QUESTION
// =====================================================

export async function updateQuestion(
  questionId: string | number,
  input: UpdateQuestionInput
): Promise<Question> {
  const result = await request<Question>(
    `${API_BASE_URL}/content/questions/${encodeURIComponent(
      String(questionId)
    )}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );

  if (!result.data) {
    throw new Error("Question was updated but no data was returned.");
  }

  return result.data;
}

// =====================================================
// DELETE QUESTION
// =====================================================

export async function deleteQuestion(
  questionId: string | number
): Promise<void> {
  await request<null>(
    `${API_BASE_URL}/content/questions/${encodeURIComponent(
      String(questionId)
    )}`,
    {
      method: "DELETE",
    }
  );
}

// =====================================================
// ACTIVE QUESTIONS BY TECHNOLOGY
// =====================================================

export async function getActiveQuestionsByTechnology(
  technologyId: string | number
): Promise<Question[]> {
  const questions =
    await getQuestionsByTechnology(technologyId);

  return questions.filter(
    (question: Question) =>
      question.isActive !== false
  );
}

// =====================================================
// ACTIVE QUESTIONS BY CHAPTER
// =====================================================

export async function getActiveQuestionsByChapter(
  chapterId: string | number
): Promise<Question[]> {
  const questions =
    await getQuestionsByChapter(chapterId);

  return questions.filter(
    (question: Question) =>
      question.isActive !== false
  );
}

// =====================================================
// SHUFFLE QUESTIONS
// =====================================================

export function shuffleQuestions(
  questions: Question[]
): Question[] {
  const result = [...questions];

  for (
    let index = result.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [
      result[index],
      result[randomIndex],
    ] = [
      result[randomIndex],
      result[index],
    ];
  }

  return result;
}

// =====================================================
// LIMIT QUESTIONS
// =====================================================

export function limitQuestions(
  questions: Question[],
  limit: number
): Question[] {
  if (limit <= 0) {
    return [];
  }

  return questions.slice(0, limit);
}

// =====================================================
// RANDOM QUESTIONS
// =====================================================

export function getRandomQuestions(
  questions: Question[],
  count: number
): Question[] {
  return limitQuestions(
    shuffleQuestions(questions),
    count
  );
}

// =====================================================
// SORT QUESTIONS
// =====================================================

export function sortQuestions(
  questions: Question[]
): Question[] {
  return [...questions].sort(
    (a: Question, b: Question) => {
      const orderA = Number(a.displayOrder ?? 0);
      const orderB = Number(b.displayOrder ?? 0);

      return orderA - orderB;
    }
  );
}

// =====================================================
// TOTAL MARKS
// =====================================================

export function calculateTotalMarks(
  questions: Question[]
): number {
  return questions.reduce(
    (
      total: number,
      question: Question
    ) => total + Number(question.marks ?? 1),
    0
  );
}

// =====================================================
// SCORE
// =====================================================

export function calculateScore(
  questions: Question[],
  answers: Record<string, string>
): number {
  return questions.reduce(
    (
      total: number,
      question: Question
    ) => {
      const answer =
        answers[String(question.id)];

      if (
        answer !== undefined &&
        String(answer).trim().toLowerCase() ===
          String(
            question.correctAnswer ?? ""
          )
            .trim()
            .toLowerCase()
      ) {
        return (
          total + Number(question.marks ?? 1)
        );
      }

      return total;
    },
    0
  );
}

// =====================================================
// DEFAULT SERVICE OBJECT
// =====================================================

const questionService = {
  getQuestion,
  getQuestionsByTechnology,
  getQuestionsByChapter,
  getChapterRangeQuestions,

  createQuestion,
  updateQuestion,
  deleteQuestion,

  getActiveQuestionsByTechnology,
  getActiveQuestionsByChapter,

  shuffleQuestions,
  limitQuestions,
  getRandomQuestions,
  sortQuestions,

  calculateTotalMarks,
  calculateScore,
};

export default questionService;