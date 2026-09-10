// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 15
// FILE: src/components/workingTools/deployment/DeploymentPanel.tsx
// DATE: 2026-08-31
// =====================================================

import {
  useCallback,
  useState,
} from "react";

import DeploymentSettings from "./DeploymentSettings";
import DeploymentStatus from "./DeploymentStatus";

import {
  deployProject,
  getDeploymentStatus,
} from "../../../services/deploymentService";

import type {
  DeploymentConfig,
  DeploymentResult,
  DeploymentStatusResponse,
} from "../../../services/deploymentService";

// =====================================================
// PROPS
// =====================================================

interface DeploymentPanelProps {
  projectId: string;
  technologyId?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function DeploymentPanel({
  projectId,
  technologyId = "unknown",
}: DeploymentPanelProps) {
  const [config, setConfig] =
    useState<DeploymentConfig>({
      projectId,
      technologyId,
      projectName: "",
      environment: "production",
      outputDirectory: "dist",
      buildCommand: "npm run build",
      startCommand: "",
      installCommand: "npm install",
      autoDeploy: false,
      provider: "local",
    });

  const [deployment, setDeployment] =
    useState<DeploymentResult | null>(null);

  const [status, setStatus] =
    useState<DeploymentStatusResponse | null>(
      null,
    );

  const [deploying, setDeploying] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ===================================================
  // DEPLOY
  // ===================================================

  const handleDeploy = useCallback(
    async () => {
      setDeploying(true);
      setError(null);

      try {
        const result =
          await deployProject(config);

        setDeployment(result);

        if (result.deploymentId) {
          const currentStatus =
            await getDeploymentStatus(
              result.deploymentId,
            );

          setStatus(currentStatus);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Deployment failed.",
        );
      } finally {
        setDeploying(false);
      }
    },
    [config],
  );

  // ===================================================
  // REFRESH STATUS
  // ===================================================

  const refreshStatus = useCallback(
    async () => {
      if (!deployment?.deploymentId) {
        return;
      }

      try {
        const currentStatus =
          await getDeploymentStatus(
            deployment.deploymentId,
          );

        setStatus(currentStatus);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to refresh deployment status.",
        );
      }
    },
    [deployment?.deploymentId],
  );

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section className="deployment-panel">
      <div className="deployment-panel__header">
        <div>
          <h2>Deployment</h2>
          <p>
            Build and prepare this project for deployment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeploy}
          disabled={deploying}
        >
          {deploying
            ? "Deploying..."
            : "Deploy Project"}
        </button>
      </div>

      {error && (
        <div
          className="deployment-panel__error"
          role="alert"
        >
          {error}
        </div>
      )}

      <DeploymentSettings
        value={config}
        onChange={setConfig}
        disabled={deploying}
      />

      <DeploymentStatus
        deployment={deployment}
        status={status}
        onRefresh={refreshStatus}
      />
    </section>
  );
}