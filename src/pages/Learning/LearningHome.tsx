
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// FILE: src/pages/Learning/LearningHome.tsx
// DATE: 2026-09-07
// LOCATION: src/pages/Learning
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./LearningHome.css";

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

  let result: any = null;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      "Invalid response from server.",
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
): Technology {
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
      value.chapter_number,

    title:
      value.title ||
      "Untitled Chapter",

    description:
      value.description ??
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
// COMPONENT
// =====================================================

export default function LearningHome() {
  const navigate =
    useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [
    technologies,
    setTechnologies,
  ] =
    useState<Technology[]>([]);

  const [
    chapterCounts,
    setChapterCounts,
  ] =
    useState<
      Record<string, number>
    >({});

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
  // LOAD TECHNOLOGIES + CHAPTER COUNTS
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function loadLearningHome() {
      try {
        setLoading(true);
        setError("");

        // =============================================
        // LOAD ACTIVE TECHNOLOGIES
        // =============================================

        const technologyData =
          await apiGet<any>(
            "/content/technologies",
          );

        const technologyArray =
          Array.isArray(
            technologyData,
          )
            ? technologyData
            : [];

        const normalizedTechnologies =
          technologyArray
            .map(
              normalizeTechnology,
            )
            .filter(
              (
                technology,
              ) =>
                technology.isActive !==
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

        // =============================================
        // LOAD CHAPTER COUNTS
        // =============================================

        const countEntries =
          await Promise.all(
            normalizedTechnologies.map(
              async (
                technology,
              ) => {
                try {
                  const chapterData =
                    await apiGet<any>(
                      `/content/chapters/technology/${encodeURIComponent(
                        technology.id,
                      )}`,
                    );

                  const chapterArray =
                    Array.isArray(
                      chapterData,
                    )
                      ? chapterData
                      : [];

                  const activeChapters =
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
                      );

                  return [
                    technology.id,
                    activeChapters.length,
                  ] as const;
                } catch (
                  chapterError
                ) {
                  console.error(
                    `[LEARNING HOME CHAPTER LOAD ERROR] ${technology.name}`,
                    chapterError,
                  );

                  return [
                    technology.id,
                    0,
                  ] as const;
                }
              },
            ),
          );

        const counts =
          Object.fromEntries(
            countEntries,
          );

        // =============================================
        // UPDATE STATE
        // =============================================

        if (!cancelled) {
          setTechnologies(
            normalizedTechnologies,
          );

          setChapterCounts(
            counts,
          );
        }
      } catch (loadError) {
        console.error(
          "[LEARNING HOME LOAD ERROR]",
          loadError,
        );

        if (!cancelled) {
          setTechnologies([]);
          setChapterCounts({});

          setError(
            loadError instanceof
            Error
              ? loadError.message
              : "Failed to load learning content.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLearningHome();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===================================================
  // TOTAL CHAPTERS
  // ===================================================

  const totalChapters =
    Object.values(
      chapterCounts,
    ).reduce(
      (
        total,
        count,
      ) =>
        total + count,
      0,
    );

  // ===================================================
  // LOADING UI
  // ===================================================

  if (loading) {
    return (
      <main className="learning-page">

        <section className="learning-hero">

          <div className="learning-hero-glow learning-glow-yellow" />

          <div className="learning-hero-glow learning-glow-rose" />

          <div className="learning-hero-content">

            <span className="learning-eyebrow">
              DLTJ2.10 • LEARNING
            </span>

            <h1>
              Learn. Practice. Build.
            </h1>

            <p>
              Loading your dynamic learning
              courses...
            </p>

          </div>

        </section>

        <section className="learning-container">

          <div className="learning-empty">

            <div className="learning-empty-icon">
              ...
            </div>

            <h3>
              Loading Learning Content
            </h3>

            <p>
              Please wait while your
              technologies and chapters
              are loaded.
            </p>

          </div>

        </section>

      </main>
    );
  }

  // ===================================================
  // ERROR UI
  // ===================================================

  if (error) {
    return (
      <main className="learning-page">

        <section className="learning-hero">

          <div className="learning-hero-glow learning-glow-yellow" />

          <div className="learning-hero-glow learning-glow-rose" />

          <div className="learning-hero-content">

            <span className="learning-eyebrow">
              DLTJ2.10 • LEARNING
            </span>

            <h1>
              Learn. Practice. Build.
            </h1>

            <p>
              Your learning platform is
              ready. We could not load the
              current course data.
            </p>

          </div>

        </section>

        <section className="learning-container">

          <div className="learning-empty">

            <div className="learning-empty-icon">
              !
            </div>

            <h3>
              Learning Content Unavailable
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="learning-back-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Retry
            </button>

          </div>

        </section>

      </main>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="learning-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="learning-hero">

        <div className="learning-hero-glow learning-glow-yellow" />

        <div className="learning-hero-glow learning-glow-rose" />

        <div className="learning-hero-content">

          <span className="learning-eyebrow">
            DLTJ2.10 • LEARNING
          </span>

          <h1>
            Learn. Practice. Build.
          </h1>

          <p>
            Learn technologies step by step
            through structured chapters,
            lessons, practice and tests.
          </p>

        </div>

      </section>

      {/* =================================================
          TECHNOLOGIES
      ================================================= */}

      <section className="learning-container">

        <div className="learning-page-heading">

          <div>

            <span className="learning-eyebrow">
              TECHNOLOGIES
            </span>

            <h2>
              Choose Your Technology
            </h2>

            <p>
              Explore dynamically managed
              courses, chapters and lessons.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
            className="learning-back-button"
          >
            ← Home
          </button>

        </div>

        {/* =================================================
            TOTAL SUMMARY
        ================================================= */}

        <div
          className="learning-progress-summary"
          style={{
            marginBottom:
              "28px",
          }}
        >
          <strong>
            {technologies.length}
          </strong>

          <span>
            {technologies.length === 1
              ? "Technology"
              : "Technologies"}
          </span>

          <span>
            •
          </span>

          <strong>
            {totalChapters}
          </strong>

          <span>
            {totalChapters === 1
              ? "Chapter"
              : "Chapters"}
          </span>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {technologies.length === 0 ? (

          <div className="learning-empty">

            <div className="learning-empty-icon">
              ◇
            </div>

            <h3>
              No Learning Content
            </h3>

            <p>
              No active technologies have
              been added yet.
            </p>

          </div>

        ) : (

          <div className="learning-technology-grid">

            {technologies.map(
              (
                technology,
              ) => {

                const count =
                  chapterCounts[
                    technology.id
                  ] ?? 0;

                return (
                  <article
                    key={
                      technology.id
                    }
                    className="learning-technology-card"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      navigate(
                        `/learning/${technology.id}`,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        navigate(
                          `/learning/${technology.id}`,
                        );
                      }
                    }}
                  >

                    {/* ===================================
                        ICON
                    =================================== */}

                    <div className="learning-technology-icon">

                      {technology.name
                        .trim()
                        .slice(
                          0,
                          2,
                        )
                        .toUpperCase()}

                    </div>

                    {/* ===================================
                        CONTENT
                    =================================== */}

                    <div className="learning-technology-body">

                      <h3>
                        {technology.name}
                      </h3>

                      <p>
                        {technology.section ||
                          "Complete each chapter, learn the concepts, practice questions and pass the tests."}
                      </p>

                      {/* =================================
                          META
                      ================================= */}

                      <div className="learning-technology-meta">

                        <span>
                          {count}{" "}
                          {count === 1
                            ? "Chapter"
                            : "Chapters"}
                        </span>

                        <span>
                          Learning
                        </span>

                      </div>

                      {/* =================================
                          START
                      ================================= */}

                      <button
                        type="button"
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();

                          navigate(
                            `/learning/${technology.id}`,
                          );
                        }}
                      >
                        Start Learning →
                      </button>

                    </div>

                  </article>
                );
              },
            )}

          </div>

        )}

      </section>

    </main>
  );
}
