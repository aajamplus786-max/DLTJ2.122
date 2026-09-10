
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// FILE: src/pages/Learning/LessonPage.tsx
// DATE: 2026-09-07
// LOCATION: src/pages/Learning
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./LessonPage.css";

// =====================================================
// TYPES
// =====================================================

interface Technology {
  id: string;
  name: string;
  section?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

interface Chapter {
  id: string;
  technologyId: string;
  chapterNumber?: number;
  title: string;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

interface Lesson {
  id: string;
  chapterId: string;
  lessonNumber?: number;
  title: string;
  content?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

// =====================================================
// API
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

// =====================================================
// API GET HELPER
// =====================================================

async function apiGet<T>(
  endpoint: string,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        "Content-Type":
          "application/json",
      },
    },
  );

  let result: any = null;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Server returned an invalid response.",
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Request failed.",
    );
  }

  if (
    result &&
    typeof result === "object" &&
    "success" in result
  ) {
    if (!result.success) {
      throw new Error(
        result.message ||
          "Request failed.",
      );
    }

    return result.data as T;
  }

  return result as T;
}

// =====================================================
// NORMALIZE TECHNOLOGY
// =====================================================

function normalizeTechnology(
  value: any,
): Technology | null {
  if (!value) {
    return null;
  }

  return {
    id: String(value.id),

    name:
      value.name ||
      "Technology",

    section:
      value.section ??
      null,

    displayOrder:
      value.displayOrder ??
      value.display_order,

    isActive:
      value.isActive ??
      value.is_active ??
      true,
  };
}

// =====================================================
// NORMALIZE CHAPTER
// =====================================================

function normalizeChapter(
  value: any,
): Chapter | null {
  if (!value) {
    return null;
  }

  return {
    id: String(value.id),

    technologyId: String(
      value.technologyId ??
        value.technology_id ??
        "",
    ),

    chapterNumber:
      value.chapterNumber ??
      value.chapter_number,

    title:
      value.title ||
      "Chapter",

    description:
      value.description ??
      null,

    displayOrder:
      value.displayOrder ??
      value.display_order,

    isActive:
      value.isActive ??
      value.is_active ??
      true,
  };
}

// =====================================================
// NORMALIZE LESSON
// =====================================================

function normalizeLesson(
  value: any,
): Lesson {
  return {
    id: String(value.id),

    chapterId: String(
      value.chapterId ??
        value.chapter_id ??
        "",
    ),

    lessonNumber:
      value.lessonNumber ??
      value.lesson_number,

    title:
      value.title ||
      "Lesson",

    content:
      value.content ??
      "",

    displayOrder:
      value.displayOrder ??
      value.display_order,

    isActive:
      value.isActive ??
      value.is_active ??
      true,
  };
}

// =====================================================
// CODE BLOCK DETECTION
// =====================================================

function isCodeBlock(
  block: string,
): boolean {
  const trimmed =
    block.trim();

  if (!trimmed) {
    return false;
  }

  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<head") ||
    trimmed.startsWith("<body") ||
    trimmed.startsWith("<form") ||
    trimmed.startsWith("<section") ||
    trimmed.startsWith("<article") ||
    trimmed.startsWith("<header") ||
    trimmed.startsWith("<footer") ||
    trimmed.startsWith("<nav") ||
    trimmed.startsWith("<table") ||
    trimmed.startsWith("<ul") ||
    trimmed.startsWith("<ol") ||
    trimmed.startsWith("<select") ||
    trimmed.startsWith("<input") ||
    trimmed.startsWith("<label") ||
    trimmed.startsWith("<img") ||
    trimmed.startsWith("<video") ||
    trimmed.startsWith("<audio") ||
    trimmed.startsWith("<picture") ||
    trimmed.startsWith("<figure") ||
    trimmed.startsWith("<details") ||
    trimmed.startsWith("<progress") ||
    trimmed.startsWith("<meter") ||
    trimmed.startsWith("<dialog")
  ) {
    return true;
  }

  const htmlTagPattern =
    /<\/?[a-zA-Z][^>]*>/;

  const hasHtml =
    htmlTagPattern.test(trimmed);

  const hasCodeIndicators =
    trimmed.includes("=") ||
    trimmed.includes(";") ||
    trimmed.includes("=>") ||
    trimmed.includes("{") ||
    trimmed.includes("}") ||
    trimmed.includes("className") ||
    trimmed.includes("console.") ||
    trimmed.includes("function ");

  return (
    hasHtml &&
    hasCodeIndicators
  );
}

