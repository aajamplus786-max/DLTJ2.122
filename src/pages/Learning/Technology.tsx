
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// FILE: src/pages/Learning/Technology.tsx
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

import "./Technology.css";

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
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

// =====================================================
// API GET
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

  let result: any;

  try {
    result =
      await response.json();
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
    id: String(
      value.id,
    ),

    name:
      value.name ||
      "Technology",

    section:
      value.section ??
      null,

    displayOrder:
      value.displayOrder ??
      value.display_order ??
      0,

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
): Chapter {
  return {
    id: String(
      value.id,
    ),

    technologyId: String(
      value.technologyId ??
        value.technology_id ??
        "",
    ),

    chapterNumber:
      value.chapterNumber ??
      value.chapter_number ??
      value.displayOrder ??
      value.display_order ??
      0,

    title:
      value.title ||
      "Untitled Chapter",

    description:
      value.description ??
      null,

    displayOrder:
      value.displayOrder ??
      value.display_order ??
      value.chapterNumber ??
      value.chapter_number ??
      0,

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
  value: any,
): Test {
  return {
    id: String(
      value.id,
    ),

    technologyId: String(
      value.technologyId ??
        value.technology_id ??
        "",
    ),

    title:
      value.title ||
      "Test",

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
      value.display_order ??
      0,

    isActive:
      value.isActive ??
      value.is_active ??
      true,
  };
}

// =====================================================
// COMPONENT
// =====================================================

export default function Technology() {
  const {
    technologyId,
  } =
    useParams<{
      technologyId: string;
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
    chapters,
    setChapters,
  ] =
    useState<Chapter[]>([]);

  const [
    tests,
    setTests,
  ] =
    useState<Test[]>([]);

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
  // LOAD DATABASE CONTENT
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function loadTechnology() {
      if (!technologyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // =============================================
        // TECHNOLOGY
        // =============================================

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

        // =============================================
        // CHAPTERS
        // =============================================

        const chapterData =
          await apiGet<any>(
            `/content/chapters/technology/${encodeURIComponent(
              technologyId,
            )}`,
          );

        const chapterArray =
          Array.isArray(
            chapterData,
          )
            ? chapterData
            : [];

        const normalizedChapters =
          chapterArray
            .map(
              normalizeChapter,
            )
            .filter(
              (
                chapter,
              ) =>
                chapter.isActive !==
                false,
            )
            .filter(
              (
                chapter,
              ) =>
                chapter.technologyId ===
                String(
                  technologyId,
                ),
            )
            .sort(
              (
                a,
                b,
              ) =>
                Number(
                  a.chapterNumber ??
                    a.displayOrder ??
                    0,
                ) -
                Number(
                  b.chapterNumber ??
                    b.displayOrder ??
                    0,
                ),
            );

        // =============================================
        // TESTS
        // =============================================

        let normalizedTests:
          Test[] = [];

        try {
          const testData =
            await apiGet<any>(
              `/content/tests/technology/${encodeURIComponent(
                technologyId,
              )}`,
            );

          const testArray =
            Array.isArray(
              testData,
            )
              ? testData
              : [];

          normalizedTests =
            testArray
              .map(
                normalizeTest,
              )
              .filter(
                (
                  test,
                ) =>
                  test.isActive !==
                  false,
              )
              .sort(
                (
                  a,
                  b,
                ) =>
                  Number(
                    a.displayOrder ??
                      0,
                  ) -
                  Number(
                    b.displayOrder ??
                      0,
                  ),
              );
        } catch (
          testError
        ) {
          console.error(
            "[TECHNOLOGY TEST LOAD ERROR]",
            testError,
          );

          normalizedTests = [];
        }

        // =============================================
        // SET STATE
        // =============================================

        if (!cancelled) {
          setTechnology(
            normalizedTechnology,
          );

          setChapters(
            normalizedChapters,
          );

          setTests(
            normalizedTests,
          );
        }
      } catch (
        loadError
      ) {
        console.error(
          "[TECHNOLOGY PAGE LOAD ERROR]",
          loadError,
        );

        if (!cancelled) {
          setTechnology(null);
          setChapters([]);
          setTests([]);

          setError(
            loadError instanceof
            Error
              ? loadError.message
              : "Failed to load technology.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTechnology();

    return () => {
      cancelled = true;
    };
  }, [
    technologyId,
  ]);

  // ===================================================
  // CHAPTER TEST GROUPS
  // ===================================================

  const chapterTests =
    tests.filter(
      (test) =>
        test.testType ===
          "CHAPTER_TEST" ||
        test.testType ===
          "chapter_test",
    );

  // ===================================================
  // FINAL TEST
  // ===================================================

  const finalTest =
    tests.find(
      (test) =>
        test.testType ===
          "FINAL_TEST" ||
        test.testType ===
          "final_test",
    );

  // ===================================================
  // FIND CHAPTER TEST
  // ===================================================

  function getChapterTest(
    chapterNumber: number,
  ): Test | undefined {
    return chapterTests.find(
      (test) => {
        const start =
          Number(
            test.startChapter,
          );

        const end =
          Number(
            test.endChapter,
          );

        if (
          !Number.isFinite(
            start,
          ) ||
          !Number.isFinite(
            end,
          )
        ) {
          return false;
        }

        return (
          chapterNumber >=
            start &&
          chapterNumber <=
            end
        );
      },
    );
  }

  // ===================================================
  // INVALID PARAMETERS
  // ===================================================

  if (!technologyId) {
    return (
      <div className="dltj-app">

        <Header
          title="Technology Not Found"
          subtitle="Learning"
          showHomeButton
        />

        <main className="dltj-page">

          <section className="test-result-box">

            <h2>
              Technology not found
            </h2>

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
          title="Loading..."
          subtitle="Learning"
          showHomeButton
        />

        <main className="dltj-page">

          <section className="test-result-box">

            <h2>
              Loading course
            </h2>

            <p>
              Loading chapters and
              lessons from the database...
            </p>

          </section>

        </main>

      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (
    error ||
    !technology
  ) {
    return (
      <div className="dltj-app">

        <Header
          title="Learning Error"
          subtitle="Learning"
          showHomeButton
        />

        <main className="dltj-page">

          <section className="test-result-box">

            <h2>
              Unable to load course
            </h2>

            <p>
              {error ||
                "Technology is not available."}
            </p>

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

          </section>

        </main>

      </div>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="dltj-app">

      <Header
        title={
          technology.name
        }
        subtitle="Learning"
        showHomeButton
      />

      <main className="dltj-page">

        {/* =================================================
            COURSE HEADER
        ================================================= */}

        <section className="learning-header">

          <span className="learning-badge">
            {technology.name}
          </span>

          <h1>
            {technology.name}
          </h1>

          <p>
            {technology.section ||
              `Complete each chapter, learn the concepts, practice questions, and pass the tests.`}
          </p>

        </section>

        {/* =================================================
            PROGRESS SUMMARY
        ================================================= */}

        <section
          className="learning-section"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                LEARNING PROGRESS
              </span>

              <h2>
                Course Overview
              </h2>

            </div>

            <span className="section-count">
              0 /{" "}
              {chapters.length}{" "}
              Chapters
            </span>

          </div>

          <div className="test-result-box">

            <h3>
              Start your {technology.name} journey
            </h3>

            <p>
              Learn every chapter step by step.
              Complete the lessons before attempting
              the chapter tests.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "16px",
              }}
            >

              <strong>
                {chapters.length}
              </strong>

              <span>
                {chapters.length ===
                1
                  ? "Chapter"
                  : "Chapters"}
              </span>

              <span>
                •
              </span>

              <strong>
                {chapterTests.length}
              </strong>

              <span>
                Chapter Tests
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            CHAPTERS
        ================================================= */}

        <section
          className="learning-section"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                CHAPTERS
              </span>

              <h2>
                {technology.name} Course
              </h2>

            </div>

            <span className="section-count">
              {chapters.length}{" "}
              {chapters.length ===
              1
                ? "Chapter"
                : "Chapters"}
            </span>

          </div>

          {chapters.length ===
          0 ? (

            <div className="empty-state">

              <h3>
                No chapters available
              </h3>

              <p>
                No chapters have been
                imported for this
                technology yet.
              </p>

            </div>

          ) : (

            <div
              className="learning-card-grid"
            >

              {chapters.map(
                (
                  chapter,
                  index,
                ) => {

                  const chapterNumber =
                    Number(
                      chapter.chapterNumber ??
                        index + 1,
                    );

                  const test =
                    getChapterTest(
                      chapterNumber,
                    );

                  return (
                    <article
                      key={
                        chapter.id
                      }
                      className="learning-card"
                    >

                      {/* ============================
                          CHAPTER NUMBER
                      ============================ */}

                      <div className="learning-card-number">
                        {String(
                          chapterNumber,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </div>

                      {/* ============================
                          CHAPTER CONTENT
                      ============================ */}

                      <div className="learning-card-content">

                        <h3>
                          {chapter.title}
                        </h3>

                        <p>
                          {chapter.description ||
                            `Learn ${technology.name} concepts in Chapter ${chapterNumber} step by step.`}
                        </p>

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "8px",
                            flexWrap:
                              "wrap",
                            marginBottom:
                              "14px",
                          }}
                        >

                          <span
                            style={{
                              padding:
                                "5px 9px",
                              border:
                                "1px solid #e2e4e7",
                              borderRadius:
                                "8px",
                              fontSize:
                                "11px",
                              color:
                                "#666",
                              background:
                                "#f7f8f9",
                            }}
                          >
                            Chapter
                          </span>

                          {test ? (
                            <span
                              style={{
                                padding:
                                  "5px 9px",
                                border:
                                  "1px solid #e4d477",
                                borderRadius:
                                  "8px",
                                fontSize:
                                  "11px",
                                color:
                                  "#765c00",
                                background:
                                  "#fffcef",
                              }}
                            >
                              Test Available
                            </span>
                          ) : null}

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/learning/${technology.id}/chapter/${chapter.id}`,
                            )
                          }
                        >
                          Start Chapter →
                        </button>

                      </div>

                    </article>
                  );
                },
              )}

            </div>

          )}

        </section>

        {/* =================================================
            FINAL TEST
        ================================================= */}

        <section
          className="learning-section"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                FINAL TEST
              </span>

              <h2>
                {finalTest?.title ||
                  `${technology.name} Final Test`}
              </h2>

            </div>

          </div>

          <div className="test-result-box">

            {finalTest ? (

              <>
                <h3>
                  Complete the full
                  course
                </h3>

                <p>
                  Finish all chapters and
                  then take the final
                  mastery test.
                  Pass percentage:{" "}
                  {finalTest.passPercentage ??
                    60}
                  %.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/test/final/${technology.id}/${finalTest.id}`,
                    )
                  }
                >
                  Start Final Test →
                </button>
              </>

            ) : (

              <>
                <h3>
                  Final test is not
                  available yet
                </h3>

                <p>
                  Complete the course
                  content first. The final
                  test will appear when it
                  is available.
                </p>

                <button
                  type="button"
                  disabled
                >
                  Final Test Unavailable
                </button>
              </>

            )}

          </div>

        </section>

        {/* =================================================
            BACK
        ================================================= */}

        <div
          className="learning-back-button"
        >

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

        </div>

      </main>

    </div>
  );
}
