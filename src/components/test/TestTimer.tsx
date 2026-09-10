// =====================================================
// DLTJ2.0
// STEP 7.5
// FILE: src/components/test/TestTimer.tsx
// =====================================================

interface TestTimerProps {
  seconds: number;
}

export default function TestTimer({
  seconds,
}: TestTimerProps) {
  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  const formattedMinutes =
    String(minutes).padStart(2, "0");

  const formattedSeconds =
    String(
      remainingSeconds
    ).padStart(2, "0");

  const danger =
    seconds <= 300;

  return (
    <div
      className={
        danger
          ? "test-timer danger"
          : "test-timer"
      }
    >
      <span>
        ⏱
      </span>

      <strong>
        {formattedMinutes}:
        {formattedSeconds}
      </strong>
    </div>
  );
}