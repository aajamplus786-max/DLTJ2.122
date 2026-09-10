// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 15
// FILE: src/components/workingTools/deployment/DeploymentSettings.tsx
// DATE: 2026-08-31
// =====================================================

import type {
  DeploymentConfig,
  DeploymentEnvironment,
  DeploymentProvider,
} from "../../../services/deploymentService";

// =====================================================
// PROPS
// =====================================================

interface DeploymentSettingsProps {
  value: DeploymentConfig;
  onChange: (value: DeploymentConfig) => void;
  disabled?: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export default function DeploymentSettings({
  value,
  onChange,
  disabled = false,
}: DeploymentSettingsProps) {
  // ===================================================
  // UPDATE FIELD
  // ===================================================

  function updateField<K extends keyof DeploymentConfig>(
    field: K,
    fieldValue: DeploymentConfig[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="deployment-settings">
      <div className="deployment-settings__header">
        <h3>Deployment Settings</h3>

        <p>
          Configure how this project should be built
          and deployed.
        </p>
      </div>

      {/* =================================================
          PROJECT
      ================================================= */}

      <div className="deployment-settings__section">
        <h4>Project</h4>

        <div className="deployment-settings__grid">
          <label>
            <span>Project Name</span>

            <input
              type="text"
              value={value.projectName}
              onChange={(event) =>
                updateField(
                  "projectName",
                  event.target.value,
                )
              }
              placeholder="My Project"
              disabled={disabled}
            />
          </label>

          <label>
            <span>Technology</span>

            <input
              type="text"
              value={value.technologyId}
              onChange={(event) =>
                updateField(
                  "technologyId",
                  event.target.value,
                )
              }
              placeholder="react"
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      {/* =================================================
          ENVIRONMENT
      ================================================= */}

      <div className="deployment-settings__section">
        <h4>Environment</h4>

        <label>
          <span>Deployment Environment</span>

          <select
            value={value.environment}
            onChange={(event) =>
              updateField(
                "environment",
                event.target
                  .value as DeploymentEnvironment,
              )
            }
            disabled={disabled}
          >
            <option value="development">
              Development
            </option>

            <option value="preview">
              Preview
            </option>

            <option value="production">
              Production
            </option>
          </select>
        </label>
      </div>

      {/* =================================================
          BUILD
      ================================================= */}

      <div className="deployment-settings__section">
        <h4>Build Configuration</h4>

        <div className="deployment-settings__grid">
          <label>
            <span>Install Command</span>

            <input
              type="text"
              value={value.installCommand}
              onChange={(event) =>
                updateField(
                  "installCommand",
                  event.target.value,
                )
              }
              placeholder="npm install"
              disabled={disabled}
            />
          </label>

          <label>
            <span>Build Command</span>

            <input
              type="text"
              value={value.buildCommand}
              onChange={(event) =>
                updateField(
                  "buildCommand",
                  event.target.value,
                )
              }
              placeholder="npm run build"
              disabled={disabled}
            />
          </label>

          <label>
            <span>Start Command</span>

            <input
              type="text"
              value={value.startCommand}
              onChange={(event) =>
                updateField(
                  "startCommand",
                  event.target.value,
                )
              }
              placeholder="Optional"
              disabled={disabled}
            />
          </label>

          <label>
            <span>Output Directory</span>

            <input
              type="text"
              value={value.outputDirectory}
              onChange={(event) =>
                updateField(
                  "outputDirectory",
                  event.target.value,
                )
              }
              placeholder="dist"
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      {/* =================================================
          PROVIDER
      ================================================= */}

      <div className="deployment-settings__section">
        <h4>Deployment Provider</h4>

        <label>
          <span>Provider</span>

          <select
            value={value.provider}
            onChange={(event) =>
              updateField(
                "provider",
                event.target
                  .value as DeploymentProvider,
              )
            }
            disabled={disabled}
          >
            <option value="local">
              Local
            </option>

            <option value="netlify">
              Netlify
            </option>

            <option value="render">
              Render
            </option>
          </select>
        </label>
      </div>

      {/* =================================================
          AUTO DEPLOY
      ================================================= */}

      <div className="deployment-settings__section">
        <label className="deployment-settings__checkbox">
          <input
            type="checkbox"
            checked={value.autoDeploy}
            onChange={(event) =>
              updateField(
                "autoDeploy",
                event.target.checked,
              )
            }
            disabled={disabled}
          />

          <span>
            Enable automatic deployment
          </span>
        </label>
      </div>

      {/* =================================================
          PROJECT ID
      ================================================= */}

      <div className="deployment-settings__project-id">
        <span>Project ID</span>

        <code>
          {value.projectId}
        </code>
      </div>
    </div>
  );
}