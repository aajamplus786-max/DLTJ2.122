// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/ToolLayout.tsx
// =====================================================

import type { ReactNode } from "react";

import ToolHeader from "./ToolHeader";
import ToolSidebar from "./ToolSidebar";
import ToolBottomBar from "./ToolBottomBar";

interface ToolLayoutProps {
  children?: ReactNode;
  technologyId?: string;
  title?: string;
}

export default function ToolLayout({
  children,
  technologyId = "html",
  title,
}: ToolLayoutProps) {
  return (
    <div className="working-tool">
      <ToolHeader
        technologyId={technologyId}
        title={title}
      />

      <div className="working-tool-body">
        <ToolSidebar
          technologyId={technologyId}
        />

        <main className="working-tool-main">
          {children}
        </main>
      </div>

      <ToolBottomBar />
    </div>
  );
}