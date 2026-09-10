
// =====================================================
// DLTJ2.10
// ADMIN - LESSON MANAGEMENT
// FILE: src/pages/Admin/LessonManagement.tsx
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
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  encodeId,
  normalizeList,
} from "./adminApi";

interface Technology {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  technologyId: string;
  chapterNumber: number;
  title: string;
}

interface Lesson {
  id: string;
  chapterId: string;
  lessonNumber: number;
  title: string;
  content: string;
  displayOrder: number;
  isActive?: boolean;
}

interface LessonForm {
  lessonNumber: number;
  title: string;
  content: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyForm: LessonForm = {
  lessonNumber: 1,
  title: "",
  content: "",
  displayOrder: 1,
  isActive: true,
};

export default function LessonManagement() {
  const [technologies, setTechnologies] =
    useState<Technology[]>([]);

  const [chapters, setChapters] =
    useState<Chapter[]>([]);

  const [lessons, setLessons] =
    useState<Lesson[]>([]);

  const [technologyId, setTechnologyId] =
    useState<string>("");

  const [chapterId, setChapterId] =
    useState<string>("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<LessonForm>(emptyForm);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [saving, setSaving] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [message, setMessage] =
    useState<string>("");

  const loadTechnologies =
    useCallback(async (): Promise<void> => {
      try {
        setError("");

        const response =
          await apiGet(
            "/content/technologies",
          );

        const items =
          normalizeList<Technology>(
            response.data,
          );

        setTechnologies(items);

        if (!technologyId && items.length > 0) {
          setTechnologyId(
            String(items[0].id),
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load technologies.",
        );
      }
    }, [technologyId]);

  const loadChapters =
    useCallback(async (): Promise<void> => {
      if (!technologyId) {
        setChapters([]);
        setChapterId("");
        return;
      }

      try {
        const response =
          await apiGet(
            `/content/chapters/technology/${encodeId(
              technologyId,
            )}`,
          );

        const items =
          normalizeList<Chapter>(
            response.data,
          );

        items.sort(
          (a, b) =>
            Number(a.chapterNumber) -
            Number(b.chapterNumber),
        );

        setChapters(items);

        if (
          !chapterId ||
          !items.some(
            (item) =>
              String(item.id) ===
              String(chapterId),
          )
        ) {
          setChapterId(
            items.length > 0
              ? String(items[0].id)
              : "",
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load chapters.",
        );
      }
    }, [technologyId, chapterId]);

  const loadLessons =
    useCallback(async (): Promise<void> => {
      if (!chapterId) {
        setLessons([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await apiGet(
            `/content/lessons/chapter/${encodeId(
              chapterId,
            )}`,
          );

        const items =
          normalizeList<Lesson>(
            response.data,
          );

        items.sort(
          (a, b) =>
            Number(a.displayOrder) -
            Number(b.displayOrder),
        );

        setLessons(items);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load lessons.",
        );
      } finally {
        setLoading(false);
      }
    }, [chapterId]);

  useEffect(() => {
    void loadTechnologies();
  }, [loadTechnologies]);

  useEffect(() => {
    void loadChapters();
  }, [loadChapters]);

  useEffect(() => {
    void loadLessons();
  }, [loadLessons]);

  const resetForm = (): void => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      lessonNumber:
        lessons.length > 0
          ? Math.max(
              ...lessons.map(
                (lesson) =>
                  Number(
                    lesson.lessonNumber,
                  ) || 0,
              ),
            ) + 1
          : 1,
      displayOrder:
        lessons.length + 1,
    });
  };

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();

      if (!chapterId) {
        setError(
          "Please select a chapter.",
        );
        return;
      }

      if (!form.title.trim()) {
        setError(
          "Lesson title is required.",
        );
        return;
      }

      try {
        setSaving(true);
        setError("");
        setMessage("");

        const payload = {
          chapterId,
          lessonNumber:
            Number(form.lessonNumber),
          title:
            form.title.trim(),
          content:
            form.content,
          displayOrder:
            Number(form.displayOrder),
          isActive:
            form.isActive,
        };

        if (editingId) {
          await apiPut(
            `/content/lessons/${encodeId(
              editingId,
            )}`,
            payload,
          );

          setMessage(
            "Lesson updated successfully.",
          );
        } else {
          await apiPost(
            "/content/lessons",
            payload,
          );

          setMessage(
            "Lesson created successfully.",
          );
        }

        resetForm();
        await loadLessons();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save lesson.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleEdit = (
    lesson: Lesson,
  ): void => {
    setEditingId(
      String(lesson.id),
    );

    setForm({
      lessonNumber:
        Number(
          lesson.lessonNumber,
        ) || 1,

      title:
        lesson.title ?? "",

      content:
        lesson.content ?? "",

      displayOrder:
        Number(
          lesson.displayOrder,
        ) || 1,

      isActive:
        lesson.isActive !== false,
    });
  };

  const handleDelete =
    async (
      id: string,
    ): Promise<void> => {
      if (
        !window.confirm(
          "Delete this lesson?",
        )
      ) {
        return;
      }

      try {
        setError("");
        setMessage("");

        await apiDelete(
          `/content/lessons/${encodeId(id)}`,
        );

        setMessage(
          "Lesson deleted successfully.",
        );

        if (editingId === id) {
          resetForm();
        }

        await loadLessons();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete lesson.",
        );
      }
    };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Lesson Management</h1>

      {error && (
        <div
          style={{
            padding: "12px",
            background:
              "#fee2e2",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            padding: "12px",
            background:
              "#dcfce7",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <label>
          <strong>
            Technology
          </strong>
        </label>

        <select
          value={technologyId}
          onChange={(event) =>
            setTechnologyId(
              event.target.value,
            )
          }
          style={{
            display: "block",
            width: "100%",
            marginTop: "8px",
            padding: "10px",
          }}
        >
          <option value="">
            Select technology
          </option>

          {technologies.map(
            (technology) => (
              <option
                key={technology.id}
                value={technology.id}
              >
                {technology.name}
              </option>
            ),
          )}
        </select>

        <label
          style={{
            display: "block",
            marginTop: "16px",
          }}
        >
          <strong>
            Chapter
          </strong>
        </label>

        <select
          value={chapterId}
          onChange={(event) =>
            setChapterId(
              event.target.value,
            )
          }
          style={{
            display: "block",
            width: "100%",
            marginTop: "8px",
            padding: "10px",
          }}
        >
          <option value="">
            Select chapter
          </option>

          {chapters.map(
            (chapter) => (
              <option
                key={chapter.id}
                value={chapter.id}
              >
                {chapter.chapterNumber}.{" "}
                {chapter.title}
              </option>
            ),
          )}
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>
          {editingId
            ? "Edit Lesson"
            : "Add Lesson"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <input
            type="number"
            min={1}
            value={
              form.lessonNumber
            }
            onChange={(event) =>
              setForm({
                ...form,
                lessonNumber:
                  Number(
                    event.target
                      .value,
                  ),
              })
            }
            placeholder="Lesson number"
          />

          <input
            type="text"
            value={
              form.title
            }
            onChange={(event) =>
              setForm({
                ...form,
                title:
                  event.target
                    .value,
              })
            }
            placeholder="Lesson title"
          />

          <input
            type="number"
            min={1}
            value={
              form.displayOrder
            }
            onChange={(event) =>
              setForm({
                ...form,
                displayOrder:
                  Number(
                    event.target
                      .value,
                  ),
              })
            }
            placeholder="Display order"
          />
        </div>

        <textarea
          rows={12}
          value={
            form.content
          }
          onChange={(event) =>
            setForm({
              ...form,
              content:
                event.target
                  .value,
            })
          }
          placeholder="Lesson content"
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "10px",
          }}
        />

        <label
          style={{
            display: "block",
            marginTop: "12px",
          }}
        >
          <input
            type="checkbox"
            checked={
              form.isActive
            }
            onChange={(event) =>
              setForm({
                ...form,
                isActive:
                  event.target
                    .checked,
              })
            }
          />{" "}
          Active
        </label>

        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Lesson"
                : "Create Lesson"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={
                resetForm
              }
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div
        style={{
          background: "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>Lessons</h2>

        {loading ? (
          <p>Loading...</p>
        ) : lessons.length ===
          0 ? (
          <p>
            No lessons found.
          </p>
        ) : (
          lessons.map(
            (lesson) => (
              <div
                key={lesson.id}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  padding: "14px",
                  borderRadius:
                    "8px",
                  marginBottom:
                    "10px",
                }}
              >
                <strong>
                  {
                    lesson.lessonNumber
                  }
                  .{" "}
                  {
                    lesson.title
                  }
                </strong>

                <p
                  style={{
                    whiteSpace:
                      "pre-wrap",
                  }}
                >
                  {
                    lesson.content
                  }
                </p>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        lesson,
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(
                        String(
                          lesson.id,
                        ),
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
