// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 15
// FILE: src/components/workingTools/deployment/PWASettings.tsx
// DATE: 2026-08-31
// =====================================================

import {
  useState,
} from "react";

// =====================================================
// TYPES
// =====================================================

export interface PWASettingsValue {
  enabled: boolean;
  appName: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: "standalone" | "fullscreen" | "minimal-ui";
  themeColor: string;
  backgroundColor: string;
}

// =====================================================
// PROPS
// =====================================================

interface PWASettingsProps {
  value?: PWASettingsValue;
  onChange?: (
    value: PWASettingsValue,
  ) => void;
}

// =====================================================
// DEFAULT
// =====================================================

const DEFAULT_VALUE: PWASettingsValue = {
  enabled: true,
  appName: "DLTJ2.1 App",
  shortName: "DLTJ2.1",
  description:
    "A project created with DLTJ2.1.",
  startUrl: "/",
  display: "standalone",
  themeColor: "#111827",
  backgroundColor: "#ffffff",
};

// =====================================================
// COMPONENT
// =====================================================

export default function PWASettings({
  value,
  onChange,
}: PWASettingsProps) {
  const [internalValue, setInternalValue] =
    useState<PWASettingsValue>(
      value ?? DEFAULT_VALUE,
    );

  const settings =
    value ?? internalValue;

  function update(
    changes: Partial<PWASettingsValue>,
  ) {
    const next = {
      ...settings,
      ...changes,
    };

    setInternalValue(next);
    onChange?.(next);
  }

  return (
    <section className="pwa-settings">
      <div className="pwa-settings__header">
        <h3>PWA Settings</h3>
        <p>
          Configure installable app behaviour.
        </p>
      </div>

      <label>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(event) =>
            update({
              enabled:
                event.target.checked,
            })
          }
        />

        Enable PWA
      </label>

      <label>
        App Name

        <input
          type="text"
          value={settings.appName}
          onChange={(event) =>
            update({
              appName:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        Short Name

        <input
          type="text"
          value={settings.shortName}
          onChange={(event) =>
            update({
              shortName:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        Description

        <textarea
          value={settings.description}
          onChange={(event) =>
            update({
              description:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        Start URL

        <input
          type="text"
          value={settings.startUrl}
          onChange={(event) =>
            update({
              startUrl:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        Display Mode

        <select
          value={settings.display}
          onChange={(event) =>
            update({
              display:
                event.target
                  .value as PWASettingsValue["display"],
            })
          }
        >
          <option value="standalone">
            Standalone
          </option>

          <option value="fullscreen">
            Fullscreen
          </option>

          <option value="minimal-ui">
            Minimal UI
          </option>
        </select>
      </label>

      <label>
        Theme Color

        <input
          type="text"
          value={settings.themeColor}
          onChange={(event) =>
            update({
              themeColor:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        Background Color

        <input
          type="text"
          value={settings.backgroundColor}
          onChange={(event) =>
            update({
              backgroundColor:
                event.target.value,
            })
          }
        />
      </label>
    </section>
  );
}