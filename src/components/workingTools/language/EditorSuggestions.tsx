// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/components/workingTools/language/EditorSuggestions.tsx
// =====================================================

import type { CompletionItem } from "../../../services/language/completionService";

interface EditorSuggestionsProps {
  items: CompletionItem[];
  selectedIndex: number;
  onSelect: (item: CompletionItem) => void;
}

export default function EditorSuggestions({
  items,
  selectedIndex,
  onSelect,
}: EditorSuggestionsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="working-editor-suggestions">
      {items.map((item, index) => (
        <button
          key={`${item.label}-${index}`}
          type="button"
          className={`working-editor-suggestion ${
            index === selectedIndex
              ? "working-editor-suggestion-active"
              : ""
          }`}
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(item);
          }}
        >
          <span className="working-editor-suggestion-kind">
            {item.kind === "function"
              ? "ƒ"
              : item.kind === "keyword"
                ? "K"
                : item.kind === "property"
                  ? "P"
                  : item.kind === "tag"
                    ? "T"
                    : "S"}
          </span>

          <span className="working-editor-suggestion-main">
            <span>{item.label}</span>

            {item.detail && (
              <small>{item.detail}</small>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}