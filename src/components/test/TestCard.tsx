// =====================================================
// DLTJ2.0
// STEP 4
// FILE: src/components/test/TestCard.tsx
// =====================================================

import { useNavigate } from "react-router-dom";

interface TestCardProps {
  technologyId: string;
  testNumber: number;
  fromChapter: number;
  toChapter: number;
  unlocked: boolean;
  passed: boolean;
}

export default function TestCard({
  technologyId,
  testNumber,
  fromChapter,
  toChapter,
  unlocked,
  passed,
}: TestCardProps) {
  const navigate = useNavigate();

  const openTest = () => {
    if (!unlocked || passed) {
      return;
    }

    navigate(
      `/test/${technologyId}/${testNumber}`
    );
  };

  return (
    <div
      className={`test-card ${
        !unlocked
          ? "test-card-locked"
          : ""
      }`}
    >
      <div className="test-card-icon">
        {passed
          ? "✅"
          : unlocked
          ? "📝"
          : "🔒"}
      </div>

      <div className="test-card-content">
        <span>
          TEST {testNumber}
        </span>

        <h3>
          Chapters {fromChapter} –{" "}
          {toChapter}
        </h3>

        <p>
          {passed
            ? "Test passed. Next chapters are unlocked."
            : unlocked
            ? "You completed the required chapters. Test is ready."
            : `Complete chapters ${fromChapter}–${toChapter} to unlock this test.`}
        </p>
      </div>

      <button
        disabled={!unlocked || passed}
        onClick={openTest}
      >
        {passed
          ? "Passed"
          : unlocked
          ? "Start Test"
          : "Locked"}
      </button>
    </div>
  );
}