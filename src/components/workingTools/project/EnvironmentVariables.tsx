// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: src/components/workingTools/project/EnvironmentVariables.tsx
// DATE: 2026-08-31
// =====================================================

import { useState } from "react";

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  secret: boolean;
}

interface Props {
  variables?: EnvironmentVariable[];
  onChange?: (variables: EnvironmentVariable[]) => void;
}

export default function EnvironmentVariables({
  variables = [],
  onChange,
}: Props) {
  const [items, setItems] = useState(variables);

  function update(next: EnvironmentVariable[]) {
    setItems(next);
    onChange?.(next);
  }

  function addVariable() {
    update([
      ...items,
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        secret: false,
      },
    ]);
  }

  function removeVariable(id: string) {
    update(items.filter((item) => item.id !== id));
  }

  return (
    <section className="wt-project-panel">
      <div className="wt-panel-title">
        <h3>Environment Variables</h3>

        <button type="button" onClick={addVariable}>
          + Add
        </button>
      </div>

      {items.map((item) => (
        <div className="wt-env-row" key={item.id}>
          <input
            placeholder="KEY"
            value={item.key}
            onChange={(e) =>
              update(
                items.map((x) =>
                  x.id === item.id
                    ? { ...x, key: e.target.value }
                    : x,
                ),
              )
            }
          />

          <input
            placeholder="VALUE"
            type={item.secret ? "password" : "text"}
            value={item.value}
            onChange={(e) =>
              update(
                items.map((x) =>
                  x.id === item.id
                    ? { ...x, value: e.target.value }
                    : x,
                ),
              )
            }
          />

          <label>
            <input
              type="checkbox"
              checked={item.secret}
              onChange={(e) =>
                update(
                  items.map((x) =>
                    x.id === item.id
                      ? { ...x, secret: e.target.checked }
                      : x,
                  ),
                )
              }
            />
            Secret
          </label>

          <button
            type="button"
            onClick={() => removeVariable(item.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
}