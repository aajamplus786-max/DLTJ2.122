// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 11
// FILE: server/src/runners/springRunner.ts
// DATE: 2026-08-31
// =====================================================

export interface SpringRunRequest {
    projectId: string;
    projectPath: string;
    buildTool: "maven" | "gradle";
    action: "build" | "test" | "run";
  }
  
  export interface SpringRunResult {
    success: boolean;
    status:
      | "accepted"
      | "blocked";
    message: string;
  }
  
  /*
   * Spring execution must go through the security/
   * sandbox layer from Batch 8 before any Maven/Gradle
   * process is launched.
   *
   * This runner therefore exposes a safe execution contract
   * instead of directly spawning arbitrary commands.
   */
  
  export async function runSpringProject(
    request: SpringRunRequest,
  ): Promise<SpringRunResult> {
    if (
      !request.projectId ||
      !request.projectPath
    ) {
      return {
        success: false,
        status: "blocked",
        message:
          "Spring project information is required.",
      };
    }
  
    if (
      request.buildTool !== "maven" &&
      request.buildTool !== "gradle"
    ) {
      return {
        success: false,
        status: "blocked",
        message:
          "Unsupported Spring build tool.",
      };
    }
  
    if (
      !["build", "test", "run"].includes(
        request.action,
      )
    ) {
      return {
        success: false,
        status: "blocked",
        message:
          "Unsupported Spring action.",
      };
    }
  
    return {
      success: true,
      status: "accepted",
      message:
        "Spring execution request accepted for sandbox validation.",
    };
  }