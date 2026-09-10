// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 15
// FILE: src/services/deploymentService.ts
// DATE: 2026-08-31
// =====================================================

// =====================================================
// API
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

// =====================================================
// DEPLOYMENT TYPES
// =====================================================

export type DeploymentEnvironment =
  | "development"
  | "preview"
  | "production";

export type DeploymentProvider =
  | "local"
  | "netlify"
  | "render";

export type DeploymentState =
  | "queued"
  | "building"
  | "deploying"
  | "success"
  | "failed"
  | "cancelled";

// =====================================================
// DEPLOYMENT CONFIG
// =====================================================

export interface DeploymentConfig {
  projectId: string;
  technologyId: string;
  projectName: string;

  environment: DeploymentEnvironment;

  outputDirectory: string;
  buildCommand: string;
  startCommand: string;
  installCommand: string;

  autoDeploy: boolean;

  provider: DeploymentProvider;
}

// =====================================================
// DEPLOYMENT RESULT
// =====================================================

export interface DeploymentResult {
  success: boolean;
  deploymentId?: string;
  status: DeploymentState;
  message: string;
  url?: string;
  createdAt?: string;
}

// =====================================================
// DEPLOYMENT STATUS
// =====================================================

export interface DeploymentStatusResponse {
  success: boolean;
  deploymentId: string;
  status: DeploymentState;
  message?: string;
  url?: string;
  updatedAt?: string;
}

// =====================================================
// CANCEL RESPONSE
// =====================================================

export interface CancelDeploymentResponse {
  success: boolean;
  message: string;
}

// =====================================================
// API REQUEST HELPER
// =====================================================

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    },
  );

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Deployment request failed.";

    throw new Error(message);
  }

  return data as T;
}

// =====================================================
// START DEPLOYMENT
// =====================================================

export async function deployProject(
  config: DeploymentConfig,
): Promise<DeploymentResult> {
  return request<DeploymentResult>(
    "/deployment",
    {
      method: "POST",
      body: JSON.stringify(config),
    },
  );
}

// =====================================================
// GET DEPLOYMENT STATUS
// =====================================================

export async function getDeploymentStatus(
  deploymentId: string,
): Promise<DeploymentStatusResponse> {
  return request<DeploymentStatusResponse>(
    `/deployment/${encodeURIComponent(
      deploymentId,
    )}`,
    {
      method: "GET",
    },
  );
}

// =====================================================
// CANCEL DEPLOYMENT
// =====================================================

export async function cancelDeployment(
  deploymentId: string,
): Promise<CancelDeploymentResponse> {
  return request<CancelDeploymentResponse>(
    `/deployment/${encodeURIComponent(
      deploymentId,
    )}/cancel`,
    {
      method: "POST",
    },
  );
}