
// =====================================================
// DLTJ2.10
// ADMIN - QUESTION MANAGEMENT
// FILE: src/pages/Admin/QuestionManagement.tsx
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
  chapterNumber: number;
  title: string;
}

interface Question {
  id: string;
  technologyId: string;
  chapterId?: string;
  questionType: string;
  questionText: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation?: string;
  marks: number;
  displayOrder: number;
  isActive?: boolean;
}

interface QuestionForm {
  chapterId: string;
  questionType: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  marks: number;
  displayOrder: number;
  isActive: boolean;
}

const createEmptyForm =
  (
    chapterId = "",
  ): QuestionForm => ({
    chapterId,
    questionType: "mcq",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    explanation: "",
    marks: 1,
    displayOrder: 1,
    isActive: true,
  });

export default function QuestionManagement() {
  const [technologies, setTechnologies] =
    useState<Technology[]>([]);

  const [chapters, setChapters] =
    useState<Chapter[]>([]);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [technologyId, setTechnologyId] =
    useState<string>("");

  const [chapterId, setChapterId] =
    useState<string>("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<QuestionForm>(
      createEmptyForm(),
    );

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
            Number(
              a.chapterNumber,
            ) -
            Number(
              b.chapterNumber,
            ),
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

  const loadQuestions =
    useCallback(async (): Promise<void> => {
      if (!technologyId) {
        setQuestions([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const endpoint =
          chapterId
            ? `/content/questions/chapter/${encodeId(
                chapterId,
              )}`
            : `/content/questions/technology/${encodeId(
                technologyId,
              )}`;

        const response =
          await apiGet(endpoint);

        const items =
          normalizeList<Question>(
            response.data,
          );

        items.sort(
          (a, b) =>
            Number(
              a.displayOrder,
            ) -
            Number(
              b.displayOrder,
            ),
        );

        setQuestions(items);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load questions.",
        );
      } finally {
        setLoading(false);
      }
    }, [technologyId, chapterId]);

  useEffect(() => {
    void loadTechnologies();
  }, [loadTechnologies]);

  useEffect(() => {
    void loadChapters();
  }, [loadChapters]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const resetForm = (): void => {
    setEditingId(null);

    setForm(
      createEmptyForm(
        chapterId,
      ),
    );

    setMessage("");
  };

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();

      if (!technologyId) {
        setError(
          "Please select a technology.",
        );
        return;
      }

      if (!form.questionText.trim()) {
        setError(
          "Question text is required.",
        );
        return;
      }

      if (!form.correctAnswer.trim()) {
        setError(
          "Correct answer is required.",
        );
        return;
      }

      try {
        setSaving(true);
        setError("");
        setMessage("");

        const payload = {
          technologyId,
          chapterId:
            form.chapterId || null,
          questionType:
            form.questionType,
          questionText:
            form.questionText.trim(),
          optionA:
            form.optionA,
          optionB:
            form.optionB,
          optionC:
            form.optionC,
          optionD:
            form.optionD,
          correctAnswer:
            form.correctAnswer.trim(),
          explanation:
            form.explanation,
          marks:
            Number(form.marks),
          displayOrder:
            Number(form.displayOrder),
          isActive:
            form.isActive,
        };

        if (editingId) {
          await apiPut(
            `/content/questions/${encodeId(
              editingId,
            )}`,
            payload,
          );

          setMessage(
            "Question updated successfully.",
          );
        } else {
          await apiPost(
            "/content/questions",
            payload,
          );

          setMessage(
            "Question created successfully.",
          );
        }

        resetForm();
        await loadQuestions();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save question.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleEdit = (
    question: Question,
  ): void => {
    setEditingId(
      String(question.id),
    );

    setForm({
      chapterId:
        question.chapterId
          ? String(
              question.chapterId,
            )
          : chapterId,

      questionType:
        question.questionType ??
        "mcq",

      questionText:
        question.questionText ??
        "",

      optionA:
        question.optionA ??
        "",

      optionB:
        question.optionB ??
        "",

      optionC:
        question.optionC ??
        "",

      optionD:
        question.optionD ??
        "",

      correctAnswer:
        question.correctAnswer ??
        "",

      explanation:
        question.explanation ??
        "",

      marks:
        Number(
          question.marks,
        ) || 1,

      displayOrder:
        Number(
          question.displayOrder,
        ) || 1,

      isActive:
        question.isActive !== false,
    });

    setError("");
    setMessage("");
  };

  const handleDelete =
    async (
      id: string,
    ): Promise<void> => {
      if (
        !window.confirm(
          "Delete this question?",
        )
      ) {
        return;
      }

      try {
        setError("");
        setMessage("");

        await apiDelete(
          `/content/questions/${encodeId(id)}`,
        );

        setMessage(
          "Question deleted successfully.",
        );

        if (editingId === id) {
          resetForm();
        }

        await loadQuestions();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete question.",
        );
      }
    };

  const moveQuestion =
    async (
      question: Question,
      direction: -1 | 1,
    ): Promise<void> => {
      const index =
        questions.findIndex(
          (item) =>
            String(item.id) ===
            String(question.id),
        );

      if (index < 0) return;

      const targetIndex =
        index + direction;

      if (
        targetIndex < 0 ||
        targetIndex >=
          questions.length
      ) {
        return;
      }

      const target =
        questions[targetIndex];

      try {
        await apiPut(
          `/content/questions/${encodeId(
            question.id,
          )}`,
          {
            displayOrder:
              Number(
                target.displayOrder,
              ),
          },
        );

        await apiPut(
          `/content/questions/${encodeId(
            target.id,
          )}`,
          {
            displayOrder:
              Number(
                question.displayOrder,
              ),
          },
        );

        await loadQuestions();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to reorder question.",
        );
      }
    };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1250px",
        margin: "0 auto",
      }}
    >
      <h1>
        Question Management
      </h1>

      {error && (
        <div
          style={{
            background:
              "#fee2e2",
            padding: "12px",
            borderRadius:
              "8px",
            marginBottom:
              "16px",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            background:
              "#dcfce7",
            padding: "12px",
            borderRadius:
              "8px",
            marginBottom:
              "16px",
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
          borderRadius:
            "12px",
          padding: "20px",
          marginBottom:
            "20px",
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
            marginTop:
              "16px",
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
            All chapters
          </option>

          {chapters.map(
            (chapter) => (
              <option
                key={chapter.id}
                value={chapter.id}
              >
                {
                  chapter.chapterNumber
                }
                .{" "}
                {
                  chapter.title
                }
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
          borderRadius:
            "12px",
          padding: "20px",
          marginBottom:
            "20px",
        }}
      >
        <h2>
          {editingId
            ? "Edit Question"
            : "Add Question"}
        </h2>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <select
            value={
              form.chapterId
            }
            onChange={(event) =>
              setForm({
                ...form,
                chapterId:
                  event.target
                    .value,
              })
            }
          >
            <option value="">
              No chapter
            </option>

            {chapters.map(
              (chapter) => (
                <option
                  key={chapter.id}
                  value={
                    chapter.id
                  }
                >
                  {
                    chapter.chapterNumber
                  }
                  .{" "}
                  {
                    chapter.title
                  }
                </option>
              ),
            )}
          </select>

          <select
            value={
              form.questionType
            }
            onChange={(event) =>
              setForm({
                ...form,
                questionType:
                  event.target
                    .value,
              })
            }
          >
            <option value="mcq">
              MCQ
            </option>

            <option value="true_false">
              True / False
            </option>

            <option value="short_answer">
              Short Answer
            </option>

            <option value="code">
              Code
            </option>
          </select>

          <input
            type="number"
            min={1}
            value={
              form.marks
            }
            onChange={(event) =>
              setForm({
                ...form,
                marks:
                  Number(
                    event.target
                      .value,
                  ),
              })
            }
            placeholder="Marks"
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
          rows={5}
          value={
            form.questionText
          }
          onChange={(event) =>
            setForm({
              ...form,
              questionText:
                event.target
                  .value,
            })
          }
          placeholder="Question text"
          style={{
            width: "100%",
            marginTop:
              "12px",
            padding:
              "10px",
          }}
        />

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "10px",
            marginTop:
              "12px",
          }}
        >
          <input
            value={
              form.optionA
            }
            onChange={(event) =>
              setForm({
                ...form,
                optionA:
                  event.target
                    .value,
              })
            }
            placeholder="Option A"
          />

          <input
            value={
              form.optionB
            }
            onChange={(event) =>
              setForm({
                ...form,
                optionB:
                  event.target
                    .value,
              })
            }
            placeholder="Option B"
          />

          <input
            value={
              form.optionC
            }
            onChange={(event) =>
              setForm({
                ...form,
                optionC:
                  event.target
                    .value,
              })
            }
            placeholder="Option C"
          />

          <input
            value={
              form.optionD
            }
            onChange={(event) =>
              setForm({
                ...form,
                optionD:
                  event.target
                    .value,
              })
            }
            placeholder="Option D"
          />
        </div>

        <input
          value={
            form.correctAnswer
          }
          onChange={(event) =>
            setForm({
              ...form,
              correctAnswer:
                event.target
                  .value,
            })
          }
          placeholder="Correct answer"
          style={{
            width:
              "100%",
            marginTop:
              "12px",
            padding:
              "10px",
          }}
        />

        <textarea
          rows={4}
          value={
            form.explanation
          }
          onChange={(event) =>
            setForm({
              ...form,
              explanation:
                event.target
                  .value,
            })
          }
          placeholder="Explanation"
          style={{
            width:
              "100%",
            marginTop:
              "12px",
            padding:
              "10px",
          }}
        />

        <label
          style={{
            display:
              "block",
            marginTop:
              "12px",
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
            display:
              "flex",
            gap:
              "10px",
            marginTop:
              "16px",
          }}
        >
          <button
            type="submit"
            disabled={
              saving
            }
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Question"
                : "Create Question"}
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
          background:
            "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "12px",
          padding:
            "20px",
        }}
      >
        <h2>
          Questions
        </h2>

        {loading ? (
          <p>
            Loading...
          </p>
        ) : questions.length ===
          0 ? (
          <p>
            No questions found.
          </p>
        ) : (
          questions.map(
            (
              question,
              index,
            ) => (
              <div
                key={
                  question.id
                }
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius:
                    "8px",
                  padding:
                    "14px",
                  marginBottom:
                    "10px",
                }}
              >
                <strong>
                  {index + 1}.{" "}
                  {
                    question.questionText
                  }
                </strong>

                <p>
                  Type:{" "}
                  {
                    question.questionType
                  }{" "}
                  | Marks:{" "}
                  {
                    question.marks
                  }
                </p>

                <p>
                  Correct:{" "}
                  {
                    question.correctAnswer
                  }
                </p>

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
                        question,
                      )
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
                      void moveQuestion(
                        question,
                        -1,
                      )
                    }
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      index ===
                      questions.length -
                        1
                    }
                    onClick={() =>
                      void moveQuestion(
                        question,
                        1,
                      )
                    }
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(
                        String(
                          question.id,
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
