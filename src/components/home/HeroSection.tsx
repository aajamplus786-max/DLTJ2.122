// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/home/HeroSection.tsx
// =====================================================

import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="dltj-hero">
      <div className="dltj-hero-content">
        <span className="dltj-hero-badge">
          🚀 DLTJ2.0 Learning Platform
        </span>

        <h2>
          Learn.
          <br />
          Practice.
          <br />
          <span>Master.</span>
        </h2>

        <p>
          Learn programming and technology step by step
          with clear lessons, practical exercises and
          structured tests.
        </p>

        <div className="dltj-hero-actions">
          <Button onClick={() => navigate("/learning")}>
            Start Learning
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/practice")}
          >
            Practice Now
          </Button>
        </div>
      </div>

      <div className="dltj-hero-visual">
        <div className="dltj-hero-circle">
          <span>📚</span>
        </div>

        <div className="dltj-floating-card dltj-floating-one">
          📖 Learn
        </div>

        <div className="dltj-floating-card dltj-floating-two">
          💻 Practice
        </div>

        <div className="dltj-floating-card dltj-floating-three">
          🏆 Test
        </div>
      </div>
    </section>
  );
}