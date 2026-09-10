
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// ADMIN - CHAPTER MANAGEMENT
// FILE: src/pages/Admin/ChapterManagement.tsx
// DATE: 2026-09-07
// LOCATION: F:\dltj2.122\src\pages\Admin\ChapterManagement.tsx
// =====================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  encodeId,
  normalizeList,
} from "./adminApi";

// =====================================================
// TYPES
// =====================================================

interface Technology {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  technologyId: string;
  chapterNumber: number;
  title: string;
  description: string;
  displayOrder: number;
  isActive?: boolean;
}

interface ChapterForm {
  chapterNumber: number;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm: ChapterForm = {
  chapterNumber: 1,
  title: "",
  description: "",
  displayOrder: 1,
  isActive: true,
};

// =====================================================
// COMPONENT
// =====================================================

export default function ChapterManagement() {
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
    chapters,
    setChapters,
  ] =
    useState<Chapter[]>([]);

  const [
    selectedTechnologyId,
    setSelectedTechnologyId,
  ] =
    useState<string>("");

  const [
    editingId,
    setEditingId,
  ] =
    useState<string | null>(null);

  const [
    form,
    setForm,
  ] =
    useState<ChapterForm>(
      emptyForm,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  // ===================================================
  // LOAD TECHNOLOGIES
  // ===================================================

  const loadTechnologies =
    useCallback(
      async (): Promise<void> => {
        try {
          setError("");

          const response =
            await apiGet<unknown>(
              "/content/technologies",
            );

          const items =
            normalizeList<Technology>(
              response,
            );

          setTechnologies(
            items,
          );

          if (
            !selectedTechnologyId &&
            items.length > 0
          ) {
            setSelectedTechnologyId(
              String(
                items[0].id,
              ),
            );
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load technologies.",
          );
        }
      },
      [
        selectedTechnologyId,
      ],
    );

  // ===================================================
  // LOAD CHAPTERS
  // ===================================================

  const loadChapters =
    useCallback(
      async (): Promise<void> => {
        if (
          !selectedTechnologyId
        ) {
          setChapters([]);
          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await apiGet<unknown>(
              `/content/chapters/technology/${encodeId(
                selectedTechnologyId,
              )}`,
            );

          const items =
            normalizeList<Chapter>(
              response,
            );

          items.sort(
            (
              a,
              b,
            ) =>
              Number(
                a.displayOrder ??
                  a.chapterNumber,
              ) -
              Number(
                b.displayOrder ??
                  b.chapterNumber,
              ),
          );

          setChapters(
            items,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load chapters.",
          );

          setChapters([]);
        } finally {
          setLoading(false);
        }
      },
      [
        selectedTechnologyId,
      ],
    );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    void loadTechnologies();
  }, [
    loadTechnologies,
  ]);

  // ===================================================
  // CHAPTER LOAD
  // ===================================================

  useEffect(() => {
    void loadChapters();
  }, [
    loadChapters,
  ]);

  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm =
    useCallback((): void => {
      setEditingId(null);

      const nextNumber =
        chapters.length > 0
          ? Math.max(
              ...chapters.map(
                (
                  chapter,
                ) =>
                  Number(
                    chapter.chapterNumber,
                  ) || 0,
              ),
            ) + 1
          : 1;

      setForm({
        ...emptyForm,

        chapterNumber:
          nextNumber,

        displayOrder:
          chapters.length + 1,
      });
    }, [
      chapters,
    ]);

  // ===================================================
  // TECHNOLOGY CHANGE
  // ===================================================

  function handleTechnologyChange(
    value: string,
  ) {
    setSelectedTechnologyId(
      value,
    );

    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setMessage("");
    setError("");
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();

      setError("");
      setMessage("");

      if (
        !selectedTechnologyId
      ) {
        setError(
          "Please select a technology.",
        );
        return;
      }

      const chapterNumber =
        Number(
          form.chapterNumber,
        );

      const displayOrder =
        Number(
          form.displayOrder,
        );

      const title =
        form.title.trim();

      const description =
        form.description.trim();

      if (
        !Number.isFinite(
          chapterNumber,
        ) ||
        chapterNumber < 1
      ) {
        setError(
          "Chapter number must be at least 1.",
        );
        return;
      }

      if (!title) {
        setError(
          "Chapter title is required.",
        );
        return;
      }

      if (
        !Number.isFinite(
          displayOrder,
        ) ||
        displayOrder < 1
      ) {
        setError(
          "Display order must be at least 1.",
        );
        return;
      }

      const payload = {
        technologyId:
          selectedTechnologyId,

        chapterNumber,

        title,

        description,

        displayOrder,

        isActive:
          form.isActive,
      };

      try {
        setSaving(true);

        if (
          editingId
        ) {
          await apiPut(
            `/content/chapters/${encodeId(
              editingId,
            )}`,
            payload,
          );

          setMessage(
            "Chapter updated successfully.",
          );
        } else {
          await apiPost(
            "/content/chapters",
            payload,
          );

          setMessage(
            "Chapter created successfully.",
          );
        }

        resetForm();

        await loadChapters();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save chapter.",
        );
      } finally {
        setSaving(false);
      }
    };

  // ===================================================
  // EDIT
  // ===================================================

  function handleEdit(
    chapter: Chapter,
  ): void {
    setEditingId(
      String(
        chapter.id,
      ),
    );

    setForm({
      chapterNumber:
        Number(
          chapter.chapterNumber,
        ) || 1,

      title:
        chapter.title ?? "",

      description:
        chapter.description ?? "",

      displayOrder:
        Number(
          chapter.displayOrder,
        ) || 1,

      isActive:
        chapter.isActive !==
        false,
    });

    setError("");
    setMessage("");
  }

  // ===================================================
  // DELETE
  // ===================================================

  async function handleDelete(
    chapterId: string,
  ): Promise<void> {
    const confirmed =
      window.confirm(
        "Delete this chapter?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await apiDelete(
        `/content/chapters/${encodeId(
          chapterId,
        )}`,
      );

      setMessage(
        "Chapter deleted successfully.",
      );

      if (
        editingId ===
        chapterId
      ) {
        resetForm();
      }

      await loadChapters();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete chapter.",
      );
    }
  }

  // ===================================================
  // MOVE CHAPTER
  // ===================================================

  async function handleMove(
    chapter: Chapter,
    direction: -1 | 1,
  ): Promise<void> {
    const index =
      chapters.findIndex(
        (
          item,
        ) =>
          String(
            item.id,
          ) ===
          String(
            chapter.id,
          ),
      );

    if (
      index < 0
    ) {
      return;
    }

    const targetIndex =
      index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >=
        chapters.length
    ) {
      return;
    }

    const target =
      chapters[
        targetIndex
      ];

    const chapterOrder =
      Number(
        chapter.displayOrder,
      );

    const targetOrder =
      Number(
        target.displayOrder,
      );

    try {
      setError("");
      setMessage("");

      await apiPut(
        `/content/chapters/${encodeId(
          chapter.id,
        )}`,
        {
          displayOrder:
            targetOrder,
        },
      );

      await apiPut(
        `/content/chapters/${encodeId(
          target.id,
        )}`,
        {
          displayOrder:
            chapterOrder,
        },
      );

      setMessage(
        "Chapter order updated.",
      );

      await loadChapters();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reorder chapters.",
      );
    }
  }

  // ===================================================
  // OPEN BULK CONTENT IMPORT
  // ===================================================

  function handleOpenImport() {
    navigate(
      "/admin/content-import",
    );
  }

  // ===================================================
  // STYLES
  // ===================================================

  const pageStyle:
    React.CSSProperties = {
    minHeight:
      "100vh",

    padding:
      "24px",

    boxSizing:
      "border-box",

    background:
      "#f8fafc",
  };

  const containerStyle:
    React.CSSProperties = {
    maxWidth:
      "1200px",

    margin:
      "0 auto",
  };

  const cardStyle:
    React.CSSProperties = {
    background:
      "#ffffff",

    border:
      "1px solid #e5e7eb",

    borderRadius:
      "14px",

    padding:
      "20px",

    marginBottom:
      "20px",

    boxSizing:
      "border-box",
  };

  const buttonStyle:
    React.CSSProperties = {
    padding:
      "10px 15px",

    border:
      "1px solid #d1d5db",

    borderRadius:
      "9px",

    background:
      "#ffffff",

    cursor:
      "pointer",

    fontWeight:
      600,
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <main
      style={
        pageStyle
      }
    >
      <div
        style={
          containerStyle
        }
      >
        {/* =============================================
            HEADER
        ============================================= */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap:
              "12px",

            flexWrap:
              "wrap",

            marginBottom:
              "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin:
                  "0 0 6px",
              }}
            >
              Chapter Management
            </h1>

            <p
              style={{
                margin:
                  0,

                color:
                  "#6b7280",
              }}
            >
              Edit, delete and reorder
              imported chapters.
            </p>
          </div>

          <div
            style={{
              display:
                "flex",

              gap:
                "10px",

              flexWrap:
                "wrap",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin",
                )
              }
              style={
                buttonStyle
              }
            >
              ← Admin Home
            </button>

            <button
              type="button"
              onClick={
                handleOpenImport
              }
              style={{
                ...buttonStyle,

                background:
                  "#111827",

                color:
                  "#ffffff",

                borderColor:
                  "#111827",
              }}
            >
              Full Content Import
            </button>
          </div>
        </div>

        {/* =============================================
            ERROR
        ============================================= */}

        {error && (
          <div
            style={{
              background:
                "#fee2e2",

              color:
                "#991b1b",

              padding:
                "12px 14px",

              borderRadius:
                "9px",

              marginBottom:
                "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* =============================================
            MESSAGE
        ============================================= */}

        {message && (
          <div
            style={{
              background:
                "#dcfce7",

              color:
                "#166534",

              padding:
                "12px 14px",

              borderRadius:
                "9px",

              marginBottom:
                "16px",
            }}
          >
            {message}
          </div>
        )}

        {/* =============================================
            TECHNOLOGY
        ============================================= */}

        <section
          style={
            cardStyle
          }
        >
          <label
            htmlFor="chapter-technology"
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
            id="chapter-technology"
            value={
              selectedTechnologyId
            }
            onChange={(
              event,
            ) =>
              handleTechnologyChange(
                event.target.value,
              )
            }
            style={{
              width:
                "100%",

              maxWidth:
                "520px",

              padding:
                "11px 12px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                "9px",

              background:
                "#ffffff",
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
                    String(
                      technology.id,
                    )
                  }
                >
                  {
                    technology.name
                  }
                </option>
              ),
            )}
          </select>

          <p
            style={{
              margin:
                "10px 0 0",

              color:
                "#6b7280",

              fontSize:
                "13px",
            }}
          >
            For adding many chapters, use
            Full Content Import instead of
            creating chapters one by one.
          </p>
        </section>

        {/* =============================================
            FORM
        ============================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          style={
            cardStyle
          }
        >
          <h2
            style={{
              marginTop:
                0,
            }}
          >
            {editingId
              ? "Edit Chapter"
              : "Manual Chapter Entry"}
          </h2>

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",

              gap:
                "12px",
            }}
          >
            <div>
              <label
                htmlFor="chapter-number"
                style={{
                  display:
                    "block",

                  fontWeight:
                    600,

                  marginBottom:
                    "6px",
                }}
              >
                Chapter Number
              </label>

              <input
                id="chapter-number"
                type="number"
                min={1}
                step={1}
                value={
                  form.chapterNumber
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      chapterNumber:
                        Number(
                          event.target.value,
                        ),
                    }),
                  )
                }
                disabled={
                  saving
                }
                style={{
                  width:
                    "100%",

                  boxSizing:
                    "border-box",

                  padding:
                    "10px 12px",

                  border:
                    "1px solid #d1d5db",

                  borderRadius:
                    "8px",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="chapter-title"
                style={{
                  display:
                    "block",

                  fontWeight:
                    600,

                  marginBottom:
                    "6px",
                }}
              >
                Chapter Title
              </label>

              <input
                id="chapter-title"
                type="text"
                value={
                  form.title
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      title:
                        event.target.value,
                    }),
                  )
                }
                disabled={
                  saving
                }
                placeholder="Chapter title"
                style={{
                  width:
                    "100%",

                  boxSizing:
                    "border-box",

                  padding:
                    "10px 12px",

                  border:
                    "1px solid #d1d5db",

                  borderRadius:
                    "8px",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="chapter-order"
                style={{
                  display:
                    "block",

                  fontWeight:
                    600,

                  marginBottom:
                    "6px",
                }}
              >
                Display Order
              </label>

              <input
                id="chapter-order"
                type="number"
                min={1}
                step={1}
                value={
                  form.displayOrder
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      displayOrder:
                        Number(
                          event.target.value,
                        ),
                    }),
                  )
                }
                disabled={
                  saving
                }
                style={{
                  width:
                    "100%",

                  boxSizing:
                    "border-box",

                  padding:
                    "10px 12px",

                  border:
                    "1px solid #d1d5db",

                  borderRadius:
                    "8px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop:
                "14px",
            }}
          >
            <label
              htmlFor="chapter-description"
              style={{
                display:
                  "block",

                fontWeight:
                  600,

                marginBottom:
                  "6px",
              }}
            >
              Description
            </label>

            <textarea
              id="chapter-description"
              value={
                form.description
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    description:
                      event.target.value,
                  }),
                )
              }
              disabled={
                saving
              }
              rows={5}
              placeholder="Chapter description"
              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                padding:
                  "10px 12px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "8px",

                resize:
                  "vertical",
              }}
            />
          </div>

          <label
            htmlFor="chapter-active"
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "8px",

              marginTop:
                "14px",

              cursor:
                saving
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <input
              id="chapter-active"
              type="checkbox"
              checked={
                form.isActive
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    isActive:
                      event.target.checked,
                  }),
                )
              }
              disabled={
                saving
              }
            />

            <span>
              Active
            </span>
          </label>

          <div
            style={{
              display:
                "flex",

              gap:
                "10px",

              flexWrap:
                "wrap",

              marginTop:
                "18px",
            }}
          >
            <button
              type="submit"
              disabled={
                saving
              }
              style={{
                ...buttonStyle,

                background:
                  "#111827",

                color:
                  "#ffffff",

                borderColor:
                  "#111827",

                cursor:
                  saving
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Chapter"
                  : "Create Chapter"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={
                  resetForm
                }
                disabled={
                  saving
                }
                style={
                  buttonStyle
                }
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* =============================================
            CHAPTER LIST
        ============================================= */}

        <section
          style={
            cardStyle
          }
        >
          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap:
                "12px",

              flexWrap:
                "wrap",

              marginBottom:
                "16px",
            }}
          >
            <div>
              <h2
                style={{
                  margin:
                    "0 0 5px",
                }}
              >
                Chapters
              </h2>

              <p
                style={{
                  margin:
                    0,

                  color:
                    "#6b7280",

                  fontSize:
                    "13px",
                }}
              >
                {selectedTechnologyId
                  ? `${chapters.length} chapter${
                      chapters.length ===
                      1
                        ? ""
                        : "s"
                    }`
                  : "Select a technology"}
              </p>
            </div>

            {selectedTechnologyId && (
              <button
                type="button"
                onClick={
                  handleOpenImport
                }
                style={
                  buttonStyle
                }
              >
                Paste Full Content
              </button>
            )}
          </div>

          {!selectedTechnologyId ? (
            <div
              style={{
                padding:
                  "35px 20px",

                textAlign:
                  "center",

                color:
                  "#6b7280",

                background:
                  "#f8fafc",

                borderRadius:
                  "10px",
              }}
            >
              Select a technology to view
              chapters.
            </div>
          ) : loading ? (
            <div
              style={{
                padding:
                  "35px 20px",

                textAlign:
                  "center",

                color:
                  "#6b7280",
              }}
            >
              Loading chapters...
            </div>
          ) : chapters.length ===
            0 ? (
            <div
              style={{
                padding:
                  "35px 20px",

                textAlign:
                  "center",

                color:
                  "#6b7280",

                background:
                  "#f8fafc",

                borderRadius:
                  "10px",
              }}
            >
              <div
                style={{
                  fontWeight:
                    700,

                  marginBottom:
                    "8px",
                }}
              >
                No chapters found.
              </div>

              <div
                style={{
                  fontSize:
                    "13px",

                  marginBottom:
                    "16px",
                }}
              >
                Use Full Content Import to
                add all chapters, lessons,
                practice questions and tests
                together.
              </div>

              <button
                type="button"
                onClick={
                  handleOpenImport
                }
                style={{
                  ...buttonStyle,

                  background:
                    "#111827",

                  color:
                    "#ffffff",

                  borderColor:
                    "#111827",
                }}
              >
                Open Full Content Import
              </button>
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",

                gap:
                  "10px",
              }}
            >
              {chapters.map(
                (
                  chapter,
                  index,
                ) => (
                  <div
                    key={
                      chapter.id
                    }
                    style={{
                      border:
                        "1px solid #e5e7eb",

                      borderRadius:
                        "10px",

                      padding:
                        "14px",

                      background:
                        "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "flex-start",

                        gap:
                          "15px",

                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div
                        style={{
                          flex:
                            "1 1 350px",
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              "17px",

                            fontWeight:
                              700,
                          }}
                        >
                          {
                            chapter.chapterNumber
                          }
                          .{" "}
                          {
                            chapter.title
                          }
                        </div>

                        {chapter.description && (
                          <p
                            style={{
                              margin:
                                "7px 0 0",

                              color:
                                "#6b7280",

                              lineHeight:
                                1.6,
                            }}
                          >
                            {
                              chapter.description
                            }
                          </p>
                        )}

                        <div
                          style={{
                            marginTop:
                              "7px",

                            fontSize:
                              "12px",

                            color:
                              "#6b7280",
                          }}
                        >
                          Display order:{" "}
                          {
                            chapter.displayOrder
                          }
                        </div>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",

                          gap:
                            "8px",

                          flexWrap:
                            "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              chapter,
                            )
                          }
                          style={
                            buttonStyle
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            0
                          }
                          onClick={() =>
                            void handleMove(
                              chapter,
                              -1,
                            )
                          }
                          style={
                            buttonStyle
                          }
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            chapters.length -
                              1
                          }
                          onClick={() =>
                            void handleMove(
                              chapter,
                              1,
                            )
                          }
                          style={
                            buttonStyle
                          }
                        >
                          ↓
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void handleDelete(
                              String(
                                chapter.id,
                              ),
                            )
                          }
                          style={{
                            ...buttonStyle,

                            background:
                              "#fff1f2",

                            color:
                              "#be123c",

                            borderColor:
                              "#fecdd3",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
