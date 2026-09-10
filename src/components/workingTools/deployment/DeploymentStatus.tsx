// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 15
// FILE: src/components/workingTools/deployment/DeploymentStatus.tsx
// DATE: 2026-08-31
// =====================================================

import type {
  DeploymentResult,
  DeploymentStatusResponse,
} from "../../../services/deploymentService";

// =====================================================
// PROPS
// =====================================================

interface DeploymentStatusProps {
  deployment:
    | DeploymentResult
    | null;

  status:
    | DeploymentStatusResponse
    | null;

  onRefresh: () => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function DeploymentStatus({
  deployment,
  status,
  onRefresh,
}: DeploymentStatusProps) {
  if (!deployment && !status) {
    return (
      <div className="deployment-status">
        <h3>Deployment Status</h3>
        <p>
          No deployment has been started yet.
        </p>
      </div>
    );
  }

  const currentStatus =
    status?.status ??
    deployment?.status ??
    "queued";

  return (
    <div className="deployment-status">
      <div className="deployment-status__header">
        <h3>Deployment Status</h3>

        <button
          type="button"
          onClick={onRefresh}
          disabled={!deployment?.deploymentId}
        >
          Refresh
        </button>
      </div>

      <div className="deployment-status__state">
        <strong>
          {currentStatus}
        </strong>
      </div>

      {deployment?.deploymentId && (
        <p>
          Deployment ID:{" "}
          <code>
            {deployment.deploymentId}
          </code>
        </p>
      )}

      {status?.message && (
        <p>{status.message}</p>
      )}

      {status?.url && (
        <p>
          <a
            href={status.url}
            target="_blank"
            rel="noreferrer"
          >
            Open deployed project
          </a>
        </p>
      )}

      {status?.updatedAt && (
        <small>
          Updated:{" "}
          {new Date(
            status.updatedAt,
          ).toLocaleString()}
        </small>
      )}
    </div>
  );
}