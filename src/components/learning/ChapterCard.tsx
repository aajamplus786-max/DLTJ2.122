
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// FILE: src/components/learning/ChapterCard.tsx
// DATE: 2026-09-07
// LOCATION: src/components/learning
// =====================================================

import type {
  Chapter,
} from "../../types/Chapter";

// =====================================================
// PROPS
// =====================================================

interface ChapterCardProps {
  chapter: Chapter;

  onClick?: (
    chapter: Chapter
  ) => void;

  completed?: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export default function ChapterCard({
  chapter,
  onClick,
  completed = false,
}: ChapterCardProps) {
  const available =
    chapter.available !== false;

  const chapterNumber =
    Number(
      chapter.chapterNumber ??
        chapter.displayOrder ??
        0,
    );

  return (
    <button
      type="button"
      className={[
        "chapter-card",
        completed
          ? "chapter-card-completed"
          : "",
        !available
          ? "chapter-card-disabled"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => {
        if (
          available
        ) {
          onClick?.(
            chapter,
          );
        }
      }}
      disabled={
        !available
      }
    >

      {/* =========================================
          CHAPTER NUMBER
      ========================================= */}

      <div className="chapter-card-number">

        {String(
          chapterNumber,
        ).padStart(
          2,
          "0",
        )}

      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="chapter-card-content">

        <h3>
          {chapter.title}
        </h3>

        {chapter.description ? (
          <p>
            {
              chapter.description
            }
          </p>
        ) : (
          <p>
            Learn this chapter
            step by step.
          </p>
        )}

      </div>

      {/* =========================================
          STATUS
      ========================================= */}

      <div className="chapter-card-status">

        {completed ? (

          <span>
            Completed
          </span>

        ) : available ? (

          <span>
            Start
          </span>

        ) : (

          <span>
            Locked
          </span>

        )}

      </div>

    </button>
  );
}

