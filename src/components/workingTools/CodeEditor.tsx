// =====================================================
// DLTJ2.1
// WORKING TOOL — CODE EDITOR
// FILE: src/components/workingTools/CodeEditor.tsx
// DATE: 2026-09-01
// =====================================================

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SupportedLanguage } from "../../services/language/languageService";

interface CodeEditorProps {
  fileName: string;
  value: string;
  language: SupportedLanguage;
  onChange: (value: string) => void;
  onSave?: () => void;
}

export default function CodeEditor({
  fileName,
  value,
  language,
  onChange,
  onSave,
}: CodeEditorProps) {
  const editorRef =
    useRef<HTMLTextAreaElement | null>(null);

  const lineNumberRef =
    useRef<HTMLDivElement | null>(null);

  const [cursorLine, setCursorLine] =
    useState(1);

  const [cursorColumn, setCursorColumn] =
    useState(1);

  const lines = useMemo(
    () => value.split("\n"),
    [value]
  );

  // ===================================================
  // CURSOR
  // ===================================================

  const updateCursorPosition = () => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const position = editor.selectionStart;

    const beforeCursor =
      value.slice(0, position);

    const lineParts =
      beforeCursor.split("\n");

    setCursorLine(lineParts.length);

    setCursorColumn(
      lineParts[lineParts.length - 1].length + 1
    );
  };

  // ===================================================
  // SCROLL
  // ===================================================

  const handleScroll = () => {
    const editor = editorRef.current;
    const lineNumbers = lineNumberRef.current;

    if (!editor || !lineNumbers) {
      return;
    }

    lineNumbers.scrollTop =
      editor.scrollTop;
  };

  // ===================================================
  // CHANGE
  // ===================================================

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange(event.target.value);

    requestAnimationFrame(
      updateCursorPosition
    );
  };

  // ===================================================
  // KEYBOARD
  // ===================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // -----------------------------------------------
    // SAVE
    // -----------------------------------------------

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      onSave?.();
      return;
    }

    // -----------------------------------------------
    // TAB
    // -----------------------------------------------

    if (event.key === "Tab") {
      event.preventDefault();

      const editor = editorRef.current;

      if (!editor) {
        return;
      }

      const start =
        editor.selectionStart;

      const end =
        editor.selectionEnd;

      const newValue =
        value.substring(0, start) +
        "  " +
        value.substring(end);

      onChange(newValue);

      requestAnimationFrame(() => {
        editor.focus();

        editor.selectionStart =
          start + 2;

        editor.selectionEnd =
          start + 2;

        updateCursorPosition();
      });

      return;
    }

    // -----------------------------------------------
    // ENTER
    // -----------------------------------------------

    if (event.key === "Enter") {
      requestAnimationFrame(() => {
        updateCursorPosition();
      });
    }
  };

  // ===================================================
  // INITIAL POSITION
  // ===================================================

  useEffect(() => {
    updateCursorPosition();
  }, [value]);

  // ===================================================
  // LANGUAGE
  // ===================================================

  const languageLabel =
    getLanguageLabel(language);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section className="wt-code-editor">

      {/* =================================================
          EDITOR TOOLBAR
      ================================================= */}

      <div className="wt-code-editor-toolbar">

        <div className="wt-code-editor-file">

          <span className="wt-code-editor-file-icon">
            {getFileIcon(fileName)}
          </span>

          <strong>
            {fileName}
          </strong>

        </div>

        <div className="wt-code-editor-tools">

          <span className="wt-code-language">
            {languageLabel}
          </span>

          <button
            type="button"
            onClick={onSave}
            title="Save (Ctrl+S)"
            className="wt-code-save-button"
          >
            Save
          </button>

        </div>

      </div>

      {/* =================================================
          EDITOR BODY
      ================================================= */}

      <div className="wt-code-editor-body">

        {/* =================================================
            ONLY ONE LINE NUMBER COLUMN
        ================================================= */}

        <div
          ref={lineNumberRef}
          className="wt-code-line-numbers"
          aria-hidden="true"
        >
          {lines.map((_, index) => (
            <div
              key={`line-${index + 1}`}
              className={
                index + 1 === cursorLine
                  ? "active"
                  : ""
              }
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* =================================================
            CODE INPUT
        ================================================= */}

        <div className="wt-code-input-wrapper">

          <textarea
            ref={editorRef}
            className="wt-code-input"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onSelect={updateCursorPosition}
            onScroll={handleScroll}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            wrap="off"
            aria-label={`${fileName} code editor`}
          />

        </div>

      </div>

      {/* =================================================
          STATUS BAR
      ================================================= */}

      <div className="wt-code-editor-status">

        <div className="wt-code-status-left">

          <span>
            Ln {cursorLine}, Col {cursorColumn}
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

        <div className="wt-code-status-right">

          <span>
            {languageLabel}
          </span>

          <span>
            Editable
          </span>

        </div>

      </div>

    </section>
  );
}

// =====================================================
// FILE ICON
// =====================================================

function getFileIcon(
  fileName: string
): string {
  const extension =
    fileName
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
      return "🔷";

    case "tsx":
      return "⚛";

    case "jsx":
      return "⚛";

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

// =====================================================
// LANGUAGE LABEL
// =====================================================

function getLanguageLabel(
  language: SupportedLanguage
): string {
  switch (language) {
    case "html":
      return "HTML";

    case "css":
      return "CSS";

    case "javascript":
      return "JavaScript";

    case "typescript":
      return "TypeScript";

    case "python":
      return "Python";

    case "java":
      return "Java";

    case "c":
      return "C";

    case "cpp":
      return "C++";

    case "sql":
      return "SQL";

    default:
      return "Plain Text";
  }
}