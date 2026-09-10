
// =====================================================
// DLTJ2.10
// ADMIN - TEST MANAGEMENT
// FILE: src/pages/Admin/TestManagement.tsx
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

interface Test {
  id: string;
  technologyId: string;
  title: string;
  testType: string;
  startChapter?: number;
  endChapter?: number;
  passPercentage: number;
  displayOrder: number;
  isActive?: boolean;
}

interface TestForm {
  title: string;
  testType: string;
  startChapter: number;
  endChapter: number;
  passPercentage: number;
  displayOrder: number;
  isActive: boolean;
}

const emptyForm: TestForm = {
  title: "",
  testType: "chapter",
  startChapter: 1,
  endChapter: 1,
  passPercentage: 60,
  displayOrder: 1,
  isActive: true,
};

export default function TestManagement() {
  const [technologies, setTechnologies] =
    useState<Technology[]>([]);

  const [tests, setTests] =
    useState<Test[]>([]);

  const [technologyId, setTechnologyId] =
    useState<string>("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<TestForm>(
      emptyForm,
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

        if (
          !technologyId &&
          items.length > 0
        ) {
          setTechnologyId(
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
    }, [technologyId]);

  const loadTests =
    useCallback(async (): Promise<void> => {
      if (!technologyId) {
        setTests([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await apiGet(
            `/content/tests/technology/${encodeId(
              technologyId,
            )}`,
          );

        const items =
          normalizeList<Test>(
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

        setTests(items);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load tests.",
        );
      } finally {
        setLoading(false);
      }
    }, [technologyId]);

  useEffect(() => {
    void loadTechnologies();
  }, [loadTechnologies]);

  useEffect(() => {
    void loadTests();
  }, [loadTests]);

  const resetForm =
    (): void => {
      setEditingId(null);

      setForm({
        ...emptyForm,
        displayOrder:
          tests.length + 1,
      });
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

      if (!form.title.trim()) {
        setError(
          "Test title is required.",
        );
        return;
      }

      if (
        form.testType ===
          "chapter" &&
        form.endChapter <
          form.startChapter
      ) {
        setError(
          "End chapter cannot be smaller than start chapter.",
        );
        return;
      }

      try {
        setSaving(true);
        setError("");
        setMessage("");

        const payload = {
          technologyId,
          title:
            form.title.trim(),
          testType:
            form.testType,
          startChapter:
            Number(
              form.startChapter,
            ),
          endChapter:
            Number(
              form.endChapter,
            ),
          passPercentage:
            Number(
              form.passPercentage,
            ),
          displayOrder:
            Number(
              form.displayOrder,
            ),
          isActive:
            form.isActive,
        };

        if (editingId) {
          await apiPut(
            `/content/tests/${encodeId(
              editingId,
            )}`,
            payload,
          );

          setMessage(
            "Test updated successfully.",
          );
        } else {
          await apiPost(
            "/content/tests",
            payload,
          );

          setMessage(
            "Test created successfully.",
          );
        }

        resetForm();
        await loadTests();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save test.",
        );
      } finally {
        setSaving(false);
      }
    };

  const handleEdit = (
    test: Test,
  ): void => {
    setEditingId(
      String(test.id),
    );

    setForm({
      title:
        test.title ??
        "",

      testType:
        test.testType ??
        "chapter",

      startChapter:
        Number(
          test.startChapter,
        ) || 1,

      endChapter:
        Number(
          test.endChapter,
        ) || 1,

      passPercentage:
        Number(
          test.passPercentage,
        ) || 60,

      displayOrder:
        Number(
          test.displayOrder,
        ) || 1,

      isActive:
        test.isActive !==
        false,
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
          "Delete this test?",
        )
      ) {
        return;
      }

      try {
        setError("");
        setMessage("");

        await apiDelete(
          `/content/tests/${encodeId(
            id,
          )}`,
        );

        setMessage(
          "Test deleted successfully.",
        );

        if (
          editingId ===
          id
        ) {
          resetForm();
        }

        await loadTests();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete test.",
        );
      }
    };

  const moveTest =
    async (
      test: Test,
      direction: -1 | 1,
    ): Promise<void> => {
      const index =
        tests.findIndex(
          (item) =>
            String(
              item.id,
            ) ===
            String(
              test.id,
            ),
        );

      if (index < 0) return;

      const targetIndex =
        index +
        direction;

      if (
        targetIndex <
          0 ||
        targetIndex >=
          tests.length
      ) {
        return;
      }

      const target =
        tests[targetIndex];

      try {
        await apiPut(
          `/content/tests/${encodeId(
            test.id,
          )}`,
          {
            displayOrder:
              Number(
                target.displayOrder,
              ),
          },
        );

        await apiPut(
          `/content/tests/${encodeId(
            target.id,
          )}`,
          {
            displayOrder:
              Number(
                test.displayOrder,
              ),
          },
        );

        await loadTests();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to reorder tests.",
        );
      }
    };

  return (
    <div
      style={{
        padding:
          "24px",
        maxWidth:
          "1200px",
        margin:
          "0 auto",
      }}
    >
      <h1>
        Test Management
      </h1>

      {error && (
        <div
          style={{
            background:
              "#fee2e2",
            padding:
              "12px",
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
            padding:
              "12px",
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
          background:
            "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "12px",
          padding:
            "20px",
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
          value={
            technologyId
          }
          onChange={(
            event,
          ) =>
            setTechnologyId(
              event.target
                .value,
            )
          }
          style={{
            display:
              "block",
            width:
              "100%",
            marginTop:
              "8px",
            padding:
              "10px",
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
              </option>
            ),
          )}
        </select>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        style={{
          background:
            "#fff",
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "12px",
          padding:
            "20px",
          marginBottom:
            "20px",
        }}
      >
        <h2>
          {editingId
            ? "Edit Test"
            : "Add Test"}
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
          <input
            type="text"
            value={
              form.title
            }
            onChange={(
              event,
            ) =>
              setForm({
                ...form,
                title:
                  event.target
                    .value,
              })
            }
            placeholder="Test title"
          />

          <select
            value={
              form.testType
            }
            onChange={(
              event,
            ) =>
              setForm({
                ...form,
                testType:
                  event.target
                    .value,
              })
            }
          >
            <option value="chapter">
              Chapter Test
            </option>

            <option value="final">
              Final Test
            </option>
          </select>

          <input
            type="number"
            min={1}
            value={
              form.startChapter
            }
            onChange={(
              event,
            ) =>
              setForm({
                ...form,
                startChapter:
                  Number(
                    event.target
                      .value,
                  ),
              })
            }
            placeholder="Start chapter"
          />

          <input
            type="number"
            min={1}
            value={
              form.endChapter
            }
            onChange={(
              event,
            ) =>
              setForm({
                ...form,
                endChapter:
                  Number(
                    event.target
                      .value,
                  ),
              })
            }
            placeholder="End chapter"
          />

          <input
            type="number"
            min={0}
            max={100}
            value={
              form.passPercentage
            }
            onChange={(
              event,
            ) =>
              setForm({
                ...form,
                passPercentage:
                  Number(
                    event.target
                      .value,
                  ),
              })
            }
            placeholder="Pass percentage"
          />

          <input
            type="number"
            min={1}
            value={
              form.displayOrder
            }
            onChange={(
              event,
            ) =>
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
            onChange={(
              event,
            ) =>
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
                ? "Update Test"
                : "Create Test"}
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
          Tests
        </h2>

        {loading ? (
          <p>
            Loading...
          </p>
        ) : tests.length ===
          0 ? (
          <p>
            No tests found.
          </p>
        ) : (
          tests.map(
            (
              test,
              index,
            ) => (
              <div
                key={
                  test.id
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
                  {
                    test.title
                  }
                </strong>

                <p>
                  Type:{" "}
                  {
                    test.testType
                  }
                </p>

                <p>
                  Chapters:{" "}
                  {
                    test.startChapter
                  }{" "}
                  -{" "}
                  {
                    test.endChapter
                  }
                </p>

                <p>
                  Pass:{" "}
                  {
                    test.passPercentage
                  }%
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
                        test,
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
                      void moveTest(
                        test,
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
                      tests.length -
                        1
                    }
                    onClick={() =>
                      void moveTest(
                        test,
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
                          test.id,
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
