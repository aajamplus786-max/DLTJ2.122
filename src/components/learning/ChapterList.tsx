
// =====================================================
// DLTJ2.10
// DYNAMIC LEARNING SYSTEM
// FILE: src/components/learning/ChapterList.tsx
// DATE: 2026-09-07
// LOCATION: src/components/learning
// =====================================================

import type {
  Chapter,
} from "../../types/Chapter";

import ChapterCard from "./ChapterCard";

// =====================================================
// PROPS
// =====================================================

interface ChapterListProps {
  chapters: Chapter[];

  completedChapterIds?: string[];

  onChapterClick?: (
    chapter: Chapter
  ) => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function ChapterList({
  chapters,
  completedChapterIds = [],
  onChapterClick,
}: ChapterListProps) {
  // ===================================================
  // EMPTY
  // ===================================================

  if (
    chapters.length ===
    0
  ) {
    return (
      <section
        className="chapter-list"
      >

        <div
          className="chapter-list-header"
        >

          <h2>
            Chapters
          </h2>

          <span>
            0 Chapters
          </span>

        </div>

        <div className="chapter-list-empty">

          <h3>
            No Chapters Available
          </h3>

          <p>
            Learning chapters will
            appear here after they
            are imported.
          </p>

        </div>

      </section>
    );
  }

  // ===================================================
  // SORT
  // ===================================================

  const sortedChapters =
    [...chapters].sort(
      (
        a,
        b,
      ) =>
        Number(
          a.chapterNumber ??
            a.displayOrder ??
            0,
        ) -
        Number(
          b.chapterNumber ??
            b.displayOrder ??
            0,
        ),
    );

  // ===================================================
  // UI
  // ===================================================

  return (
    <section
      className="chapter-list"
    >

      {/* =========================================
          HEADER
      ========================================= */}

      <div
        className="chapter-list-header"
      >

        <h2>
          Chapters
        </h2>

        <span>
          {
            sortedChapters.length
          }{" "}

          {
            sortedChapters.length ===
            1
              ? "Chapter"
              : "Chapters"
          }

        </span>

      </div>

      {/* =========================================
          CHAPTERS
      ========================================= */}

      <div
        className="chapter-list-grid"
      >

        {sortedChapters.map(
          (
            chapter,
          ) => (

            <ChapterCard
              key={
                chapter.id
              }

              chapter={
                chapter
              }

              completed={
                completedChapterIds.includes(
                  chapter.id,
                )
              }

              onClick={
                onChapterClick
              }
            />

          ),
        )}

      </div>

    </section>
  );
}
