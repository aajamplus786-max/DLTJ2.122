// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 14
// FILE: server/src/services/shareService.ts
// DATE: 2026-08-31
// =====================================================

import {
  randomBytes,
  randomUUID,
} from "node:crypto";

export type SharePermission =
  | "view"
  | "edit";

export interface ShareLink {
  id: string;
  projectId: string;
  permission: SharePermission;
  token: string;
  url: string;
  createdAt: number;
  expiresAt: number | null;
  active: boolean;
}

const shares =
  new Map<string, ShareLink>();

function createToken(): string {
  return randomBytes(
    32,
  ).toString("hex");
}

function getPublicBaseUrl(): string {
  return (
    process.env.FRONTEND_URL ??
    "http://localhost:5173"
  );
}

export async function createShare(
  projectId: string,
  permission: SharePermission,
): Promise<{
  success: boolean;
  message?: string;
  shareLink?: ShareLink;
}> {
  const token =
    createToken();

  const shareLink: ShareLink = {
    id: randomUUID(),
    projectId,
    permission,
    token,
    url:
      `${getPublicBaseUrl()}/shared/${token}`,
    createdAt: Date.now(),
    expiresAt: null,
    active: true,
  };

  shares.set(
    shareLink.id,
    shareLink,
  );

  return {
    success: true,
    message:
      "Share link created successfully.",
    shareLink,
  };
}

export async function getProjectShares(
  projectId: string,
): Promise<{
  success: boolean;
  links: ShareLink[];
}> {
  const links =
    Array.from(
      shares.values(),
    ).filter(
      (share) =>
        share.projectId ===
          projectId &&
        share.active,
    );

  return {
    success: true,
    links,
  };
}

export async function revokeShare(
  shareId: string,
): Promise<{
  success: boolean;
  message?: string;
}> {
  const share =
    shares.get(shareId);

  if (!share) {
    return {
      success: false,
      message:
        "Share link not found.",
    };
  }

  shares.set(
    shareId,
    {
      ...share,
      active: false,
    },
  );

  return {
    success: true,
    message:
      "Share link revoked successfully.",
  };
}

export function getShareByToken(
  token: string,
): ShareLink | null {
  for (
    const share of shares.values()
  ) {
    if (
      share.token === token &&
      share.active
    ) {
      if (
        share.expiresAt &&
        Date.now() >=
          share.expiresAt
      ) {
        return null;
      }

      return share;
    }
  }

  return null;
}