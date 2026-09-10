
// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/components/learning/LessonNavigation.tsx
// =====================================================

import {
  useNavigate,
} from "react-router-dom";

// =====================================================
// PROPS
// =====================================================

interface LessonNavigationProps {
  onPrevious: () => void;
  onNext: () => void;

  hasPrevious?: boolean;
  hasNext?: boolean;

  nextLabel?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function LessonNavigation({
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
  nextLabel = "Next →",
}: LessonNavigationProps) {

  const navigate =
    useNavigate();

  // ===================================================
  // BACK TO LEARNING
  // ===================================================

  function handleBackToLearning() {
    navigate("/learning");
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <section className="lesson-navigation">

      {/* =========================================
          PREVIOUS
      ========================================= */}

      <button
        type="button"
        className="lesson-nav-button lesson-nav-previous"
        onClick={onPrevious}
        disabled={!hasPrevious}
      >
        ← Previous
      </button>

      {/* =========================================
          CENTER
      ========================================= */}

      <div className="lesson-nav-info">

        <button
          type="button"
          className="lesson-nav-learning-button"
          onClick={handleBackToLearning}
        >
          Learning
        </button>

      </div>

      {/* =========================================
          NEXT
      ========================================= */}

      <button
        type="button"
        className="lesson-nav-button lesson-nav-next"
        onClick={onNext}
        disabled={!hasNext}
      >
        {nextLabel}
      </button>

    </section>
  );
}
