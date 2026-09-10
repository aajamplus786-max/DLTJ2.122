// =====================================================
// DLTJ2.1
// WORKING TOOL — VS CODE STYLE WORKSPACE
// FILE: src/pages/WorkingTools/WorkingToolsHome.tsx
// DATE: 2026-08-31
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import "../../styles/working-tools.css";

import CodeEditor from "../../components/workingTools/CodeEditor";
import EditorTabs from "../../components/workingTools/EditorTabs";

import type {
  EditorTabItem,
} from "../../components/workingTools/EditorTabs";

import type {
  SupportedLanguage,
} from "../../services/language/languageService";

// =====================================================
// TYPES
// =====================================================

interface WorkingFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: SupportedLanguage;
  modified: boolean;
}

type SideView =
  | "explorer"
  | "search"
  | "source"
  | "run";

type BottomPanel =
  | "problems"
  | "output"
  | "debug"
  | "console"
  | null;

// =====================================================
// MAIN
// =====================================================

export default function WorkingToolsHome() {
  const { technologyId } =
    useParams<{
      technologyId?: string;
    }>();

  const technology =
    technologyId?.toLowerCase() || "html";

  const storageKey =
    `dltj2-working-tool-${technology}`;

  // ===================================================
  // FILES
  // ===================================================

  const [files, setFiles] =
    useState<WorkingFile[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            storageKey,
          );

        if (saved) {
          return JSON.parse(
            saved,
          );
        }
      } catch {
        // Ignore invalid storage.
      }

      return [
        createInitialFile(
          technology,
        ),
      ];
    });

  const [activeFileId, setActiveFileId] =
    useState<string>(() => {
      try {
        const saved =
          localStorage.getItem(
            storageKey,
          );

        if (saved) {
          const parsed =
            JSON.parse(saved);

          if (
            Array.isArray(parsed) &&
            parsed.length > 0
          ) {
            return parsed[0].id;
          }
        }
      } catch {
        // Ignore.
      }

      return `file-${technology}`;
    });

  // ===================================================
  // VIEW
  // ===================================================

  const [sideView, setSideView] =
    useState<SideView>("explorer");

  const [bottomPanel, setBottomPanel] =
    useState<BottomPanel>(null);

  const [runMode, setRunMode] =
    useState(false);

  const [runOutput, setRunOutput] =
    useState("");

  const [runStatus, setRunStatus] =
    useState<
      "idle" |
      "running" |
      "success" |
      "error"
    >("idle");

  const [consoleLines, setConsoleLines] =
    useState<string[]>([]);

  const [searchText, setSearchText] =
    useState("");

  const [projectFolders, setProjectFolders] =
    useState<string[]>([]);

  // ===================================================
  // PERSIST FILES
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(files),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [files, storageKey]);

  // ===================================================
  // ACTIVE FILE
  // ===================================================

  const activeFile =
    files.find(
      (file) =>
        file.id === activeFileId,
    ) ?? files[0];

  // ===================================================
  // TABS
  // ===================================================

  const tabs =
    useMemo<EditorTabItem[]>(
      () =>
        files.map(
          (file) => ({
            id: file.id,
            name: file.name,
            path: file.path,
            language: file.language,
            modified:
              file.modified,
          }),
        ),
      [files],
    );

  // ===================================================
  // CHANGE CODE
  // ===================================================

  const handleEditorChange =
    (value: string) => {
      if (!activeFile) {
        return;
      }

      setFiles(
        (current) =>
          current.map(
            (file) =>
              file.id ===
              activeFile.id
                ? {
                    ...file,
                    content: value,
                    modified: true,
                  }
                : file,
          ),
      );
    };

  // ===================================================
  // SAVE
  // ===================================================

  const handleSave = () => {
    if (!activeFile) {
      return;
    }

    setFiles(
      (current) =>
        current.map(
          (file) =>
            file.id ===
            activeFile.id
              ? {
                  ...file,
                  modified: false,
                }
              : file,
        ),
    );

    addConsole(
      `Saved ${activeFile.name}`,
    );
  };

  // ===================================================
  // NEW FILE
  // ===================================================

  const handleNewFile = () => {
    const suggested =
      getDefaultFileName(
        technology,
      );

    const input =
      window.prompt(
        "New file name:",
        files.some(
          (file) =>
            file.name ===
            suggested,
        )
          ? `new-${suggested}`
          : suggested,
      );

    if (!input) {
      return;
    }

    const name =
      input.trim();

    if (!name) {
      return;
    }

    if (
      files.some(
        (file) =>
          file.name.toLowerCase() ===
          name.toLowerCase(),
      )
    ) {
      window.alert(
        "A file with this name already exists.",
      );
      return;
    }

    const file =
      createWorkingFile(
        name,
        technology,
      );

    setFiles(
      (current) => [
        ...current,
        file,
      ],
    );

    setActiveFileId(
      file.id,
    );

    setSideView(
      "explorer",
    );

    addConsole(
      `Created ${name}`,
    );
  };

  // ===================================================
  // NEW FOLDER
  // ===================================================

  const handleNewFolder = () => {
    const input =
      window.prompt(
        "New folder name:",
      );

    if (!input) {
      return;
    }

    const name =
      input.trim();

    if (!name) {
      return;
    }

    if (
      projectFolders.includes(
        name,
      )
    ) {
      return;
    }

    setProjectFolders(
      (current) => [
        ...current,
        name,
      ],
    );

    addConsole(
      `Created folder ${name}`,
    );
  };

  // ===================================================
  // SELECT FILE
  // ===================================================

  const handleSelectFile =
    (fileId: string) => {
      const exists =
        files.some(
          (file) =>
            file.id ===
            fileId,
        );

      if (!exists) {
        return;
      }

      setActiveFileId(
        fileId,
      );
    };

  // ===================================================
  // CLOSE TAB
  // ===================================================

  const handleCloseTab =
    (fileId: string) => {
      if (files.length <= 1) {
        return;
      }

      const index =
        files.findIndex(
          (file) =>
            file.id === fileId,
        );

      const remaining =
        files.filter(
          (file) =>
            file.id !== fileId,
        );

      setFiles(
        remaining,
      );

      if (
        fileId ===
        activeFileId
      ) {
        const next =
          remaining[
            Math.max(
              0,
              index - 1,
            )
          ];

        if (next) {
          setActiveFileId(
            next.id,
          );
        }
      }
    };

  // ===================================================
  // RUN
  // ===================================================

  const handleRun = () => {
    if (!activeFile) {
      return;
    }

    setRunMode(true);
    setRunStatus("running");

    const result =
      createRunOutput(
        activeFile,
      );

    setTimeout(() => {
      setRunOutput(
        result.output,
      );

      setRunStatus(
        result.success
          ? "success"
          : "error",
      );

      addConsole(
        result.message,
      );
    }, 250);
  };

  // ===================================================
  // ADD CONSOLE
  // ===================================================

  const addConsole =
    (message: string) => {
      setConsoleLines(
        (current) => [
          ...current,
          `[${new Date().toLocaleTimeString()}] ${message}`,
        ],
      );
    };

  // ===================================================
  // SEARCH
  // ===================================================

  const searchResults =
    useMemo(() => {
      if (!searchText.trim()) {
        return [];
      }

      const query =
        searchText.toLowerCase();

      return files.flatMap(
        (file) =>
          file.content
            .split("\n")
            .map(
              (
                line,
                index,
              ) => ({
                file,
                line,
                lineNumber:
                  index + 1,
              }),
            )
            .filter(
              (item) =>
                item.line
                  .toLowerCase()
                  .includes(query),
            ),
      );
    }, [
      files,
      searchText,
    ]);

  // ===================================================
  // KEYBOARD SHORTCUTS
  // ===================================================

  useEffect(() => {
    const handleKey =
      (event: KeyboardEvent) => {
        if (
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() ===
            "s"
        ) {
          event.preventDefault();
          handleSave();
        }

        if (
          event.key === "F5"
        ) {
          event.preventDefault();
          handleRun();
        }

        if (
          event.key === "Escape" &&
          runMode
        ) {
          setRunMode(false);
        }
      };

    window.addEventListener(
      "keydown",
      handleKey,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey,
      );
  });

  // ===================================================
  // RUN FULL PAGE
  // ===================================================

  if (runMode) {
    return (
      <div className="wt-full-run-page">

        <header className="wt-run-topbar">
          <div className="wt-run-title">
            <span className="wt-run-logo">
              ▶
            </span>

            <strong>
              {activeFile?.name ??
                "Preview"}
            </strong>

            <span
              className={`wt-run-status ${runStatus}`}
            >
              {runStatus.toUpperCase()}
            </span>
          </div>

          <div className="wt-run-actions">
            <button
              type="button"
              onClick={() => {
                setRunMode(false);
                setRunStatus(
                  "idle",
                );
              }}
            >
              ← Back to Editor
            </button>

            <button
              type="button"
              onClick={handleRun}
            >
              ↻ Reload
            </button>
          </div>
        </header>

        <main className="wt-run-content">
          {activeFile?.language ===
          "html" ? (
            <iframe
              title="HTML Preview"
              className="wt-preview-frame"
              srcDoc={
                activeFile.content
              }
              sandbox="allow-scripts"
            />
          ) : activeFile?.language ===
            "css" ? (
            <iframe
              title="CSS Preview"
              className="wt-preview-frame"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    ${activeFile.content}
                  </style>
                </head>
                <body>
                  <main class="preview-demo">
                    <h1>CSS Preview</h1>
                    <p>Your CSS is being previewed here.</p>
                    <button>Sample Button</button>
                    <div class="card">Sample Card</div>
                  </main>
                </body>
                </html>
              `}
              sandbox="allow-scripts"
            />
          ) : activeFile?.language ===
            "javascript" ? (
            <iframe
              title="JavaScript Preview"
              className="wt-preview-frame"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <body>
                  <h1>JavaScript Output</h1>
                  <pre id="output"></pre>

                  <script>
                    const originalLog = console.log;
                    console.log = function(...args) {
                      document.getElementById("output").textContent +=
                        args.join(" ") + "\\n";
                      originalLog(...args);
                    };

                    try {
                      ${activeFile.content}
                    } catch (error) {
                      document.getElementById("output").textContent =
                        String(error);
                    }
                  </script>
                </body>
                </html>
              `}
              sandbox="allow-scripts"
            />
          ) : (
            <div className="wt-language-output">
              <div className="wt-language-output-icon">
                ▶
              </div>

              <h2>
                {activeFile?.language
                  .toUpperCase()}{" "}
                Run
              </h2>

              <p>
                This browser workspace
                cannot directly execute{" "}
                {activeFile?.language}{" "}
                code.
              </p>

              <pre>
                {activeFile?.content}
              </pre>
            </div>
          )}
        </main>

        <footer className="wt-run-footer">
          <span>
            {activeFile?.name}
          </span>

          <span>
            {runStatus ===
            "success"
              ? "✓ Preview ready"
              : runStatus ===
                  "running"
                ? "Running..."
                : "Ready"}
          </span>
        </footer>
      </div>
    );
  }

  // ===================================================
  // NORMAL EDITOR
  // ===================================================

  return (
    <div className="wt-vscode">

      {/* =============================================
          TOP MENU
      ============================================= */}

      <header className="wt-top-menu">

        <div className="wt-brand">
          <span className="wt-brand-icon">
            D
          </span>

          <strong>
            DLTJ2.1
          </strong>
        </div>

        <nav className="wt-menu">
          <button type="button">
            File
          </button>

          <button type="button">
            Edit
          </button>

          <button type="button">
            Selection
          </button>

          <button type="button">
            View
          </button>

          <button type="button">
            Go
          </button>

          <button
            type="button"
            onClick={handleRun}
          >
            Run
          </button>

          <button type="button">
            Terminal
          </button>
        </nav>

        <div className="wt-top-right">
          <span>
            {technology.toUpperCase()}
          </span>

          <button
            type="button"
            className="wt-top-run"
            onClick={handleRun}
          >
            ▶ Run
          </button>
        </div>
      </header>

      {/* =============================================
          MAIN BODY
      ============================================= */}

      <div className="wt-body">

        {/* =========================================
            ACTIVITY BAR
        ========================================= */}

        <aside className="wt-activity-bar">

          <button
            type="button"
            className={
              sideView === "explorer"
                ? "active"
                : ""
            }
            title="Explorer"
            onClick={() =>
              setSideView(
                "explorer",
              )
            }
          >
            <span>📁</span>
          </button>

          <button
            type="button"
            className={
              sideView === "search"
                ? "active"
                : ""
            }
            title="Search"
            onClick={() =>
              setSideView(
                "search",
              )
            }
          >
            <span>🔎</span>
          </button>

          <button
            type="button"
            className={
              sideView === "source"
                ? "active"
                : ""
            }
            title="Source Control"
            onClick={() =>
              setSideView(
                "source",
              )
            }
          >
            <span>⎇</span>
          </button>

          <button
            type="button"
            className={
              sideView === "run"
                ? "active"
                : ""
            }
            title="Run"
            onClick={() => {
              setSideView(
                "run",
              );
              handleRun();
            }}
          >
            <span>▶</span>
          </button>

        </aside>

        {/* =========================================
            SIDE BAR
        ========================================= */}

        <aside className="wt-sidebar">

          {sideView ===
            "explorer" && (
            <ExplorerView
              technology={technology}
              files={files}
              folders={
                projectFolders
              }
              activeFileId={
                activeFileId
              }
              onSelectFile={
                handleSelectFile
              }
              onNewFile={
                handleNewFile
              }
              onNewFolder={
                handleNewFolder
              }
            />
          )}

          {sideView ===
            "search" && (
            <div className="wt-side-view">
              <div className="wt-side-title">
                SEARCH
              </div>

              <input
                className="wt-search-input"
                placeholder="Search files..."
                value={
                  searchText
                }
                onChange={(
                  event,
                ) =>
                  setSearchText(
                    event.target
                      .value,
                  )
                }
              />

              <div className="wt-search-results">
                {searchText &&
                  searchResults.map(
                    (
                      result,
                      index,
                    ) => (
                      <button
                        type="button"
                        key={`${result.file.id}-${result.lineNumber}-${index}`}
                        onClick={() =>
                          handleSelectFile(
                            result.file.id,
                          )
                        }
                      >
                        <strong>
                          {result.file.name}
                        </strong>

                        <span>
                          {result.lineNumber}:{" "}
                          {
                            result.line.trim()
                          }
                        </span>
                      </button>
                    ),
                  )}

                {searchText &&
                  searchResults.length ===
                    0 && (
                    <div className="wt-empty">
                      No results
                    </div>
                  )}
              </div>
            </div>
          )}

          {sideView ===
            "source" && (
            <div className="wt-side-view">
              <div className="wt-side-title">
                SOURCE CONTROL
              </div>

              <div className="wt-source-empty">
                <div>⎇</div>

                <strong>
                  Source Control
                </strong>

                <span>
                  Workspace changes
                  will appear here.
                </span>

                <span>
                  {files.filter(
                    (file) =>
                      file.modified,
                  ).length}{" "}
                  changed file(s)
                </span>
              </div>
            </div>
          )}

          {sideView ===
            "run" && (
            <div className="wt-side-view">
              <div className="wt-side-title">
                RUN AND DEBUG
              </div>

              <button
                type="button"
                className="wt-run-sidebar-button"
                onClick={handleRun}
              >
                ▶ Run Current File
              </button>

              <div className="wt-run-info">
                <span>
                  File
                </span>

                <strong>
                  {activeFile?.name}
                </strong>
              </div>
            </div>
          )}

        </aside>

        {/* =========================================
            EDITOR
        ========================================= */}

        <main className="wt-editor-area">

          <div className="wt-editor-tabs-row">

            <EditorTabs
              tabs={tabs}
              activeTabId={
                activeFileId
              }
              onSelect={
                handleSelectFile
              }
              onClose={
                handleCloseTab
              }
            />

          </div>

          <div className="wt-editor-toolbar">

            <div className="wt-breadcrumb">
              <span>
                {technology.toUpperCase()}
              </span>

              <span>
                /
              </span>

              <strong>
                {activeFile?.name}
              </strong>
            </div>

            <div className="wt-editor-actions">

              <button
                type="button"
                onClick={handleSave}
              >
                💾 Save
              </button>

              <button
                type="button"
                className="primary"
                onClick={handleRun}
              >
                ▶ Run
              </button>

            </div>

          </div>

          <div className="wt-code-area">

            {activeFile ? (
              <CodeEditor
                fileName={
                  activeFile.name
                }
                value={
                  activeFile.content
                }
                language={
                  activeFile.language
                }
                onChange={
                  handleEditorChange
                }
                onSave={
                  handleSave
                }
              />
            ) : (
              <div className="wt-empty-editor">
                No file open.
              </div>
            )}

          </div>

          {/* =======================================
              BOTTOM PANEL
          ======================================= */}

          {bottomPanel && (
            <section className="wt-bottom-panel">

              <div className="wt-bottom-panel-header">

                <div className="wt-bottom-tabs">

                  <button
                    type="button"
                    className={
                      bottomPanel ===
                      "problems"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setBottomPanel(
                        "problems",
                      )
                    }
                  >
                    PROBLEMS{" "}
                    <span>
                      0
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      bottomPanel ===
                      "output"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setBottomPanel(
                        "output",
                      )
                    }
                  >
                    OUTPUT
                  </button>

                  <button
                    type="button"
                    className={
                      bottomPanel ===
                      "debug"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setBottomPanel(
                        "debug",
                      )
                    }
                  >
                    DEBUG CONSOLE
                  </button>

                  <button
                    type="button"
                    className={
                      bottomPanel ===
                      "console"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setBottomPanel(
                        "console",
                      )
                    }
                  >
                    CONSOLE
                  </button>

                </div>

                <button
                  type="button"
                  className="wt-bottom-close"
                  onClick={() =>
                    setBottomPanel(
                      null,
                    )
                  }
                >
                  ×
                </button>

              </div>

              <div className="wt-bottom-content">

                {bottomPanel ===
                  "problems" && (
                  <div>
                    No problems
                    detected.
                  </div>
                )}

                {bottomPanel ===
                  "output" && (
                  <pre>
                    {runOutput ||
                      "No output yet."}
                  </pre>
                )}

                {bottomPanel ===
                  "debug" && (
                  <div>
                    Debug console
                    ready.
                  </div>
                )}

                {bottomPanel ===
                  "console" && (
                  <pre>
                    {consoleLines.join(
                      "\n",
                    ) ||
                      "Console is ready."}
                  </pre>
                )}

              </div>

            </section>
          )}

          {/* =======================================
              PANEL BAR
          ======================================= */}

          <div className="wt-panel-bar">

            <button
              type="button"
              className={
                bottomPanel ===
                "problems"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBottomPanel(
                  bottomPanel ===
                    "problems"
                    ? null
                    : "problems",
                )
              }
            >
              PROBLEMS
              <span>0</span>
            </button>

            <button
              type="button"
              className={
                bottomPanel ===
                "output"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBottomPanel(
                  bottomPanel ===
                    "output"
                    ? null
                    : "output",
                )
              }
            >
              OUTPUT
            </button>

            <button
              type="button"
              className={
                bottomPanel ===
                "debug"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBottomPanel(
                  bottomPanel ===
                    "debug"
                    ? null
                    : "debug",
                )
              }
            >
              DEBUG CONSOLE
            </button>

            <button
              type="button"
              className={
                bottomPanel ===
                "console"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBottomPanel(
                  bottomPanel ===
                    "console"
                    ? null
                    : "console",
                )
              }
            >
              CONSOLE
            </button>

          </div>

        </main>

      </div>

      {/* =============================================
          STATUS BAR
      ============================================= */}

      <footer className="wt-status-bar">

        <div className="wt-status-left">
          <span>
            Ln 1, Col 1
          </span>

          <span>
            Spaces: 2
          </span>

          <span>
            UTF-8
          </span>

          <span>
            LF
          </span>
        </div>

        <div className="wt-status-right">
          <span>
            {activeFile?.language?.toUpperCase() ??
              technology.toUpperCase()}
          </span>

          <span>
            {activeFile?.modified
              ? "● Unsaved"
              : "✓ Saved"}
          </span>

          <span>
            DLTJ2.1
          </span>
        </div>

      </footer>

    </div>
  );
}

