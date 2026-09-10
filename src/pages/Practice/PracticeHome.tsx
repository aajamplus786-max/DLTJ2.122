
// =====================================================
// DLTJ2.10
// USER PRACTICE
// FILE: src/pages/Practice/PracticeHome.tsx
// CREATED: 2026-09-06
// LOCATION: src/pages/Practice/PracticeHome.tsx
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
import "./Practice.css";
interface TechnologyOption {
  id: string;
  name: string;
  section: string;
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
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
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
): string {
  return String(
    value ?? "",
  );
}

function getNumber(
  value: unknown,
  fallback = 0,
): number {
  const number =
    Number(value);

  return Number.isFinite(
    number,
  )
    ? number
    : fallback;
}

export default function PracticeHome() {
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
    chapters,
    setChapters,
  ] =
    useState<
      ChapterOption[]
    >([]);

  const [
    selectedTechnologyId,
    setSelectedTechnologyId,
  ] =
    useState<string>(
      "",
    );

  const [
    selectedChapterId,
    setSelectedChapterId,
  ] =
    useState<string>(
      "",
    );

  const [
    loadingTechnologies,
    setLoadingTechnologies,
  ] =
    useState<boolean>(
      true,
    );

  const [
    loadingChapters,
    setLoadingChapters,
  ] =
    useState<boolean>(
      false,
    );

  const [
    error,
    setError,
  ] =
    useState<string>(
      "",
    );

  // ===================================================
  // LOAD TECHNOLOGIES
  // ===================================================

  const loadTechnologies =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoadingTechnologies(
            true,
          );

          setError(
            "",
          );

          const response =
            await getTechnologies();

          const list =
            Array.isArray(
              response,
            )
              ? response
              : [];

          const mapped: TechnologyOption[] =
            list.map(
              (
                item,
              ): TechnologyOption => {
                const record =
                  toRecord(
                    item,
                  );

                return {
                  id:
                    getString(
                      record.id,
                    ),

                  name:
                    getString(
                      record.name,
                    ),

                  section:
                    getString(
                      record.section,
                    ),
                };
              },
            ).filter(
              (
                item,
              ) =>
                Boolean(
                  item.id,
                ),
            );

          setTechnologies(
            mapped,
          );

          if (
            mapped.length > 0 &&
            !mapped.some(
              (
                item,
              ) =>
                item.id ===
                selectedTechnologyId,
            )
          ) {
            setSelectedTechnologyId(
              mapped[0].id,
            );
          }

          if (
            mapped.length ===
            0
          ) {
            setSelectedTechnologyId(
              "",
            );
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load technologies.",
          );
        } finally {
          setLoadingTechnologies(
            false,
          );
        }
      },
      [
        selectedTechnologyId,
      ],
    );

  useEffect(() => {
    void loadTechnologies();
  }, [
    loadTechnologies,
  ]);

  // ===================================================
  // LOAD CHAPTERS
  // ===================================================

  const loadChapters =
    useCallback(
      async (): Promise<void> => {
        if (
          !selectedTechnologyId
        ) {
          setChapters(
            [],
          );

          setSelectedChapterId(
            "",
          );

          return;
        }

        try {
          setLoadingChapters(
            true,
          );

          setError(
            "",
          );

          const response =
            await getChaptersByTechnology(
              selectedTechnologyId,
            );

          const list =
            Array.isArray(
              response,
            )
              ? response
              : [];

          const mapped: ChapterOption[] =
            list.map(
              (
                item,
              ): ChapterOption => {
                const record =
                  toRecord(
                    item,
                  );

                return {
                  id:
                    getString(
                      record.id,
                    ),

                  chapterNumber:
                    getNumber(
                      record.chapterNumber,
                      getNumber(
                        record.chapter_number,
                        0,
                      ),
                    ),

                  title:
                    getString(
                      record.title,
                    ),
                };
              },
            ).filter(
              (
                item,
              ) =>
                Boolean(
                  item.id,
                ),
            );

          mapped.sort(
            (
              first,
              second,
            ) =>
              first.chapterNumber -
              second.chapterNumber,
          );

          setChapters(
            mapped,
          );

          if (
            mapped.length > 0
          ) {
            setSelectedChapterId(
              (
                current,
              ) => {
                const stillExists =
                  mapped.some(
                    (
                      item,
                    ) =>
                      item.id ===
                      current,
                  );

                return stillExists
                  ? current
                  : mapped[0]
                      .id;
              },
            );
          } else {
            setSelectedChapterId(
              "",
            );
          }
        } catch (err) {
          setChapters(
            [],
          );

          setSelectedChapterId(
            "",
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load chapters.",
          );
        } finally {
          setLoadingChapters(
            false,
          );
        }
      },
      [
        selectedTechnologyId,
      ],
    );

  useEffect(() => {
    void loadChapters();
  }, [
    loadChapters,
  ]);

  // ===================================================
  // START PRACTICE
  // ===================================================

  const startPractice =
    (): void => {
      if (
        !selectedTechnologyId
      ) {
        setError(
          "Please select a technology.",
        );

        return;
      }

      if (
        !selectedChapterId
      ) {
        setError(
          "Please select a chapter.",
        );

        return;
      }

      setError(
        "",
      );

      navigate(
        `/practice/${encodeURIComponent(
          selectedTechnologyId,
        )}/${encodeURIComponent(
          selectedChapterId,
        )}`,
      );
    };

  return (
    <div
      style={{
        maxWidth:
          "1100px",
        margin:
          "0 auto",
        padding:
          "24px",
      }}
    >
      <div
        style={{
          marginBottom:
            "24px",
        }}
      >
        <h1>
          Practice
        </h1>

        <p
          style={{
            color:
              "#6b7280",
          }}
        >
          Practice questions chapter by chapter.
        </p>
      </div>

      {error && (
        <div
          style={{
            background:
              "#fee2e2",
            color:
              "#991b1b",
            borderRadius:
              "10px",
            padding:
              "12px 14px",
            marginBottom:
              "16px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background:
            "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "14px",
          padding:
            "22px",
        }}
      >
        {/* TECHNOLOGY */}

        <div
          style={{
            marginBottom:
              "18px",
          }}
        >
          <label
            style={{
              display:
                "block",
              fontWeight:
                700,
              marginBottom:
                "8px",
            }}
          >
            Technology
          </label>

          <select
            value={
              selectedTechnologyId
            }
            onChange={(
              event,
            ) => {
              setSelectedTechnologyId(
                event.target
                  .value,
              );

              setSelectedChapterId(
                "",
              );

              setError(
                "",
              );
            }}
            disabled={
              loadingTechnologies
            }
            style={{
              width:
                "100%",
              padding:
                "12px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "8px",
              boxSizing:
                "border-box",
            }}
          >
            <option value="">
              Select technology
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
                  {technology.section
                    ? ` — ${technology.section}`
                    : ""}
                </option>
              ),
            )}
          </select>
        </div>

        {/* CHAPTER */}

        <div
          style={{
            marginBottom:
              "20px",
          }}
        >
          <label
            style={{
              display:
                "block",
              fontWeight:
                700,
              marginBottom:
                "8px",
            }}
          >
            Chapter
          </label>

          <select
            value={
              selectedChapterId
            }
            onChange={(
              event,
            ) => {
              setSelectedChapterId(
                event.target
                  .value,
              );

              setError(
                "",
              );
            }}
            disabled={
              loadingChapters ||
              !selectedTechnologyId
            }
            style={{
              width:
                "100%",
              padding:
                "12px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "8px",
              boxSizing:
                "border-box",
            }}
          >
            <option value="">
              Select chapter
            </option>

            {chapters.map(
              (
                chapter,
              ) => (
                <option
                  key={
                    chapter.id
                  }
                  value={
                    chapter.id
                  }
                >
                  Chapter{" "}
                  {
                    chapter.chapterNumber
                  }{" "}
                  —{" "}
                  {
                    chapter.title
                  }
                </option>
              ),
            )}
          </select>
        </div>

        <button
          type="button"
          onClick={
            startPractice
          }
          disabled={
            !selectedTechnologyId ||
            !selectedChapterId ||
            loadingTechnologies ||
            loadingChapters
          }
          style={{
            width:
              "100%",
            padding:
              "13px",
            border:
              "none",
            borderRadius:
              "9px",
            fontWeight:
              700,
          }}
        >
          Start Practice
        </button>
      </div>

      <div
        style={{
          marginTop:
            "20px",
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap:
            "14px",
        }}
      >
        <div
          style={{
            padding:
              "18px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >
          <strong>
            Chapter Based
          </strong>

          <p
            style={{
              color:
                "#6b7280",
            }}
          >
            Questions come from the selected
            chapter.
          </p>
        </div>

        <div
          style={{
            padding:
              "18px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >
          <strong>
            Instant Result
          </strong>

          <p
            style={{
              color:
                "#6b7280",
            }}
          >
            Answers are checked after submission.
          </p>
        </div>

        <div
          style={{
            padding:
              "18px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >
          <strong>
            Progress Save
          </strong>

          <p
            style={{
              color:
                "#6b7280",
            }}
          >
            Practice results are saved locally and
            sent to the API when available.
          </p>
        </div>
      </div>
    </div>
  );
}

