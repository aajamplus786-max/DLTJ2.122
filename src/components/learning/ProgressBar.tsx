// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/components/learning/ProgressBar.tsx
// =====================================================

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  value,
  label = "Progress",
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round(value))
  );

  return (
    <div className="learning-progress">

      <div className="learning-progress-header">
        <span>{label}</span>

        {showPercentage && (
          <span>{percentage}%</span>
        )}
      </div>

      <div
        className="learning-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="learning-progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}