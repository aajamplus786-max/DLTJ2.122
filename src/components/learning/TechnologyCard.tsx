
// =====================================================
// DLTJ2.1
// LEARNING SYSTEM
// FILE: src/components/learning/TechnologyCard.tsx
// =====================================================

import { useNavigate } from "react-router-dom";
import type { Technology } from "../../types/Technology";
import ProgressBar from "./ProgressBar";

// =====================================================
// PROPS
// =====================================================

interface TechnologyCardProps {
  technology: Technology;
  progress?: number;
}

// =====================================================
// COMPONENT
// =====================================================

export default function TechnologyCard({
  technology,
  progress = 0,
}: TechnologyCardProps) {
  const navigate = useNavigate();

  // ===================================================
  // OPEN LANGUAGE
  // ===================================================

  const handleOpen = () => {
    navigate(`/learning/${technology.id}`);
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <article
      className="learning-technology-card"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          handleOpen();
        }
      }}
    >
      {/* =================================================
          LANGUAGE ICON
      ================================================= */}

      <div className="learning-technology-icon">
        {technology.icon ? (
          <span>{technology.icon}</span>
        ) : (
          <span>
            {technology.shortName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* =================================================
          LANGUAGE CONTENT
      ================================================= */}

      <div className="learning-technology-body">

        <h3>
          {technology.name}
        </h3>

        <p>
          {technology.description}
        </p>

        {/* ===============================================
            META
        =============================================== */}

        <div className="learning-technology-meta">

          <span>
            {technology.totalChapters} Chapters
          </span>

          <span>
            {technology.available
              ? "Available"
              : "Unavailable"}
          </span>

        </div>

        {/* ===============================================
            PROGRESS
        =============================================== */}

        <ProgressBar
          value={progress}
          label="Learning Progress"
        />

      </div>
    </article>
  );
}

