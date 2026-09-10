
// =====================================================
// DLTJ2.10
// ADMIN - TECHNOLOGY LIST
// FILE: src/pages/Admin/TechnologyList.tsx
// UPDATED: 2026-09-07
// LOCATION: F:\dltj2.122\src\pages\Admin\TechnologyList.tsx
// =====================================================

import type {
  Technology,
} from "./TechnologyForm";

// =====================================================
// PROPS
// =====================================================

export interface TechnologyListProps {
  technologies:
    Technology[];

  loading?:
    boolean;

  onEdit: (
    technology: Technology,
  ) => void;

  onDelete: (
    technology: Technology,
  ) => void;

  onMoveUp?: (
    technology: Technology,
  ) => void;

  onMoveDown?: (
    technology: Technology,
  ) => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function TechnologyList({
  technologies,

  loading = false,

  onEdit,

  onDelete,

  onMoveUp,

  onMoveDown,
}: TechnologyListProps) {
  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div
        style={{
          background:
            "#ffffff",

          border:
            "1px solid #e5e7eb",

          borderRadius:
            "12px",

          padding:
            "20px",
        }}
      >
        <p
          style={{
            margin: 0,
          }}
        >
          Loading technologies...
        </p>
      </div>
    );
  }

  // ===================================================
  // EMPTY
  // ===================================================

  if (
    technologies.length ===
    0
  ) {
    return (
      <div
        style={{
          background:
            "#ffffff",

          border:
            "1px solid #e5e7eb",

          borderRadius:
            "12px",

          padding:
            "20px",
        }}
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
          }}
        >
          <div>
            <h2
              style={{
                marginTop:
                  0,

                marginBottom:
                  "6px",
              }}
            >
              Technologies
            </h2>

            <p
              style={{
                margin:
                  0,

                color:
                  "#6b7280",
              }}
            >
              No technologies
              found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // LIST
  // ===================================================

  return (
    <div
      style={{
        background:
          "#ffffff",

        border:
          "1px solid #e5e7eb",

        borderRadius:
          "12px",

        padding:
          "20px",
      }}
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
        <h2
          style={{
            margin:
              0,
          }}
        >
          Technologies
        </h2>

        <span
          style={{
            color:
              "#6b7280",

            fontSize:
              "14px",
          }}
        >
          {technologies.length}{" "}
          {technologies.length ===
          1
            ? "technology"
            : "technologies"}
        </span>
      </div>

      <div
        style={{
          display:
            "grid",

          gap:
            "10px",
        }}
      >
        {technologies.map(
          (
            technology,
            index,
          ) => (
            <div
              key={
                technology.id
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
                    "16px",

                  flexWrap:
                    "wrap",
                }}
              >
                {/* =======================================
                    INFO
                   ======================================= */}

                <div
                  style={{
                    minWidth:
                      "220px",

                    flex:
                      "1 1 300px",
                  }}
                >
                  <div
                    style={{
                      fontWeight:
                        700,

                      fontSize:
                        "18px",
                    }}
                  >
                    {
                      technology.displayOrder
                    }
                    .{" "}
                    {
                      technology.name
                    }
                  </div>

                  <div
                    style={{
                      color:
                        "#6b7280",

                      marginTop:
                        "6px",
                    }}
                  >
                    Section:{" "}
                    {technology.section ||
                      "—"}
                  </div>

                  <div
                    style={{
                      marginTop:
                        "6px",
                    }}
                  >
                    Status:{" "}
                    <strong
                      style={{
                        color:
                          technology.isActive
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {technology.isActive
                        ? "Active"
                        : "Inactive"}
                    </strong>
                  </div>
                </div>

                {/* =======================================
                    ACTIONS
                   ======================================= */}

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "8px",

                    flexWrap:
                      "wrap",

                    alignItems:
                      "center",
                  }}
                >
                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() =>
                      onEdit(
                        technology,
                      )
                    }
                  >
                    Edit
                  </button>

                  {/* MOVE UP */}

                  {onMoveUp && (
                    <button
                      type="button"
                      disabled={
                        index ===
                        0
                      }
                      onClick={() =>
                        onMoveUp(
                          technology,
                        )
                      }
                      title="Move up"
                      aria-label={`Move ${technology.name} up`}
                    >
                      ↑
                    </button>
                  )}

                  {/* MOVE DOWN */}

                  {onMoveDown && (
                    <button
                      type="button"
                      disabled={
                        index ===
                        technologies.length -
                          1
                      }
                      onClick={() =>
                        onMoveDown(
                          technology,
                        )
                      }
                      title="Move down"
                      aria-label={`Move ${technology.name} down`}
                    >
                      ↓
                    </button>
                  )}

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        technology,
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

