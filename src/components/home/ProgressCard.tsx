// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/home/ProgressCard.tsx
// =====================================================

import Card from "../common/Card";

export default function ProgressCard() {
  return (
    <Card className="home-progress-card">
      <div className="progress-card-header">
        <div>
          <span>YOUR PROGRESS</span>
          <h2>Keep Learning</h2>
        </div>

        <div className="progress-percentage">
          0%
        </div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" />
      </div>

      <div className="progress-card-footer">
        <span>0 Chapters Completed</span>
        <span>Start your journey 🚀</span>
      </div>
    </Card>
  );
}