// =====================================================
// CONTENT BLOCK PARSER
// =====================================================

function buildContentBlocks(
  content: string,
): string[] {
  if (!content) {
    return [];
  }

  return content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map(
      (block) =>
        block.trim(),
    )
    .filter(Boolean);
}

// =====================================================
// COMPONENT
// =====================================================

export default function LessonPage() {
  const {
    technologyId,
    chapterId,
    lessonId,
  } = useParams<{
    technologyId: string;
    chapterId: string;
    lessonId: string;
  }>();

  const navigate =
    useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [
    technology,
    setTechnology,
  ] =
    useState<Technology | null>(
      null,
    );

  const [
    chapter,
    setChapter,
  ] =
    useState<Chapter | null>(
      null,
    );

  const [
    lesson,
    setLesson,
  ] =
    useState<Lesson | null>(
      null,
    );

  const [
    chapterLessons,
    setChapterLessons,
  ] =
    useState<Lesson[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  // ===================================================
  // LOAD LESSON
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function loadLessonData() {
      if (
        !technologyId ||
        !chapterId ||
        !lessonId
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ===============================================
        // TECHNOLOGY
        // ===============================================

        const technologyData =
          await apiGet<any>(
            `/content/technologies/${encodeURIComponent(
              technologyId,
            )}`,
          );

        const normalizedTechnology =
          normalizeTechnology(
            technologyData,
          );

        if (
          !normalizedTechnology
        ) {
          throw new Error(
            "Technology not found.",
          );
        }

        // ===============================================
        // CHAPTER
        // ===============================================

        const chapterData =
          await apiGet<any>(
            `/content/chapters/${encodeURIComponent(
              chapterId,
            )}`,
          );

        const normalizedChapter =
          normalizeChapter(
            chapterData,
          );

        if (
          !normalizedChapter
        ) {
          throw new Error(
            "Chapter not found.",
          );
        }

        // ===============================================
        // VALIDATE CHAPTER TECHNOLOGY
        // ===============================================

        if (
          normalizedChapter.technologyId !==
          String(technologyId)
        ) {
          throw new Error(
            "This chapter does not belong to the selected technology.",
          );
        }

        // ===============================================
        // LESSON
        // ===============================================

        const lessonData =
          await apiGet<any>(
            `/content/lessons/${encodeURIComponent(
              lessonId,
            )}`,
          );

        const normalizedLesson =
          normalizeLesson(
            lessonData,
          );

        if (
          normalizedLesson.chapterId !==
          String(chapterId)
        ) {
          throw new Error(
            "This lesson does not belong to the selected chapter.",
          );
        }

        // ===============================================
        // CHAPTER LESSONS
        // ===============================================

        const chapterLessonData =
          await apiGet<any>(
            `/content/lessons/chapter/${encodeURIComponent(
              chapterId,
            )}`,
          );

        const lessonArray =
          Array.isArray(
            chapterLessonData,
          )
            ? chapterLessonData
            : [];

        const normalizedLessons =
          lessonArray
            .map(
              normalizeLesson,
            )
            .filter(
              (item) =>
                item.isActive !==
                false,
            )
            .sort(
              (a, b) =>
                Number(
                  a.lessonNumber ??
                    a.displayOrder ??
                    0,
                ) -
                Number(
                  b.lessonNumber ??
                    b.displayOrder ??
                    0,
                ),
            );

        // ===============================================
        // SET STATE
        // ===============================================

        if (!cancelled) {
          setTechnology(
            normalizedTechnology,
          );

          setChapter(
            normalizedChapter,
          );

          setLesson(
            normalizedLesson,
          );

          setChapterLessons(
            normalizedLessons,
          );
        }
      } catch (loadError) {
        console.error(
          "[LESSON PAGE LOAD ERROR]",
          loadError,
        );

        if (!cancelled) {
          setTechnology(null);
          setChapter(null);
          setLesson(null);
          setChapterLessons([]);

          setError(
            loadError instanceof
            Error
              ? loadError.message
              : "Failed to load lesson.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLessonData();

    return () => {
      cancelled = true;
    };
  }, [
    technologyId,
    chapterId,
    lessonId,
  ]);

  // ===================================================
  // CURRENT LESSON INDEX
  // ===================================================

  const currentLessonIndex =
    useMemo(() => {
      if (!lesson) {
        return -1;
      }

      return chapterLessons.findIndex(
        (item) =>
          item.id ===
          lesson.id,
      );
    }, [
      chapterLessons,
      lesson,
    ]);

  // ===================================================
  // PREVIOUS LESSON
  // ===================================================

  const previousLesson =
    currentLessonIndex > 0
      ? chapterLessons[
          currentLessonIndex - 1
        ]
      : undefined;

  // ===================================================
  // NEXT LESSON
  // ===================================================

  const nextLesson =
    currentLessonIndex >= 0 &&
    currentLessonIndex <
      chapterLessons.length - 1
      ? chapterLessons[
          currentLessonIndex + 1
        ]
      : undefined;

  // ===================================================
  // NAVIGATION PATH
  // ===================================================

  function getLessonPath(
    targetLessonId: string,
  ) {
    return `/learning/${technologyId}/chapter/${chapterId}/lesson/${targetLessonId}`;
  }

  // ===================================================
  // PREVIOUS
  // ===================================================

  function handlePrevious() {
    if (
      !previousLesson
    ) {
      return;
    }

    navigate(
      getLessonPath(
        previousLesson.id,
      ),
    );
  }

  // ===================================================
  // NEXT
  // ===================================================

  function handleNext() {
    if (!nextLesson) {
      return;
    }

    navigate(
      getLessonPath(
        nextLesson.id,
      ),
    );
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <main className="lesson-page">

        <section className="lesson-container">

          <div className="lesson-loading-card">

            <div className="lesson-loading-icon">
              ...
            </div>

            <h1>
              Loading Lesson
            </h1>

            <p>
              Preparing your learning
              content...
            </p>

          </div>

        </section>

      </main>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (
    error ||
    !technology ||
    !chapter ||
    !lesson
  ) {
    return (
      <main className="lesson-page">

        <section className="lesson-container">

          <div className="lesson-error-card">

            <span className="lesson-error-badge">
              LEARNING
            </span>

            <h1>
              Lesson Not Found
            </h1>

            <p>
              {error ||
                "The requested lesson could not be loaded."}
            </p>

            <div className="lesson-error-actions">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/learning",
                  )
                }
              >
                ← Back to Learning
              </button>

              {technologyId ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/learning/${technologyId}`,
                    )
                  }
                >
                  Back to Technology
                </button>
              ) : null}

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ===================================================
  // CONTENT BLOCKS
  // ===================================================

  const contentBlocks =
    buildContentBlocks(
      lesson.content || "",
    );

  // ===================================================
  // LESSON NUMBER
  // ===================================================

  const lessonNumber =
    lesson.lessonNumber ??
    lesson.displayOrder ??
    "";

  const chapterNumber =
    chapter.chapterNumber ??
    chapter.displayOrder ??
    "";

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="lesson-page">

      <section className="lesson-container">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <nav
          className="lesson-breadcrumb"
          aria-label="Breadcrumb"
        >

          <Link to="/learning">
            Learning
          </Link>

          <span>
            /
          </span>

          <Link
            to={`/learning/${technology.id}`}
          >
            {technology.name}
          </Link>

          <span>
            /
          </span>

          <Link
            to={`/learning/${technology.id}/chapter/${chapter.id}`}
          >
            Chapter{" "}
            {chapterNumber}
          </Link>

          <span>
            /
          </span>

          <span>
            Lesson{" "}
            {lessonNumber}
          </span>

        </nav>

        {/* =================================================
            LESSON HERO
        ================================================= */}

        <header className="lesson-hero">

          <div className="lesson-hero-badges">

            <span className="lesson-badge">
              {technology.name}
            </span>

            <span className="lesson-badge secondary">
              CHAPTER{" "}
              {chapterNumber}
            </span>

            <span className="lesson-badge secondary">
              LESSON{" "}
              {lessonNumber}
            </span>

          </div>

          <h1>
            {lesson.title}
          </h1>

          {chapter.title ? (
            <p className="lesson-chapter-title">
              {chapter.title}
            </p>
          ) : null}

        </header>

        {/* =================================================
            LESSON CONTENT
        ================================================= */}

        <article className="lesson-content-card">

          <div className="lesson-content-heading">

            <div>

              <span>
                LEARNING CONTENT
              </span>

              <h2>
                Understand the concept
              </h2>

            </div>

          </div>

          {contentBlocks.length === 0 ? (

            <div className="lesson-empty-content">

              <h3>
                Content not available
              </h3>

              <p>
                This lesson does not
                contain learning material
                yet.
              </p>

            </div>

          ) : (

            <div className="lesson-content">

              {contentBlocks.map(
                (
                  block,
                  index,
                ) => {

                  const code =
                    isCodeBlock(
                      block,
                    );

                  return code ? (

                    <section
                      key={index}
                      className="lesson-code-section"
                    >

                      <div className="lesson-code-header">

                        <span>
                          HTML CODE
                        </span>

                        <span>
                          Example{" "}
                          {index + 1}
                        </span>

                      </div>

                      <pre className="lesson-code-block">
                        <code>
                          {block}
                        </code>
                      </pre>

                    </section>

                  ) : (

                    <section
                      key={index}
                      className="lesson-text-section"
                    >

                      {block
                        .split("\n")
                        .map(
                          (
                            line,
                            lineIndex,
                          ) =>
                            line.trim() ? (
                              <p
                                key={
                                  lineIndex
                                }
                              >
                                {line}
                              </p>
                            ) : null,
                        )}

                    </section>

                  );
                },
              )}

            </div>

          )}

        </article>

        {/* =================================================
            LESSON NAVIGATION
        ================================================= */}

        <section className="lesson-navigation">

          <div className="lesson-navigation-left">

            <button
              type="button"
              disabled={
                !previousLesson
              }
              onClick={
                handlePrevious
              }
            >
              ← Previous Lesson
            </button>

          </div>

          <div className="lesson-navigation-center">

            <span>
              {currentLessonIndex >=
              0
                ? `Lesson ${
                    currentLessonIndex +
                    1
                  } of ${
                    chapterLessons.length
                  }`
                : `Lesson ${
                    lessonNumber ||
                    1
                  }`}
            </span>

          </div>

          <div className="lesson-navigation-right">

            <button
              type="button"
              disabled={
                !nextLesson
              }
              onClick={
                handleNext
              }
            >
              Next Lesson →
            </button>

          </div>

        </section>

        {/* =================================================
            CHAPTER ACTIONS
        ================================================= */}

        <section className="lesson-bottom-actions">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/learning/${technology.id}/chapter/${chapter.id}`,
              )
            }
          >
            ← Back to Chapter
          </button>

          {nextLesson ? (

            <button
              type="button"
              className="lesson-primary-action"
              onClick={
                handleNext
              }
            >
              Continue Learning →
            </button>

          ) : (

            <button
              type="button"
              className="lesson-primary-action"
              onClick={() =>
                navigate(
                  `/test/chapter/${technology.id}/${chapter.id}`,
                )
              }
            >
              Finish Lessons →
            </button>

          )}

        </section>

      </section>

    </main>
  );
}
