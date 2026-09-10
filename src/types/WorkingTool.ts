// =====================================================
// DLTJ2.1
// WORKING TOOL — CORE TYPES
// FILE: src/types/WorkingTool.ts
// DATE: 2026-08-31
// =====================================================

// =====================================================
// TOOL MODES
// =====================================================

export type WorkingToolMode =
  | "editor"
  | "preview"
  | "terminal";

// =====================================================
// RUN STATUS
// =====================================================

export type WorkingToolRunStatus =
  | "idle"
  | "running"
  | "success"
  | "error";

// =====================================================
// PANEL TYPES
// =====================================================

export type WorkingToolPanel =
  | "explorer"
  | "search"
  | "source-control"
  | "run";

// =====================================================
// EDITOR THEME
// =====================================================

export type WorkingToolTheme =
  | "light"
  | "dark";

// =====================================================
// EDITOR CURSOR
// =====================================================

export interface EditorCursorPosition {
  line: number;
  column: number;
  offset: number;
}

// =====================================================
// OPEN EDITOR TAB
// =====================================================

export interface WorkingToolEditorTab {
  fileId: string;
  isActive: boolean;
  isDirty: boolean;
}

// =====================================================
// RUN RESULT
// =====================================================

export interface WorkingToolRunResult {
  status: WorkingToolRunStatus;

  stdout: string;
  stderr: string;

  exitCode: number | null;

  durationMs: number;

  startedAt: number;
  finishedAt?: number;
}

// =====================================================
// PREVIEW RESULT
// =====================================================

export interface WorkingToolPreview {
  fileId: string;

  fileName: string;

  content: string;

  url?: string;

  createdAt: number;
}

// =====================================================
// WORKING TOOL STATE
// =====================================================

export interface WorkingToolState {
  technologyId: string;

  workspaceId: string;

  activeFileId: string | null;

  openFileIds: string[];

  activePanel: WorkingToolPanel;

  mode: WorkingToolMode;

  theme: WorkingToolTheme;

  cursor: EditorCursorPosition;

  runStatus: WorkingToolRunStatus;

  lastRun: WorkingToolRunResult | null;

  preview: WorkingToolPreview | null;

  terminalOutput: string[];

  isSaving: boolean;

  isRunning: boolean;

  isDirty: boolean;
}

// =====================================================
// RUN REQUEST
// =====================================================

export interface WorkingToolRunRequest {
  workspaceId: string;

  fileId: string;

  fileName: string;

  language: string;

  code: string;

  files: Array<{
    id: string;
    name: string;
    path: string;
    language: string;
    content: string;
  }>;
}

// =====================================================
// PREVIEW REQUEST
// =====================================================

export interface WorkingToolPreviewRequest {
  workspaceId: string;

  fileId: string;

  fileName: string;

  content: string;

  files: Array<{
    name: string;
    path: string;
    content: string;
  }>;
}

// =====================================================
// SAVE REQUEST
// =====================================================

export interface WorkingToolSaveRequest {
  workspaceId: string;

  fileId: string;

  content: string;

  fileName?: string;
}

// =====================================================
// TOOL ACTION
// =====================================================

export type WorkingToolAction =
  | {
      type: "OPEN_FILE";
      fileId: string;
    }
  | {
      type: "CLOSE_FILE";
      fileId: string;
    }
  | {
      type: "SAVE_FILE";
      fileId: string;
    }
  | {
      type: "RUN_FILE";
      fileId: string;
    }
  | {
      type: "PREVIEW_FILE";
      fileId: string;
    }
  | {
      type: "SELECT_PANEL";
      panel: WorkingToolPanel;
    }
  | {
      type: "SET_MODE";
      mode: WorkingToolMode;
    }
  | {
      type: "SET_THEME";
      theme: WorkingToolTheme;
    }
  | {
      type: "CLEAR_OUTPUT";
    };