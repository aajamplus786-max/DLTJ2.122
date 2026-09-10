// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/common/Header.tsx
// =====================================================

import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showHomeButton?: boolean;
}

export default function Header({
  title = "DLTJ2.0",
  subtitle = "Learn • Practice • Test",
  showHomeButton = false,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="dltj-header">
      <div className="dltj-header-inner">
        <div className="dltj-brand">
          <div className="dltj-logo">D</div>

          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>

        {showHomeButton && (
          <button
            className="dltj-header-home"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        )}
      </div>
    </header>
  );
}