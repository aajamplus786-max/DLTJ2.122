
// =====================================================
// DLTJ2.10
// TEST HOME
// FILE: src/pages/Test/TestHome.tsx
// UPDATED: 2026-09-07
// LOCATION: src/pages/Test/TestHome.tsx
// =====================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getTechnologies,
} from "../../services/technologyService";

import {
  getChaptersByTechnology,
} from "../../services/chapterService";

import {
  hasPassedTest,
} from "../../services/testService";

import "./Test.css";

interface TechnologyOption {
  id: string;
  name: string;
}

interface ChapterOption {
  id: string;
  chapterNumber: number;
  title: string;
}

function toRecord(
  value: unknown,
): Record<string, unknown> {
  if (
    value !== null &&
    typeof value === "object"
  ) {
    return value as Record<
      string,
      unknown
    >;
  }

  return {};
}

function getString(
  value: unknown,
  fallback = "",
): string {
  if (
    typeof value === "string"
  ) {
    return value;
  }

  if (
    typeof value === "number"
  ) {
    return String(value);
  }

  return fallback;
}

function getNumber(
  value: unknown,
  fallback = 0,
): number {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : fallback;
}

export default function TestHome() {
  const navigate =
    useNavigate();

  const [
    technologies,
    setTechnologies,
  ] =
    useState<
      TechnologyOption[]
    >([]);

  const [
    selectedTechnologyId,
    setSelectedTechnologyId,
  ] =
    useState("");

  const [
    chapters,
    setChapters,
  ] =
    useState<
      ChapterOption[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    chapterLoading,
    setChapterLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const loadTechnologies =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const items =
            await getTechnologies();

          const mapped =
            items
              .map(
                (item) => {
                  const record =
                    toRecord(item);

                  return {
                    id:
                      getString(
                        record.id,
                      ),

                    name:
                      getString(
                        record.name,
                        "Technology",
                      ),
                  };
                },
              )
              .filter(
                (item) =>
                  item.id.length >
                  0,
              );

          setTechnologies(
            mapped,
          );

          if (
            mapped.length > 0
          ) {
            setSelectedTechnologyId(
              (current) =>
                current ||
                mapped[0].id,
            );
          }
        } catch {
          setTechnologies(
            [],
          );

          setError(
            "Unable to load technologies.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadTechnologies();
  }, [
    loadTechnologies,
  ]);

  useEffect(() => {
    let cancelled =
      false;

    async function loadChapters() {
      if (
        !selectedTechnologyId
      ) {
        setChapters([]);
        return;
      }

      setChapterLoading(
        true,
      );

      try {
        const items =
          await getChaptersByTechnology(
            selectedTechnologyId,
          );

        if (cancelled) {
          return;
        }

        const mapped =
          items
            .map(
              (item) => {
                const record =
                  toRecord(item);

                return {
                  id:
                    getString(
                      record.id,
                    ),

                  chapterNumber:
                    getNumber(
                      record.chapterNumber ??
                        record.chapter_number,
                    ),

                  title:
                    getString(
                      record.title,
                      "Chapter",
                    ),
                };
              },
            )
            .filter(
              (item) =>
                item.id.length >
                0,
            )
            .sort(
              (a, b) =>
                a.chapterNumber -
                b.chapterNumber,
            );

        setChapters(
          mapped,
        );
      } catch {
        if (!cancelled) {
          setChapters([]);
        }
      } finally {
        if (!cancelled) {
          setChapterLoading(
            false,
          );
        }
      }
    }

    void loadChapters();

    return () => {
      cancelled = true;
    };
  }, [
    selectedTechnologyId,
  ]);

  if (loading) {
    return (
      <section className="test-page">

        <header className="test-page-header">

          <div>

            <span className="test-eyebrow">
              DLTJ2.10 • TEST
            </span>

            <h1>
              Tests
            </h1>

            <p>
              Loading technologies...
            </p>

          </div>

        </header>

        <div className="test-card test-loading-card">

          <div className="test-loading-spinner">
            ...
          </div>

          <h2>
            Preparing Tests
          </h2>

          <p>
            Loading your available
            technologies.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="test-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="test-page-header">

        <div>

          <span className="test-eyebrow">
            DLTJ2.10 • ASSESSMENT
          </span>

          <h1>
            Tests
          </h1>

          <p>
            Complete chapter tests and
            the final mastery test.
          </p>

        </div>

      </header>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="test-error">
          {error}
        </div>
      )}

      {/* =================================================
          TECHNOLOGY SELECTOR
      ================================================= */}

      <div className="test-card test-selector-card">

        <div className="test-card-heading">

          <span className="test-section-label">
            COURSE
          </span>

          <h2>
            Select Technology
          </h2>

          <p>
            Choose the technology you
            want to test.
          </p>

        </div>

        <label
          htmlFor="test-technology"
          className="test-form-label"
        >
          Technology
        </label>

        <select
          id="test-technology"
          className="test-select"
          value={
            selectedTechnologyId
          }
          onChange={(
            event,
          ) =>
            setSelectedTechnologyId(
              event.target.value,
            )
          }
        >

          <option value="">
            Select Technology
          </option>

          {technologies.map(
            (
              technology,
            ) => (

              <option
                key={
                  technology.id
                }
                value={
                  technology.id
                }
              >
                {
                  technology.name
                }
              </option>

            ),
          )}

        </select>

      </div>

      {/* =================================================
          CHAPTER TESTS
      ================================================= */}

      <div className="test-card">

        <div className="test-card-heading">

          <span className="test-section-label">
            CHAPTER ASSESSMENTS
          </span>

          <h2>
            Chapter Tests
          </h2>

          <p>
            Complete the lessons and
            test your understanding.
          </p>

        </div>

        {chapterLoading ? (

          <div className="test-inline-loading">
            Loading chapters...
          </div>

        ) : chapters.length === 0 ? (

          <div className="test-empty-inline">

            <h3>
              No Chapters Available
            </h3>

            <p>
              No chapters are available
              for this technology.
            </p>

          </div>

        ) : (

          <div className="test-grid">

            {chapters.map(
              (
                chapter,
              ) => {

                const passed =
                  selectedTechnologyId
                    ? hasPassedTest(
                        selectedTechnologyId,
                        chapter.id,
                      )
                    : false;

                return (
                  <article
                    className="test-card test-chapter-card"
                    key={
                      chapter.id
                    }
                  >

                    <span className="test-chapter-number">
                      CHAPTER{" "}
                      {
                        chapter.chapterNumber
                      }
                    </span>

                    <h3>
                      {
                        chapter.title
                      }
                    </h3>

                    <div
                      className={
                        passed
                          ? "test-status passed"
                          : "test-status pending"
                      }
                    >
                      {passed
                        ? "✓ Passed"
                        : "Not Completed"}
                    </div>

                    <button
                      type="button"
                      className="test-primary-button"
                      onClick={() =>
                        navigate(
                          `/test/chapter/${encodeURIComponent(
                            selectedTechnologyId,
                          )}/${encodeURIComponent(
                            chapter.id,
                          )}/${encodeURIComponent(
                            String(
                              chapter.chapterNumber,
                            ),
                          )}`,
                        )
                      }
                    >
                      {passed
                        ? "Open Test"
                        : "Start Test"}
                    </button>

                  </article>
                );
              },
            )}

          </div>

        )}

      </div>

      {/* =================================================
          FINAL TEST
      ================================================= */}

      <div className="test-card test-final-card">

        <span className="test-section-label">
          FINAL ASSESSMENT
        </span>

        <h2>
          Final Mastery Test
        </h2>

        <p>
          Complete the complete
          technology assessment after
          learning the course.
        </p>

        <button
          type="button"
          className="test-primary-button"
          disabled={
            !selectedTechnologyId
          }
          onClick={() =>
            navigate(
              `/test/final/${encodeURIComponent(
                selectedTechnologyId,
              )}`,
            )
          }
        >
          Start Final Test →
        </button>

      </div>

    </section>
  );
}
