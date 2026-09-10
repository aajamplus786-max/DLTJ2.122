import { randomUUID } from 'node:crypto';

export type DeploymentStatus =
  | 'queued'
  | 'building'
  | 'running'
  | 'stopped'
  | 'failed'
  | 'cancelled';

export interface DeploymentRecord {
  id: string;
  projectId: string;
  status: DeploymentStatus;
  createdAt: string;
  updatedAt: string;
  message: string;
}

const deployments = new Map<string, DeploymentRecord>();

export async function createDeployment(input: unknown) {
  const body = input as { projectId?: unknown };

  if (typeof body.projectId !== 'string' || !body.projectId.trim()) {
    return { success: false, message: 'Project ID is required.' };
  }

  const now = new Date().toISOString();

  const deployment: DeploymentRecord = {
    id: randomUUID(),
    projectId: body.projectId.trim(),
    status: 'queued',
    createdAt: now,
    updatedAt: now,
    message: 'Deployment accepted and queued for secure processing.',
  };

  deployments.set(deployment.id, deployment);

  return { success: true, deployment };
}

export async function getDeploymentStatus(deploymentId: string) {
  const deployment = deployments.get(deploymentId);
  if (!deployment) return undefined;
  return { success: true, deployment };
}

export async function cancelDeployment(deploymentId: string) {
  const deployment = deployments.get(deploymentId);

  if (!deployment) {
    return { success: false, message: 'Deployment not found.' };
  }

  if (deployment.status === 'running') {
    return {
      success: false,
      message: 'Running deployments cannot be cancelled by this layer.',
    };
  }

  deployment.status = 'cancelled';
  deployment.updatedAt = new Date().toISOString();
  deployment.message = 'Deployment cancelled.';

  deployments.set(deployment.id, deployment);

  return { success: true, deployment };
}
