// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/home/QuickActions.tsx
// =====================================================

import { useNavigate } from "react-router-dom";
import Card from "../common/Card";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "📚",
      title: "Learning",
      description: "Continue your learning journey",
      path: "/learning",
    },
    {
      icon: "💻",
      title: "Practice",
      description: "Improve your coding skills",
      path: "/practice",
    },
    {
      icon: "📝",
      title: "Tests",
      description: "Check your knowledge",
      path: "/test",
    },
  ];

  return (
    <section className="dltj-section">
      <div className="dltj-section-heading">
        <div>
          <span>QUICK ACTIONS</span>
          <h2>What do you want to do?</h2>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <Card
            key={action.title}
            className="quick-action-card"
            onClick={() => navigate(action.path)}
          >
            <div className="quick-action-icon">
              {action.icon}
            </div>

            <div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>

            <span className="quick-action-arrow">
              →
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}