
// =====================================================
// DLTJ2.10
// ADMIN - TECHNOLOGY FORM
// FILE: src/pages/Admin/TechnologyForm.tsx
// UPDATED: 2026-09-07
// LOCATION: F:\dltj2.122\src\pages\Admin\TechnologyForm.tsx
// =====================================================

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

// =====================================================
// TECHNOLOGY TYPE
// =====================================================

export interface Technology {
  id: string;

  name: string;

  section: string;

  displayOrder: number;

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}

// =====================================================
// FORM DATA
// =====================================================

export interface TechnologyFormData {
  name: string;

  section: string;

  displayOrder: number;

  isActive: boolean;
}

// =====================================================
// PROPS
// =====================================================

export interface TechnologyFormProps {
  technology?:
    | Technology
    | null;

  onSubmit?: (
    data: TechnologyFormData,
  ) =>
    | Promise<void>
    | void;

  onSaved?: () => void;

  onSuccess?: () => void;

  onCancel?: () => void;

  saving?: boolean;
}

// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM:
  TechnologyFormData = {
  name: "",

  section: "",

  displayOrder: 1,

  isActive: true,
};

// =====================================================
// COMPONENT
// =====================================================

export default function TechnologyForm({
  technology = null,

  onSubmit,

  onSaved,

  onSuccess,

  onCancel,

  saving = false,
}: TechnologyFormProps) {
  // ===================================================
  // STATE
  // ===================================================

  const [
    form,
    setForm,
  ] =
    useState<TechnologyFormData>(
      EMPTY_FORM,
    );

  const [
    error,
    setError,
  ] = useState("");

  // ===================================================
  // LOAD EDIT DATA
  // ===================================================

  useEffect(() => {
    if (technology) {
      setForm({
        name:
          technology.name ??
          "",

        section:
          technology.section ??
          "",

        displayOrder:
          Number(
            technology.displayOrder,
          ) || 1,

        isActive:
          technology.isActive !==
          false,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
      });
    }

    setError("");
  }, [
    technology,
  ]);

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();

      setError("");

      const name =
        form.name.trim();

      const section =
        form.section.trim();

      const displayOrder =
        Number(
          form.displayOrder,
        );

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!name) {
        setError(
          "Technology name is required.",
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

      // -----------------------------------------------
      // DATA
      // -----------------------------------------------

      const data:
        TechnologyFormData = {
        name,

        section,

        displayOrder,

        isActive:
          form.isActive,
      };

      // -----------------------------------------------
      // SUBMIT
      // -----------------------------------------------

      try {
        if (onSubmit) {
          await onSubmit(
            data,
          );
        }

        onSaved?.();

        onSuccess?.();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save technology.",
        );
      }
    };

  // ===================================================
  // UI
  // ===================================================

  return (
    <form
      onSubmit={
        handleSubmit
      }
      noValidate
      style={{
        background:
          "#ffffff",

        border:
          "1px solid #e5e7eb",

        borderRadius:
          "12px",

        padding:
          "20px",

        boxSizing:
          "border-box",
      }}
    >
      {/* =================================================
          TITLE
         ================================================= */}

      <h2
        style={{
          marginTop: 0,
          marginBottom:
            "18px",
        }}
      >
        {technology
          ? "Edit Technology"
          : "Add Technology"}
      </h2>

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
            padding:
              "10px 12px",
            borderRadius:
              "8px",
            marginBottom:
              "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          FIELDS
         ================================================= */}

      <div
        style={{
          display:
            "grid",
          gap:
            "14px",
        }}
      >
        {/* =============================================
            NAME
           ============================================= */}

        <div>
          <label
            htmlFor="technology-name"
            style={{
              display:
                "block",
              marginBottom:
                "6px",
              fontWeight:
                600,
            }}
          >
            Technology Name
          </label>

          <input
            id="technology-name"
            type="text"
            value={
              form.name
            }
            onChange={(
              event,
            ) => {
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  name:
                    event.target
                      .value,
                }),
              );
            }}
            placeholder="Example: HTML"
            autoComplete="off"
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

        {/* =============================================
            SECTION
           ============================================= */}

        <div>
          <label
            htmlFor="technology-section"
            style={{
              display:
                "block",
              marginBottom:
                "6px",
              fontWeight:
                600,
            }}
          >
            Section
          </label>

          <input
            id="technology-section"
            type="text"
            value={
              form.section
            }
            onChange={(
              event,
            ) => {
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  section:
                    event.target
                      .value,
                }),
              );
            }}
            placeholder="Example: Web Development"
            autoComplete="off"
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

        {/* =============================================
            DISPLAY ORDER
           ============================================= */}

        <div>
          <label
            htmlFor="technology-order"
            style={{
              display:
                "block",
              marginBottom:
                "6px",
              fontWeight:
                600,
            }}
          >
            Display Order
          </label>

          <input
            id="technology-order"
            type="number"
            min={1}
            step={1}
            value={
              form.displayOrder
            }
            onChange={(
              event,
            ) => {
              const value =
                Number(
                  event.target
                    .value,
                );

              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  displayOrder:
                    Number.isFinite(
                      value,
                    )
                      ? value
                      : 1,
                }),
              );
            }}
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

        {/* =============================================
            ACTIVE
           ============================================= */}

        <label
          htmlFor="technology-active"
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "8px",
            cursor:
              saving
                ? "not-allowed"
                : "pointer",
          }}
        >
          <input
            id="technology-active"
            type="checkbox"
            checked={
              form.isActive
            }
            onChange={(
              event,
            ) => {
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  isActive:
                    event.target
                      .checked,
                }),
              );
            }}
            disabled={
              saving
            }
          />

          <span>
            Active
          </span>
        </label>
      </div>

      {/* =================================================
          BUTTONS
         ================================================= */}

      <div
        style={{
          display:
            "flex",
          gap:
            "10px",
          flexWrap:
            "wrap",
          marginTop:
            "20px",
        }}
      >
        <button
          type="submit"
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
            cursor:
              saving
                ? "not-allowed"
                : "pointer",
          }}
        >
          {saving
            ? "Saving..."
            : technology
              ? "Update Technology"
              : "Create Technology"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={
              onCancel
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
              cursor:
                saving
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

