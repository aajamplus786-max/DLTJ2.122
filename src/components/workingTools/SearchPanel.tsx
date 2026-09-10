// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/components/workingTools/SearchPanel.tsx
// =====================================================

import { useMemo, useState } from "react";

interface SearchPanelProps {
  value: string;
  onClose?: () => void;
  onReplace?: (
    search: string,
    replacement: string,
  ) => void;
}

interface SearchMatch {
  line: number;
  column: number;
  text: string;
}

export default function SearchPanel({
  value,
  onClose,
  onReplace,
}: SearchPanelProps) {
  const [search, setSearch] = useState("");
  const [replacement, setReplacement] =
    useState("");

  const [caseSensitive, setCaseSensitive] =
    useState(false);

  const matches = useMemo<SearchMatch[]>(() => {
    if (!search) {
      return [];
    }

    const lines = value.split("\n");
    const result: SearchMatch[] = [];

    lines.forEach((line, lineIndex) => {
      const source = caseSensitive
        ? line
        : line.toLowerCase();

      const target = caseSensitive
        ? search
        : search.toLowerCase();

      let position = 0;

      while (position < source.length) {
        const index = source.indexOf(
          target,
          position,
        );

        if (index === -1) {
          break;
        }

        result.push({
          line: lineIndex + 1,
          column: index + 1,
          text: line.trim(),
        });

        position = index + Math.max(target.length, 1);
      }
    });

    return result;
  }, [caseSensitive, search, value]);

  return (
    <div className="working-search-panel">
      <div className="working-search-header">
        <span>Search</span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
        >
          ×
        </button>
      </div>

      <div className="working-search-fields">
        <input
          type="text"
          placeholder="Find"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          autoFocus
        />

        <input
          type="text"
          placeholder="Replace"
          value={replacement}
          onChange={(event) =>
            setReplacement(event.target.value)
          }
        />

        <label>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(event) =>
              setCaseSensitive(
                event.target.checked,
              )
            }
          />
          Case sensitive
        </label>

        <button
          type="button"
          disabled={
            !search || !onReplace
          }
          onClick={() =>
            onReplace?.(
              search,
              replacement,
            )
          }
        >
          Replace All
        </button>
      </div>

      <div className="working-search-results">
        {search && (
          <div className="working-search-count">
            {matches.length} match
            {matches.length === 1 ? "" : "es"}
          </div>
        )}

        {matches.map((match, index) => (
          <div
            key={`${match.line}-${match.column}-${index}`}
            className="working-search-result"
          >
            <span>
              {match.line}:{match.column}
            </span>

            <code>{match.text}</code>
          </div>
        ))}

        {search && matches.length === 0 && (
          <div className="working-search-empty">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
}