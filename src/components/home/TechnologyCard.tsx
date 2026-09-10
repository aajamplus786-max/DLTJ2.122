// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/home/TechnologyCard.tsx
// =====================================================

import { useNavigate } from "react-router-dom";
import type { Technology } from "../../types/Technology";
import Card from "../common/Card";
import Button from "../common/Button";

interface TechnologyCardProps {
  technology: Technology;
}

export default function TechnologyCard({
  technology,
}: TechnologyCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="technology-card">
      <div className="technology-icon">
        {technology.shortName.substring(0, 1)}
      </div>

      <div className="technology-info">
        <h3>{technology.name}</h3>

        <p>{technology.description}</p>

        <span className="technology-chapters">
          {technology.totalChapters > 0
            ? `${technology.totalChapters} Chapters`
            : "Coming Soon"}
        </span>
      </div>

      <Button
        onClick={() =>
          navigate(`/learning/${technology.id}`)
        }
      >
        Learn
      </Button>
    </Card>
  );
}