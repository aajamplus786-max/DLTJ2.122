// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/components/learning/LessonHeader.tsx
// =====================================================

import type { Lesson } from "../../types/Lesson";

// =====================================================
// PROPS
// =====================================================

interface LessonHeaderProps {
  lesson: Lesson;
  completed?: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export default function LessonHeader({
  lesson,
  completed = false,
}: LessonHeaderProps) {
  return (
    <header className="lesson-header">

      {/* =========================================
          LABEL
      ========================================= */}

      <span className="lesson-header-label">
        LEARNING
      </span>

      {/* =========================================
          TITLE
      ========================================= */}

      <h1>
        {lesson.title}
      </h1>

      {/* =========================================
          INTRODUCTION
      ========================================= */}

      {lesson.introduction && (
        <p>
          {lesson.introduction}
        </p>
      )}

      {/* =========================================
          STATUS
      ========================================= */}

      <div className="lesson-header-status">
        {completed ? (
          <span>
            ✓ Completed
          </span>
        ) : (
          <span>
            In Progress
          </span>
        )}
      </div>

    </header>
  );
}