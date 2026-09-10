// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 12
// FILE: src/components/workingTools/project/ProjectSettings.tsx
// DATE: 2026-08-31
// =====================================================

import { useState } from "react";

export interface ProjectSettingsValue {
  autoSave: boolean;
  formatOnSave: boolean;
  confirmDelete: boolean;
  defaultRunLanguage: string;
}

interface Props {
  value?: ProjectSettingsValue;
  onChange?: (value: ProjectSettingsValue) => void;
}

const defaultSettings: ProjectSettingsValue = {
  autoSave: true,
  formatOnSave: true,
  confirmDelete: true,
  defaultRunLanguage: "javascript",
};

export default function ProjectSettings({
  value = defaultSettings,
  onChange,
}: Props) {
  const [settings, setSettings] = useState(value);

  function update<K extends keyof ProjectSettingsValue>(
    key: K,
    value: ProjectSettingsValue[K],
  ) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    onChange?.(next);
  }

  return (
    <section className="wt-project-panel">
      <h3>Project Settings</h3>

      <label>
        <input
          type="checkbox"
          checked={settings.autoSave}
          onChange={(e) =>
            update("autoSave", e.target.checked)
          }
        />
        Auto Save
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.formatOnSave}
          onChange={(e) =>
            update("formatOnSave", e.target.checked)
          }
        />
        Format On Save
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.confirmDelete}
          onChange={(e) =>
            update("confirmDelete", e.target.checked)
          }
        />
        Confirm Delete
      </label>

      <label>
        Default Run Language
        <select
          value={settings.defaultRunLanguage}
          onChange={(e) =>
            update("defaultRunLanguage", e.target.value)
          }
        >
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="react">React</option>
        </select>
      </label>
    </section>
  );
}