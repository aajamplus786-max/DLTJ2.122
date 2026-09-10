// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/pages/Learning/MySQLCompletion.tsx
// =====================================================

import { Link } from "react-router-dom";

export default function MySQLCompletion() {
  return (
    <main className="learning-page">

      <section className="learning-container">

        <div className="learning-completion">

          <div className="learning-completion-icon">
            ✓
          </div>

          <span className="learning-eyebrow">
            MYSQL
          </span>

          <h1>
            Learning Section Completed
          </h1>

          <p>
            You have reached the end of the
            currently available MySQL learning
            content.
          </p>

          <div className="learning-completion-actions">

            <Link
              to="/learning"
              className="learning-action-button"
            >
              Back to Learning
            </Link>

            <Link
              to="/test"
              className="learning-action-button secondary"
            >
              Go to Tests
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}