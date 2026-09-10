// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/home/CourseGrid.tsx
// =====================================================

import { technologies } from "../../data/technologies/technologies";
import TechnologyCard from "./TechnologyCard";

export default function CourseGrid() {
  return (
    <section className="dltj-section">
      <div className="dltj-section-heading">
        <div>
          <span>LEARNING</span>
          <h2>Choose Your Technology</h2>
        </div>

        <p>
          Start from the basics and build your skills
          step by step.
        </p>
      </div>

      <div className="technology-grid">
        {technologies.map((technology) => (
          <TechnologyCard
            key={technology.id}
            technology={technology}
          />
        ))}
      </div>
    </section>
  );
}