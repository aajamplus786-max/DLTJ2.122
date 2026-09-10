// =====================================================
// DLTJ2.0
// STEP 2
// FILE: src/components/common/Card.tsx
// =====================================================

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      className={`dltj-card ${onClick ? "dltj-card-clickable" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}