// =====================================================
// EXPLORER
// =====================================================

interface ExplorerViewProps {
  technology: string;
  files: WorkingFile[];
  folders: string[];
  activeFileId: string;
  onSelectFile: (
    id: string,
  ) => void;
  onNewFile: () => void;
  onNewFolder: () => void;
}

function ExplorerView({
  technology,
  files,
  folders,
  activeFileId,
  onSelectFile,
  onNewFile,
  onNewFolder,
}: ExplorerViewProps) {
  return (
    <div className="wt-explorer">

      <div className="wt-explorer-heading">

        <strong>
          EXPLORER
        </strong>

        <div className="wt-explorer-actions">

          <button
            type="button"
            title="New File"
            onClick={onNewFile}
          >
            +
          </button>

          <button
            type="button"
            title="New Folder"
            onClick={
              onNewFolder
            }
          >
            📁+
          </button>

        </div>

      </div>

      <div className="wt-project-heading">
        <span>▾</span>

        <strong>
          {technology.toUpperCase()} PROJECT
        </strong>
      </div>

      <div className="wt-file-tree">

        {folders.map(
          (folder) => (
            <div
              className="wt-tree-folder"
              key={folder}
            >
              <span>
                ▾
              </span>

              <span>
                📁
              </span>

              <strong>
                {folder}
              </strong>
            </div>
          ),
        )}

        {files.map(
          (file) => (
            <button
              type="button"
              key={file.id}
              className={`wt-tree-file ${
                file.id ===
                activeFileId
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onSelectFile(
                  file.id,
                )
              }
            >
              <span>
                {getFileIcon(
                  file.name,
                )}
              </span>

              <span>
                {file.name}
              </span>

              {file.modified && (
                <span className="wt-file-dot">
                  ●
                </span>
              )}
            </button>
          ),
        )}

        {files.length ===
          0 && (
          <div className="wt-tree-empty">
            No files yet.
            <button
              type="button"
              onClick={onNewFile}
            >
              + Create File
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

// =====================================================
// FILE CREATION
// =====================================================

function createWorkingFile(
  name: string,
  technology: string,
): WorkingFile {
  const language =
    getLanguage(
      technology,
      name,
    );

  return {
    id:
      `file-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    name,
    path: name,
    content:
      getStarterContent(
        language,
        name,
      ),
    language,
    modified: true,
  };
}

function createInitialFile(
  technology: string,
): WorkingFile {
  const name =
    getDefaultFileName(
      technology,
    );

  const language =
    getLanguage(
      technology,
      name,
    );

  return {
    id:
      `file-${technology}`,
    name,
    path: name,
    content:
      getStarterContent(
        language,
        name,
      ),
    language,
    modified: false,
  };
}

// =====================================================
// LANGUAGE
// =====================================================

function getLanguage(
  technology: string,
  fileName: string,
): SupportedLanguage {
  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase();

  if (
    extension === "html" ||
    technology === "html"
  ) {
    return "html";
  }

  if (
    extension === "css" ||
    technology === "css"
  ) {
    return "css";
  }

  if (
    extension === "js" ||
    extension === "mjs" ||
    technology ===
      "javascript"
  ) {
    return "javascript";
  }

  if (
    extension === "ts" ||
    extension === "tsx" ||
    technology ===
      "typescript" ||
    technology === "react"
  ) {
    return "typescript";
  }

  if (
    extension === "py" ||
    technology === "python"
  ) {
    return "python";
  }

  if (
    extension === "java" ||
    technology === "java" ||
    technology === "spring"
  ) {
    return "java";
  }

  if (
    extension === "c" ||
    technology === "c"
  ) {
    return "c";
  }

  if (
    extension === "cpp" ||
    extension === "cc" ||
    extension === "cxx" ||
    technology === "cpp"
  ) {
    return "cpp";
  }

  if (
    extension === "sql" ||
    technology === "mysql"
  ) {
    return "sql";
  }

  return "html";
}

// =====================================================
// DEFAULT FILE
// =====================================================

function getDefaultFileName(
  technology: string,
): string {
  switch (
    technology.toLowerCase()
  ) {
    case "html":
      return "index.html";

    case "css":
      return "style.css";

    case "javascript":
      return "script.js";

    case "typescript":
      return "main.ts";

    case "python":
      return "main.py";

    case "java":
      return "Main.java";

    case "c":
      return "main.c";

    case "cpp":
      return "main.cpp";

    case "mysql":
      return "query.sql";

    case "react":
      return "App.tsx";

    case "spring":
      return "Application.java";

    default:
      return "main.txt";
  }
}

// =====================================================
// STARTER CONTENT
// =====================================================

function getStarterContent(
  language: SupportedLanguage,
  fileName: string,
): string {
  switch (language) {
    case "html":
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DLTJ2.1</title>
</head>
<body>
  <h1>Hello DLTJ2.1</h1>
  <p>Welcome to the Working Tool.</p>
</body>
</html>`;

    case "css":
      return `body {
  margin: 0;
  font-family: Arial, sans-serif;
  padding: 40px;
}

h1 {
  font-size: 32px;
}`;

    case "javascript":
      return `console.log("Hello DLTJ2.1");`;

    case "typescript":
      return `const message: string = "Hello DLTJ2.1";

console.log(message);`;

    case "python":
      return `print("Hello DLTJ2.1")`;

    case "java":
      return `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello DLTJ2.1");
  }
}`;

    case "c":
      return `#include <stdio.h>

int main(void) {
  printf("Hello DLTJ2.1\\n");
  return 0;
}`;

    case "cpp":
      return `#include <iostream>

int main() {
  std::cout << "Hello DLTJ2.1";
  return 0;
}`;

    case "sql":
      return `SELECT 'Hello DLTJ2.1' AS message;`;

    default:
      return `// ${fileName}

Hello DLTJ2.1`;
  }
}

// =====================================================
// RUN OUTPUT
// =====================================================

function createRunOutput(
  file: WorkingFile,
): {
  success: boolean;
  output: string;
  message: string;
} {
  switch (file.language) {
    case "html":
      return {
        success: true,
        output: file.content,
        message:
          `${file.name} preview started.`,
      };

    case "css":
      return {
        success: true,
        output: file.content,
        message:
          `${file.name} CSS preview started.`,
      };

    case "javascript":
      return {
        success: true,
        output:
          "JavaScript preview started.",
        message:
          `${file.name} running.`,
      };

    default:
      return {
        success: true,
        output: file.content,
        message:
          `${file.name} opened in run view.`,
      };
  }
}

// =====================================================
// ICON
// =====================================================

function getFileIcon(
  name: string,
): string {
  const extension =
    name
      .split(".")
      .pop()
      ?.toLowerCase();

  switch (extension) {
    case "html":
      return "🌐";

    case "css":
      return "🎨";

    case "js":
      return "🟨";

    case "ts":
    case "tsx":
      return "🔷";

    case "py":
      return "🐍";

    case "java":
      return "☕";

    case "c":
      return "©";

    case "cpp":
      return "⚙";

    case "sql":
      return "🗄";

    case "json":
      return "🧩";

    case "md":
      return "📝";

    default:
      return "📄";
  }
}