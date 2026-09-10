// =====================================================
// DLTJ2.1
// WORKING TOOL — UNIVERSAL REAL-TIME DEVELOPMENT WORKSPACE
// FILE: src/pages/WorkingTools/WorkingToolsHome.tsx
// DATE: 2026-09-01
// =====================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import "../../styles/working-tools.css";

import CodeEditor from "../../components/workingTools/CodeEditor";
import EditorTabs from "../../components/workingTools/EditorTabs";

import type {
  EditorTabItem,
} from "../../components/workingTools/EditorTabs";

import type {
  SupportedLanguage,
} from "../../services/language/languageService";

import useToolWorkspace from "../../hooks/useToolWorkspace";
import useFileManager from "../../hooks/useFileManager";

import type {
  WorkspaceFile,
} from "../../types/WorkspaceFile";

import type {
  WorkspaceFolder,
} from "../../types/WorkspaceFolder";

// =====================================================
// TYPES
// =====================================================

type SideView =
  | "explorer"
  | "search"
  | "source"
  | "run";

type BottomPanel =
  | "problems"
  | "output"
  | "terminal"
  | "console"
  | null;

interface TreeProps {
  folders: WorkspaceFolder[];
  files: WorkspaceFile[];
  parentId: string | null;
  activeFileId: string | null;
  onOpenFile: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

// =====================================================
// MAIN
// =====================================================

export default function WorkingToolsHome() {
  const {
    technologyId,
  } = useParams<{
    technologyId?: string;
  }>();

  const technology =
    technologyId?.toLowerCase() ||
    "html";

  // ===================================================
  // UNIVERSAL WORKSPACE
  // ===================================================

  const workspaceApi =
    useToolWorkspace(technology);

  const {
    workspace,
    files,
    folders,
    openFiles,
    activeFile,
    activeFileId,
    isDirty,

    openFile,
    closeFile,

    createFile,
    createFolder,

    updateFile,
    renameItem,
    deleteItem,
    duplicateFile,

    saveWorkspace,
  } = workspaceApi;

  const fileManager =
    useFileManager(
      workspace.items,
    );

  // ===================================================
  // UI
  // ===================================================

  const [sideView, setSideView] =
    useState<SideView>(
      "explorer",
    );

  const [bottomPanel, setBottomPanel] =
    useState<BottomPanel>(null);

  const [searchText, setSearchText] =
    useState("");

  const [runMode, setRunMode] =
    useState(false);

  const [runStatus, setRunStatus] =
    useState<
      "idle" |
      "running" |
      "success" |
      "error"
    >("idle");

  const [runOutput, setRunOutput] =
    useState("");

  const [consoleLines, setConsoleLines] =
    useState<string[]>([]);

  // ===================================================
  // OPEN TABS
  // ===================================================

  const tabs =
    useMemo<EditorTabItem[]>(
      () =>
        openFiles.map(
          (file) => ({
            id: file.id,
            name: file.name,
            path:
              file.path ||
              fileManager.getPath(
                file.id,
              ),
            language:
              toSupportedLanguage(
                file.language,
                file.name,
              ),
            modified:
              file.isDirty,
          }),
        ),
      [
        openFiles,
        fileManager,
      ],
    );

  // ===================================================
  // CONSOLE
  // ===================================================

  const addConsole = (
    message: string,
  ) => {
    setConsoleLines(
      (current) => [
        ...current,
        `[${new Date().toLocaleTimeString()}] ${message}`,
      ],
    );
  };

  // ===================================================
  // OPEN FIRST FILE
  // ===================================================

  useEffect(() => {
    if (
      !activeFile &&
      files.length > 0
    ) {
      openFile(files[0].id);
    }
  }, [
    activeFile,
    files,
    openFile,
  ]);

  // ===================================================
  // SAVE
  // ===================================================

  const handleSave = () => {
    const success =
      saveWorkspace();

    if (success) {
      addConsole(
        "Workspace saved successfully.",
      );
    }
  };

  // ===================================================
  // NEW FILE
  // ===================================================

  const handleNewFile = (
    parentId: string | null = null,
  ) => {
    const name =
      window.prompt(
        "New file name:",
        getSuggestedFileName(
          technology,
        ),
      );

    if (!name?.trim()) {
      return;
    }

    const cleanName =
      name.trim();

    const exists =
      files.some(
        (file) =>
          file.parentId ===
            parentId &&
          file.name.toLowerCase() ===
            cleanName.toLowerCase(),
      );

    if (exists) {
      window.alert(
        "A file with this name already exists.",
      );
      return;
    }

    const file =
      createFile(
        cleanName,
        parentId,
        getStarterContent(
          cleanName,
          technology,
        ),
      );

    addConsole(
      `Created ${getPathAfterCreate(
        file,
        parentId,
        folders,
      )}`,
    );
  };

  // ===================================================
  // NEW FOLDER
  // ===================================================

  const handleNewFolder = (
    parentId: string | null = null,
  ) => {
    const name =
      window.prompt(
        "New folder name:",
      );

    if (!name?.trim()) {
      return;
    }

    const cleanName =
      name.trim();

    const exists =
      folders.some(
        (folder) =>
          folder.parentId ===
            parentId &&
          folder.name.toLowerCase() ===
            cleanName.toLowerCase(),
      );

    if (exists) {
      window.alert(
        "A folder with this name already exists.",
      );
      return;
    }

    createFolder(
      cleanName,
      parentId,
    );

    addConsole(
      `Created folder ${cleanName}`,
    );
  };

  // ===================================================
  // SELECT FILE
  // ===================================================

  const handleSelectFile = (
    fileId: string,
  ) => {
    openFile(fileId);
  };

  // ===================================================
  // CLOSE TAB
  // ===================================================

  const handleCloseTab = (
    fileId: string,
  ) => {
    closeFile(fileId);
  };

  // ===================================================
  // EDITOR CHANGE
  // ===================================================

  const handleEditorChange = (
    value: string,
  ) => {
    if (!activeFile) {
      return;
    }

    updateFile(
      activeFile.id,
      value,
    );
  };

  // ===================================================
  // RENAME
  // ===================================================

  const handleRename = (
    id: string,
    currentName?: string,
  ) => {
    const item =
      fileManager.findItem(id);

    if (!item) {
      return;
    }

    const newName =
      window.prompt(
        "Rename:",
        currentName ||
          item.name,
      );

    if (!newName?.trim()) {
      return;
    }

    if (
      renameItem(
        id,
        newName.trim(),
      )
    ) {
      addConsole(
        `Renamed ${item.name} → ${newName.trim()}`,
      );
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = (
    id: string,
  ) => {
    const item =
      fileManager.findItem(id);

    if (!item) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${item.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    deleteItem(id);

    addConsole(
      `Deleted ${item.name}`,
    );
  };

  // ===================================================
  // DUPLICATE
  // ===================================================

  const handleDuplicate = (
    fileId: string,
  ) => {
    const duplicate =
      duplicateFile(fileId);

    if (duplicate) {
      addConsole(
        `Duplicated ${duplicate.name}`,
      );
    }
  };

  // ===================================================
  // RUN
  // ===================================================

  const handleRun = () => {
    if (!activeFile) {
      return;
    }

    setRunStatus("running");
    setRunMode(true);

    const language =
      toSupportedLanguage(
        activeFile.language,
        activeFile.name,
      );

    if (
      language === "html"
    ) {
      setRunOutput(
        activeFile.content,
      );

      setRunStatus(
        "success",
      );

      addConsole(
        `${activeFile.name} HTML preview started.`,
      );

      return;
    }

    if (
      language === "css"
    ) {
      setRunOutput(
        createCssPreview(
          activeFile.content,
        ),
      );

      setRunStatus(
        "success",
      );

      addConsole(
        `${activeFile.name} CSS preview started.`,
      );

      return;
    }

    if (
      language ===
      "javascript"
    ) {
      setRunOutput(
        createJavaScriptPreview(
          activeFile.content,
        ),
      );

      setRunStatus(
        "success",
      );

      addConsole(
        `${activeFile.name} JavaScript execution started.`,
      );

      return;
    }

    /*
     * Other languages are intentionally sent
     * through the workspace run boundary.
     *
     * The next backend execution layer will connect:
     *
     * Python
     * Java
     * C
     * C++
     * TypeScript
     * React / TSX
     * MySQL
     * Spring
     *
     * to the server runtime.
     */

    setRunOutput(
      [
        `File: ${activeFile.name}`,
        `Language: ${activeFile.language}`,
        "",
        "Execution request prepared.",
        "Backend runtime is required for this language.",
        "",
        activeFile.content,
      ].join("\n"),
    );

    setRunStatus(
      "success",
    );

    addConsole(
      `${activeFile.name} execution request prepared.`,
    );
  };

  // ===================================================
  // SEARCH
  // ===================================================

  const searchResults =
    useMemo(() => {
      const query =
        searchText
          .trim()
          .toLowerCase();

      if (!query) {
        return [];
      }

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
              (result) =>
                result.line
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
    const handler =
      (
        event: KeyboardEvent,
      ) => {
        if (
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          event.key.toLowerCase() ===
            "s"
        ) {
          event.preventDefault();
          handleSave();
        }

        if (
          event.key ===
          "F5"
        ) {
          event.preventDefault();
          handleRun();
        }

        if (
          event.key ===
            "Escape" &&
          runMode
        ) {
          setRunMode(false);
          setRunStatus(
            "idle",
          );
        }
      };

    window.addEventListener(
      "keydown",
      handler,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler,
      );
  });

  // ===================================================
  // RUN VIEW
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
              {activeFile?.name ||
                "Run"}
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
              ← Editor
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

          {activeFile &&
          toSupportedLanguage(
            activeFile.language,
            activeFile.name,
          ) === "html" ? (
            <iframe
              title="HTML Live Preview"
              className="wt-preview-frame"
              srcDoc={
                activeFile.content
              }
              sandbox="allow-scripts allow-forms"
            />
          ) : activeFile &&
            toSupportedLanguage(
              activeFile.language,
              activeFile.name,
            ) === "css" ? (
            <iframe
              title="CSS Live Preview"
              className="wt-preview-frame"
              srcDoc={
                createCssPreview(
                  activeFile.content,
                )
              }
              sandbox="allow-scripts"
            />
          ) : activeFile &&
            toSupportedLanguage(
              activeFile.language,
              activeFile.name,
            ) ===
              "javascript" ? (
            <iframe
              title="JavaScript Preview"
              className="wt-preview-frame"
              srcDoc={
                createJavaScriptPreview(
                  activeFile.content,
                )
              }
              sandbox="allow-scripts"
            />
          ) : (
            <div className="wt-language-output">

              <div className="wt-language-output-icon">
                ▶
              </div>

              <h2>
                {activeFile?.language?.toUpperCase() ||
                  "CODE"}{" "}
                RUN
              </h2>

              <p>
                Workspace execution request
                prepared for backend runtime.
              </p>

              <pre>
                {runOutput}
              </pre>

            </div>
          )}

        </main>

        <footer className="wt-run-footer">

          <span>
            {activeFile?.name ||
              "No file"}
          </span>

          <span>
            {runStatus ===
            "success"
              ? "✓ Ready"
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
  // EDITOR
  // ===================================================

  return (
    <div className="wt-vscode">

      {/* =================================================
          TOP MENU
      ================================================= */}

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

          <button
            type="button"
            onClick={() =>
              handleNewFile()
            }
          >
            File
          </button>

          <button
            type="button"
            onClick={
              handleSave
            }
          >
            Save
          </button>

          <button
            type="button"
            onClick={() =>
              setSideView(
                "search",
              )
            }
          >
            Search
          </button>

          <button
            type="button"
            onClick={() =>
              setSideView(
                "source",
              )
            }
          >
            Source
          </button>

          <button
            type="button"
            onClick={
              handleRun
            }
          >
            Run
          </button>

          <button
            type="button"
            onClick={() =>
              setBottomPanel(
                "terminal",
              )
            }
          >
            Terminal
          </button>

        </nav>

        <div className="wt-top-right">

          <span>
            UNIVERSAL WORKSPACE
          </span>

          <button
            type="button"
            className="wt-top-run"
            onClick={
              handleRun
            }
          >
            ▶ Run
          </button>

        </div>

      </header>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="wt-body">

        {/* =================================================
            ACTIVITY BAR
        ================================================= */}

        <aside className="wt-activity-bar">

          <button
            type="button"
            className={
              sideView ===
              "explorer"
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
            📁
          </button>

          <button
            type="button"
            className={
              sideView ===
              "search"
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
            🔎
          </button>

          <button
            type="button"
            className={
              sideView ===
              "source"
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
            ⎇
          </button>

          <button
            type="button"
            className={
              sideView ===
              "run"
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
            ▶
          </button>

        </aside>

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="wt-sidebar">

          {sideView ===
            "explorer" && (
            <div className="wt-explorer">

              <div className="wt-explorer-heading">

                <strong>
                  EXPLORER
                </strong>

                <div className="wt-explorer-actions">

                  <button
                    type="button"
                    title="New File"
                    onClick={() =>
                      handleNewFile()
                    }
                  >
                    +
                  </button>

                  <button
                    type="button"
                    title="New Folder"
                    onClick={() =>
                      handleNewFolder()
                    }
                  >
                    📁+
                  </button>

                </div>

              </div>

              <div className="wt-project-heading">

                <span>
                  ▾
                </span>

                <strong>
                  {workspace.name ||
                    "PROJECT"}
                </strong>

              </div>

              <div className="wt-file-tree">

                <WorkspaceTree
                  folders={
                    folders
                  }
                  files={
                    files
                  }
                  parentId={
                    null
                  }
                  activeFileId={
                    activeFileId
                  }
                  onOpenFile={
                    handleSelectFile
                  }
                  onRename={
                    handleRename
                  }
                  onDelete={
                    handleDelete
                  }
                />

                {files.length ===
                  0 &&
                  folders.length ===
                    0 && (
                    <div className="wt-tree-empty">

                      <span>
                        Empty workspace
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleNewFile()
                        }
                      >
                        + Create File
                      </button>

                    </div>
                  )}

              </div>

            </div>
          )}

          {sideView ===
            "search" && (
            <div className="wt-side-view">

              <div className="wt-side-title">
                SEARCH
              </div>

              <input
                className="wt-search-input"
                placeholder="Search in files..."
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

                {searchResults.map(
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
                        {
                          result
                            .file
                            .name
                        }
                      </strong>

                      <span>
                        {result.lineNumber}
                        :{" "}
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

                <div>
                  ⎇
                </div>

                <strong>
                  Workspace Changes
                </strong>

                <span>
                  {
                    files.filter(
                      (
                        file,
                      ) =>
                        file.isDirty,
                    ).length
                  }{" "}
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
                onClick={
                  handleRun
                }
              >
                ▶ Run Current File
              </button>

              <div className="wt-run-info">

                <span>
                  Current File
                </span>

                <strong>
                  {activeFile?.name ||
                    "No file"}
                </strong>

                <span>
                  Language
                </span>

                <strong>
                  {activeFile?.language ||
                    "Unknown"}
                </strong>

              </div>

            </div>
          )}

        </aside>

        {/* =================================================
            EDITOR AREA
        ================================================= */}

        <main className="wt-editor-area">

          <div className="wt-editor-tabs-row">

            <EditorTabs
              tabs={tabs}
              activeTabId={
                activeFileId ||
                ""
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
                PROJECT
              </span>

              <span>
                /
              </span>

              <strong>
                {activeFile
                  ? fileManager.getPath(
                      activeFile.id,
                    )
                  : "No file"}
              </strong>

            </div>

            <div className="wt-editor-actions">

              <button
                type="button"
                onClick={
                  handleSave
                }
              >
                💾 Save
              </button>

              {activeFile && (
                <button
                  type="button"
                  onClick={() =>
                    handleDuplicate(
                      activeFile.id,
                    )
                  }
                >
                  ⧉ Duplicate
                </button>
              )}

              {activeFile && (
                <button
                  type="button"
                  onClick={() =>
                    handleRename(
                      activeFile.id,
                    )
                  }
                >
                  ✏ Rename
                </button>
              )}

              <button
                type="button"
                className="primary"
                onClick={
                  handleRun
                }
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
                  toSupportedLanguage(
                    activeFile.language,
                    activeFile.name,
                  )
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

                <div>
                  📁
                </div>

                <h2>
                  No file open
                </h2>

                <p>
                  Create a file from
                  Explorer to start
                  developing.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleNewFile()
                  }
                >
                  + New File
                </button>

              </div>
            )}

          </div>

          {/* =================================================
              BOTTOM PANEL
          ================================================= */}

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
                      "terminal"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setBottomPanel(
                        "terminal",
                      )
                    }
                  >
                    TERMINAL
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
                  "terminal" && (
                  <div>

                    <div>
                      DLTJ2 Workspace
                      Terminal
                    </div>

                    <div>
                      Backend runtime
                      connection will
                      execute project
                      commands here.
                    </div>

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

          {/* =================================================
              PANEL BAR
          ================================================= */}

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
                "terminal"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBottomPanel(
                  bottomPanel ===
                    "terminal"
                    ? null
                    : "terminal",
                )
              }
            >
              TERMINAL
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

      {/* =================================================
          STATUS BAR
      ================================================= */}

      <footer className="wt-status-bar">

        <div className="wt-status-left">

          <span>
            {activeFile
              ? activeFile.name
              : "No file"}
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
            {activeFile?.language?.toUpperCase() ||
              technology.toUpperCase()}
          </span>

          <span>
            {isDirty
              ? "● Unsaved"
              : "✓ Saved"}
          </span>

          <span>
            {files.length} files
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
// WORKSPACE TREE
// =====================================================

function WorkspaceTree({
  folders,
  files,
  parentId,
  activeFileId,
  onOpenFile,
  onRename,
  onDelete,
}: TreeProps) {
  const childFolders =
    folders.filter(
      (folder) =>
        folder.parentId ===
        parentId,
    );

  const childFiles =
    files.filter(
      (file) =>
        file.parentId ===
        parentId,
    );

  return (
    <>
      {childFolders.map(
        (folder) => (
          <div
            key={folder.id}
            className="wt-tree-folder-group"
          >

            <div className="wt-tree-folder">

              <span>
                ▾
              </span>

              <span>
                📁
              </span>

              <strong>
                {folder.name}
              </strong>

              <button
                type="button"
                title="Rename"
                onClick={() =>
                  onRename(
                    folder.id,
                    folder.name,
                  )
                }
              >
                ✏
              </button>

              <button
                type="button"
                title="Delete"
                onClick={() =>
                  onDelete(
                    folder.id,
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="wt-tree-folder-children">

              <WorkspaceTree
                folders={
                  folders
                }
                files={
                  files
                }
                parentId={
                  folder.id
                }
                activeFileId={
                  activeFileId
                }
                onOpenFile={
                  onOpenFile
                }
                onRename={
                  onRename
                }
                onDelete={
                  onDelete
                }
              />

            </div>

          </div>
        ),
      )}

      {childFiles.map(
        (file) => (
          <div
            key={file.id}
            className={`wt-tree-file-row ${
              file.id ===
              activeFileId
                ? "active"
                : ""
            }`}
          >

            <button
              type="button"
              className="wt-tree-file"
              onClick={() =>
                onOpenFile(
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

              {file.isDirty && (
                <span className="wt-file-dot">
                  ●
                </span>
              )}

            </button>

            <button
              type="button"
              title="Rename"
              onClick={() =>
                onRename(
                  file.id,
                  file.name,
                )
              }
            >
              ✏
            </button>

            <button
              type="button"
              title="Delete"
              onClick={() =>
                onDelete(
                  file.id,
                )
              }
            >
              ×
            </button>

          </div>
        ),
      )}
    </>
  );
}

// =====================================================
// LANGUAGE
// =====================================================

function toSupportedLanguage(
  language: string,
  fileName: string,
): SupportedLanguage {
  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase();

  if (
    extension === "html" ||
    language === "html"
  ) {
    return "html";
  }

  if (
    extension === "css" ||
    language === "css"
  ) {
    return "css";
  }

  if (
    extension === "js" ||
    extension === "mjs" ||
    language === "javascript"
  ) {
    return "javascript";
  }

  if (
    extension === "ts" ||
    extension === "tsx" ||
    language === "typescript"
  ) {
    return "typescript";
  }

  if (
    extension === "py" ||
    language === "python"
  ) {
    return "python";
  }

  if (
    extension === "java" ||
    language === "java"
  ) {
    return "java";
  }

  if (
    extension === "c" ||
    language === "c"
  ) {
    return "c";
  }

  if (
    extension === "cpp" ||
    extension === "cc" ||
    extension === "cxx" ||
    language === "cpp"
  ) {
    return "cpp";
  }

  if (
    extension === "sql" ||
    language === "mysql" ||
    language === "sql"
  ) {
    return "sql";
  }

  return "html";
}

// =====================================================
// FILE ICON
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
    case "mjs":
      return "🟨";

    case "ts":
    case "tsx":
      return "🔷";

    case "jsx":
      return "⚛";

    case "py":
      return "🐍";

    case "java":
      return "☕";

    case "c":
      return "©";

    case "cpp":
    case "cc":
    case "cxx":
      return "⚙";

    case "sql":
      return "🗄";

    case "json":
      return "🧩";

    case "md":
      return "📝";

    case "xml":
      return "📰";

    case "yml":
    case "yaml":
      return "⚙";

    default:
      return "📄";
  }
}

// =====================================================
// SUGGESTED FILE
// =====================================================

function getSuggestedFileName(
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

    case "react":
      return "App.tsx";

    case "python":
      return "main.py";

    case "java":
      return "Main.java";

    case "spring":
      return "Application.java";

    case "c":
      return "main.c";

    case "cpp":
      return "main.cpp";

    case "mysql":
      return "query.sql";

    default:
      return "main.txt";
  }
}

// =====================================================
// STARTER CONTENT
// =====================================================

function getStarterContent(
  fileName: string,
  technology: string,
): string {
  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase();

  switch (extension) {
    case "html":
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DLTJ2 Workspace</title>
</head>
<body>
  <h1>Hello DLTJ2.1</h1>
  <p>Universal Development Workspace</p>
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

    case "js":
    case "mjs":
      return `console.log("Hello DLTJ2.1");`;

    case "ts":
      return `const message: string = "Hello DLTJ2.1";

console.log(message);`;

    case "tsx":
      return `import React from "react";

export default function App() {
  return (
    <main>
      <h1>Hello DLTJ2.1</h1>
    </main>
  );
}`;

    case "py":
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
    case "cc":
    case "cxx":
      return `#include <iostream>

int main() {
  std::cout << "Hello DLTJ2.1";
  return 0;
}`;

    case "sql":
      return `SELECT 'Hello DLTJ2.1' AS message;`;

    default:
      return `// ${technology}
//
// Universal Workspace File
`;

  }
}

// =====================================================
// CSS PREVIEW
// =====================================================

function createCssPreview(
  css: string,
): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${css}
</style>
</head>
<body>
  <h1>CSS Live Preview</h1>
  <p>Preview generated by DLTJ2.1 Working Tool.</p>
  <button>Sample Button</button>
  <div class="card">Sample Card</div>
</body>
</html>`;
}

// =====================================================
// JAVASCRIPT PREVIEW
// =====================================================

function createJavaScriptPreview(
  code: string,
): string {
  const safeCode =
    code.replace(
      /<\/script/gi,
      "<\\/script",
    );

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JavaScript Output</title>
</head>
<body>

<h2>JavaScript Output</h2>

<pre id="output"></pre>

<script>
const output =
  document.getElementById("output");

const originalLog =
  console.log;

console.log = function(...args) {
  output.textContent +=
    args.map(String).join(" ") +
    "\\n";

  originalLog(...args);
};

try {
${safeCode}
} catch (error) {
  output.textContent +=
    String(error);
}
<\/script>

</body>
</html>`;
}

// =====================================================
// PATH
// =====================================================

function getPathAfterCreate(
  file: WorkspaceFile,
  parentId: string | null,
  folders: WorkspaceFolder[],
): string {
  const parts = [
    file.name,
  ];

  let current =
    parentId;

  while (current) {
    const folder =
      folders.find(
        (item) =>
          item.id === current,
      );

    if (!folder) {
      break;
    }

    parts.unshift(
      folder.name,
    );

    current =
      folder.parentId;
  }

  return parts.join("/");
}