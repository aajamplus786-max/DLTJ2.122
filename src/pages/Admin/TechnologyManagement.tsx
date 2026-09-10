
// =====================================================
// DLTJ2.10
// ADMIN - TECHNOLOGY MANAGEMENT
// FILE: src/pages/Admin/TechnologyManagement.tsx
// UPDATED: 2026-09-07
// LOCATION: F:\dltj2.122\src\pages\Admin\TechnologyManagement.tsx
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
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  encodeId,
  normalizeList,
} from "./adminApi";

import TechnologyForm from "./TechnologyForm";

import type {
  Technology,
  TechnologyFormData,
} from "./TechnologyForm";

import TechnologyList from "./TechnologyList";

// =====================================================
// COMPONENT
// =====================================================

export default function TechnologyManagement() {
  const navigate =
    useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [
    technologies,
    setTechnologies,
  ] = useState<Technology[]>([]);

  const [
    selectedTechnology,
    setSelectedTechnology,
  ] =
    useState<Technology | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  // ===================================================
  // LOAD TECHNOLOGIES
  // ===================================================

  const loadTechnologies =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);
          setError("");

          const response =
            await apiGet<unknown>(
              "/content/technologies",
            );

          const items =
            normalizeList<Technology>(
              response.data,
            );

          const sorted =
            [...items].sort(
              (
                first,
                second,
              ) =>
                Number(
                  first.displayOrder,
                ) -
                Number(
                  second.displayOrder,
                ),
            );

          setTechnologies(
            sorted,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load technologies.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
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
  // SAVE TECHNOLOGY
  // ===================================================

  const handleSubmit =
    async (
      data: TechnologyFormData,
    ): Promise<void> => {
      try {
        setSaving(true);
        setError("");
        setMessage("");

        if (
          selectedTechnology
        ) {
          await apiPut(
            `/content/technologies/${encodeId(
              selectedTechnology.id,
            )}`,
            data,
          );

          setMessage(
            "Technology updated successfully.",
          );
        } else {
          await apiPost(
            "/content/technologies",
            data,
          );

          setMessage(
            "Technology created successfully.",
          );
        }

        setSelectedTechnology(
          null,
        );

        await loadTechnologies();
      } catch (err) {
        const messageText =
          err instanceof Error
            ? err.message
            : "Failed to save technology.";

        setError(
          messageText,
        );

        throw err;
      } finally {
        setSaving(false);
      }
    };

  // ===================================================
  // EDIT
  // ===================================================

  const handleEdit = (
    technology: Technology,
  ): void => {
    setSelectedTechnology(
      technology,
    );

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // NEW
  // ===================================================

  const handleNew =
    (): void => {
      setSelectedTechnology(
        null,
      );

      setError("");
      setMessage("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete =
    async (
      technology: Technology,
    ): Promise<void> => {
      const confirmed =
        window.confirm(
          `Delete "${technology.name}"?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setMessage("");

        await apiDelete(
          `/content/technologies/${encodeId(
            technology.id,
          )}`,
        );

        if (
          selectedTechnology?.id ===
          technology.id
        ) {
          setSelectedTechnology(
            null,
          );
        }

        setMessage(
          "Technology deleted successfully.",
        );

        await loadTechnologies();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete technology.",
        );
      }
    };

  // ===================================================
  // REORDER
  // ===================================================

  const handleMove =
    async (
      technology: Technology,
      direction: -1 | 1,
    ): Promise<void> => {
      const index =
        technologies.findIndex(
          (item) =>
            String(
              item.id,
            ) ===
            String(
              technology.id,
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
          technologies.length
      ) {
        return;
      }

      const target =
        technologies[
          targetIndex
        ];

      if (!target) {
        return;
      }

      const currentOrder =
        Number(
          technology.displayOrder,
        );

      const targetOrder =
        Number(
          target.displayOrder,
        );

      try {
        setError("");
        setMessage("");
        setSaving(true);

        await apiPut(
          `/content/technologies/${encodeId(
            technology.id,
          )}`,
          {
            displayOrder:
              targetOrder,
          },
        );

        await apiPut(
          `/content/technologies/${encodeId(
            target.id,
          )}`,
          {
            displayOrder:
              currentOrder,
          },
        );

        setMessage(
          "Technology order updated successfully.",
        );

        await loadTechnologies();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to reorder technologies.",
        );
      } finally {
        setSaving(false);
      }
    };

  // ===================================================
  // BACK TO ADMIN HOME
  // ===================================================

  const handleBackToAdmin =
    (): void => {
      navigate(
        "/admin",
      );
    };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div
      style={{
        width:
          "100%",

        maxWidth:
          "1200px",

        margin:
          "0 auto",

        padding:
          "24px",

        boxSizing:
          "border-box",
      }}
    >
      {/* =================================================
          TOP NAVIGATION
         ================================================= */}

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
        <button
          type="button"
          onClick={
            handleBackToAdmin
          }
          style={{
            padding:
              "10px 16px",

            border:
              "1px solid #d1d5db",

            borderRadius:
              "8px",

            background:
              "#ffffff",

            color:
              "#20222b",

            fontWeight:
              700,

            cursor:
              "pointer",
          }}
        >
          ← Admin Home
        </button>

        <button
          type="button"
          onClick={
            handleNew
          }
          disabled={
            saving
          }
          style={{
            padding:
              "10px 16px",

            border:
              "1px solid #d1d5db",

            borderRadius:
              "8px",

            background:
              "#20222b",

            color:
              "#ffffff",

            fontWeight:
              700,

            cursor:
              saving
                ? "not-allowed"
                : "pointer",
          }}
        >
          + Add Technology
        </button>
      </div>

      {/* =================================================
          HEADER
         ================================================= */}

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
                0,

              marginBottom:
                "6px",
            }}
          >
            Technology Management
          </h1>

          <p
            style={{
              margin:
                0,

              color:
                "#6b7280",
            }}
          >
            Manage dynamic learning
            technologies.
          </p>
        </div>
      </div>

      {/* =================================================
          ERROR
         ================================================= */}

      {error && (
        <div
          style={{
            background:
              "#fee2e2",

            color:
              "#991b1b",

            borderRadius:
              "8px",

            padding:
              "12px",

            marginBottom:
              "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS
         ================================================= */}

      {message && (
        <div
          style={{
            background:
              "#dcfce7",

            color:
              "#166534",

            borderRadius:
              "8px",

            padding:
              "12px",

            marginBottom:
              "16px",
          }}
        >
          {message}
        </div>
      )}

      {/* =================================================
          FORM
         ================================================= */}

      <div
        style={{
          marginBottom:
            "20px",
        }}
      >
        <TechnologyForm
          technology={
            selectedTechnology
          }
          onSubmit={
            handleSubmit
          }
          onCancel={
            selectedTechnology
              ? handleNew
              : undefined
          }
          saving={
            saving
          }
        />
      </div>

      {/* =================================================
          LIST
         ================================================= */}

      <TechnologyList
        technologies={
          technologies
        }
        loading={
          loading
        }
        onEdit={
          handleEdit
        }
        onDelete={(
          technology,
        ) => {
          void handleDelete(
            technology,
          );
        }}
        onMoveUp={(
          technology,
        ) => {
          void handleMove(
            technology,
            -1,
          );
        }}
        onMoveDown={(
          technology,
        ) => {
          void handleMove(
            technology,
            1,
          );
        }}
      />
    </div>
  );
}
