
// =====================================================
// DLTJ2.10
// LEARNING — CHAPTER PAGE
// FILE: src/pages/Learning/Chapter.tsx
// DATE: 2026-09-07
// LOCATION: src/pages/Learning
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Header from "../../components/common/Header";

import "./Chapter.css";

// =====================================================
// TYPES
// =====================================================

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

interface Test {
  id: string;
  technologyId: string;
  title: string;
  testType: string;
  startChapter?: number | null;
  endChapter?: number | null;
  passPercentage?: number | null;
  displayOrder?: number;
  isActive?: boolean;
}

// =====================================================
// API BASE
// =====================================================
const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";
// =====================================================
// API HELPER
// =====================================================

async function apiGet<T>(
  endpoint: string
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Request failed"
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
          "Request failed"
      );
    }

    return result.data as T;
  }

  return result as T;
}

// =====================================================
// NORMALIZE CHAPTER
// =====================================================

function normalizeChapter(
  value: any
): Chapter | null {
  if (!value) {
    return null;
  }

  return {
    id: String(value.id),

    technologyId: String(
      value.technologyId ??
        value.technology_id ??
        ""
    ),

    chapterNumber:
      value.chapterNumber ??
      value.chapter_number,

    title:
      value.title ||
      "Untitled Chapter",

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
  value: any
): Lesson {
  return {
    id: String(value.id),

    chapterId: String(
      value.chapterId ??
        value.chapter_id ??
        ""
    ),

    lessonNumber:
      value.lessonNumber ??
      value.lesson_number,

    title:
      value.title ||
      "Untitled Lesson",

    content:
      value.content ??
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
// NORMALIZE TEST
// =====================================================

function normalizeTest(
  value: any
): Test {
  return {
    id: String(value.id),

    technologyId: String(
      value.technologyId ??
        value.technology_id ??
        ""
    ),

    title:
      value.title ||
      "Chapter Test",

    testType:
      value.testType ??
      value.test_type ??
      "CHAPTER_TEST",

    startChapter:
      value.startChapter ??
      value.start_chapter ??
      null,

    endChapter:
      value.endChapter ??
      value.end_chapter ??
      null,

    passPercentage:
      value.passPercentage ??
      value.pass_percentage ??
      60,

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
// COMPONENT
// =====================================================

export default function Chapter() {
  const {
    technologyId,
    chapterId,
  } =
    useParams<{
      technologyId: string;
      chapterId: string;
    }>();

  const navigate =
    useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [
    chapter,
    setChapter,
  ] =
    useState<Chapter | null>(
      null
    );

  const [
    lessons,
    setLessons,
  ] =
    useState<Lesson[]>([]);

  const [
    chapterTest,
    setChapterTest,
  ] =
    useState<Test | null>(
      null
    );

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
  // LOAD DYNAMIC CONTENT
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function loadChapterData() {
      if (
        !technologyId ||
        !chapterId
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // =================================================
        // CHAPTER
        // GET /api/content/chapters/:id
        // =================================================

        const chapterData =
          await apiGet<any>(
            `/content/chapters/${encodeURIComponent(
              chapterId
            )}`
          );

        const normalizedChapter =
          normalizeChapter(
            chapterData
          );

        if (
          !normalizedChapter
        ) {
          throw new Error(
            "Chapter not found"
          );
        }

        // =================================================
        // TECHNOLOGY VALIDATION
        // =================================================

        if (
          normalizedChapter.technologyId !==
          String(technologyId)
        ) {
          throw new Error(
            "This chapter does not belong to the selected technology."
          );
        }

        // =================================================
        // LESSONS
        // GET /api/content/lessons/chapter/:chapterId
        // =================================================

        const lessonData =
          await apiGet<any>(
            `/content/lessons/chapter/${encodeURIComponent(
              chapterId
            )}`
          );

        const lessonArray =
          Array.isArray(
            lessonData
          )
            ? lessonData
            : [];

        const normalizedLessons =
          lessonArray
            .map(normalizeLesson)
            .filter(
              (lesson) =>
                lesson.isActive !==
                false
            )
            .sort(
              (
                a,
                b
              ) =>
                Number(
                  a.lessonNumber ??
                    a.displayOrder ??
                    0
                ) -
                Number(
                  b.lessonNumber ??
                    b.displayOrder ??
                    0
                )
            );

        // =================================================
        // TESTS
        // GET /api/content/tests/technology/:technologyId
        // =================================================

        let matchedTest:
          Test | null =
          null;

        try {
          const testData =
            await apiGet<any>(
              `/content/tests/technology/${encodeURIComponent(
                technologyId
              )}`
            );

          const testArray =
            Array.isArray(
              testData
            )
              ? testData
              : [];

          const normalizedTests =
            testArray
              .map(normalizeTest)
              .filter(
                (test) =>
                  test.isActive !==
                  false
              )
              .sort(
                (a, b) =>
                  Number(
                    a.displayOrder ??
                      0
                  ) -
                  Number(
                    b.displayOrder ??
                      0
                  )
              );

          // =================================================
          // FIND TEST FOR CURRENT CHAPTER
          // =================================================

          matchedTest =
            normalizedTests.find(
              (test) => {
                const start =
                  Number(
                    test.startChapter
                  );

                const end =
                  Number(
                    test.endChapter
                  );

                const currentChapter =
                  Number(
                    normalizedChapter.chapterNumber
                  );

                if (
                  test.testType !==
                    "CHAPTER_TEST" &&
                  test.testType !==
                    "chapter_test"
                ) {
                  return false;
                }

                if (
                  !Number.isFinite(
                    currentChapter
                  )
                ) {
                  return false;
                }

                if (
                  !Number.isFinite(
                    start
                  ) ||
                  !Number.isFinite(
                    end
                  )
                ) {
                  return false;
                }

                return (
                  currentChapter >=
                    start &&
                  currentChapter <=
                    end
                );
              }
            ) || null;
        } catch {
          // Test loading failure should not
          // prevent the chapter and lessons
          // from being displayed.
          matchedTest = null;
        }

        // =================================================
        // SET STATE
        // =================================================

        if (!cancelled) {
          setChapter(
            normalizedChapter
          );

          setLessons(
            normalizedLessons
          );

          setChapterTest(
            matchedTest
          );
        }
      } catch (loadError) {
        console.error(
          "[LEARNING CHAPTER LOAD ERROR]",
          loadError
        );

        if (!cancelled) {
          setChapter(null);
          setLessons([]);
          setChapterTest(null);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load chapter."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadChapterData();

    return () => {
      cancelled = true;
    };
  }, [
    technologyId,
    chapterId,
  ]);

  // ===================================================
  // INVALID PARAMETERS
  // ===================================================

  if (
    !technologyId ||
    !chapterId
  ) {
    return (
      <div className="dltj-app">

        <Header
          title="Chapter Not Found"
          subtitle="Learning"
          showHomeButton
        />

        <main className="dltj-page">

          <section className="test-result-box">

            <h2>
              Chapter not found
            </h2>

            <p>
              The requested chapter is
              not available.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/learning"
                )
              }
            >
              ← Back to Learning
            </button>

          </section>

        </main>

      </div>
    );
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="dltj-app">

        <Header
          title="Loading Chapter..."
          subtitle="Learning"
          showHomeButton
        />

        <main className="dltj-page">

          <section className="test-result-box">

            <h2>
              Loading chapter
            </h2>

            <p>
              Please wait while the
              learning content is loaded.
            </p>

          </section>

        </main>

      </div>
    );
  }

  // ===================================================
  // ERROR / NOT FOUND
  // ===================================================

  if (
    !chapter ||
    error
  ) {
    return (
      <div className="dltj-app">

        <Header
          title="Chapter Not Found"
          subtitle="Learning"
          showHomeButton
        />

        <main className="dltj-page">

          <section className="test-result-box">

            <h2>
              Chapter not found
            </h2>

            <p>
              {error ||
                "This chapter is not available."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/learning/${technologyId}`
                )
              }
            >
              ← Back to Technology
            </button>

          </section>

        </main>

      </div>
    );
  }

  // ===================================================
  // CHAPTER NUMBER
  // ===================================================

  const chapterNumber =
    chapter.chapterNumber ??
    chapter.displayOrder ??
    "";

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="dltj-app">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        title={
          chapter.title ||
          `Chapter ${chapterNumber}`
        }
        subtitle="Learning"
        showHomeButton
      />

      <main className="dltj-page">

        {/* =================================================
            CHAPTER HEADER
        ================================================= */}

        <section className="learning-header">

          <span className="learning-badge">
            CHAPTER{" "}
            {chapterNumber}
          </span>

          <h1>
            {chapter.title}
          </h1>

          {chapter.description ? (
            <p>
              {chapter.description}
            </p>
          ) : null}

        </section>

        {/* =================================================
            LESSONS
        ================================================= */}

        <section className="learning-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                LESSONS
              </span>

              <h2>
                Chapter Lessons
              </h2>

            </div>

            <span className="section-count">

              {lessons.length}{" "}

              {lessons.length === 1
                ? "Lesson"
                : "Lessons"}

            </span>

          </div>

          {/* =================================================
              NO LESSONS
          ================================================= */}

          {lessons.length === 0 ? (

            <div className="empty-state">

              <h3>
                No lessons available
              </h3>

              <p>
                Lessons for this
                chapter have not been
                added yet.
              </p>

            </div>

          ) : (

            /* =================================================
               LESSON GRID
            ================================================= */

            <div className="learning-card-grid">

              {lessons.map(
                (
                  lesson,
                  index
                ) => (

                  <article
                    key={
                      lesson.id
                    }
                    className="learning-card"
                  >

                    <div className="learning-card-number">
                      {lesson.lessonNumber ??
                        index + 1}
                    </div>

                    <div className="learning-card-content">

                      <h3>
                        {lesson.title}
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/learning/${technologyId}/chapter/${chapterId}/lesson/${lesson.id}`
                          )
                        }
                      >
                        Start Lesson →
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

        {/* =================================================
            CHAPTER TEST
        ================================================= */}

        <section className="learning-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                TEST
              </span>

              <h2>
                Chapter Test
              </h2>

            </div>

          </div>

          <div className="test-result-box">

            <h3>
              {chapterTest?.title ||
                "Test your knowledge"}
            </h3>

            <p>

              {chapterTest
                ? `Complete the lessons and take the chapter test. Pass percentage: ${chapterTest.passPercentage ?? 60}%.`
                : "Complete the lessons before attempting the chapter test."}

            </p>

            {chapterTest ? (

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/test/chapter/${technologyId}/${chapterId}`
                  )
                }
              >
                Start Chapter Test →
              </button>

            ) : (

              <button
                type="button"
                disabled
                title="Chapter test is not available yet"
              >
                Chapter Test Unavailable
              </button>

            )}

          </div>

        </section>

        {/* =================================================
            BACK TO TECHNOLOGY
        ================================================= */}

        <div className="learning-back-button">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/learning/${technologyId}`
              )
            }
          >
            ← Back to Technology
          </button>

        </div>

      </main>

    </div>
  );
}
