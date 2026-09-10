// =====================================================
// DLTJ2.0
// STEP 7
// FILE: src/components/test/TestProgress.tsx
// =====================================================

interface TestProgressProps {
  current: number;

  total: number;

  answered?: number;
}

// =====================================================
// COMPONENT
// =====================================================

export default function TestProgress({
  current,
  total,
  answered = 0,
}: TestProgressProps) {

  const percentage =
    total > 0
      ? Math.round(
          (current / total) * 100
        )
      : 0;

  return (
    <section className="test-progress">

      {/* =========================================
          TOP
      ========================================= */}

      <div className="test-progress-top">

        <span>
          Question {current} of {total}
        </span>

        <span>
          {answered}/{total} Answered
        </span>

      </div>

      {/* =========================================
          BAR
      ========================================= */}

      <div className="test-progress-bar">

        <div
          className="test-progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      {/* =========================================
          PERCENTAGE
      ========================================= */}

      <div className="test-progress-bottom">

        <span>
          Progress
        </span>

        <strong>
          {percentage}%
        </strong>

      </div>

    </section>
  );
}