import type { ReactNode } from "react";

interface ToolHeaderProps {
  technologyId?: string;
  title?: string;
  children?: ReactNode;
}

export default function ToolHeader({
  technologyId = "html",
  title,
  children,
}: ToolHeaderProps) {
  const displayTitle =
    title ||
    technologyId.charAt(0).toUpperCase() +
      technologyId.slice(1);

  return (
    <header className="working-tool-header">
      <div className="working-tool-header-left">
        <div className="working-tool-logo">
          DLTJ2.1
        </div>

        <div className="working-tool-title">
          {displayTitle}
        </div>
      </div>

      <div className="working-tool-header-center">
        {children}
      </div>

      <div className="working-tool-header-right">
        <span className="working-tool-technology">
          {technologyId}
        </span>
      </div>
    </header>
  );
}