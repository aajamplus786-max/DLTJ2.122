// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 8
// FILE: server/src/security/commandSecurity.ts
// DATE: 2026-08-31
// =====================================================

const BLOCKED_COMMANDS = [
    "rm",
    "rmdir",
    "del",
    "format",
    "shutdown",
    "reboot",
    "mkfs",
    "diskpart",
    "reg",
    "powershell",
    "cmd",
    "bash",
    "sh",
    "curl",
    "wget",
  ];
  
  const BLOCKED_PATTERNS = [
    /\.\.[/\\]/,
    /[;&|`$]/,
    /<</,
    />\s*>/,
  ];
  
  export interface CommandValidation {
    allowed: boolean;
    reason?: string;
  }
  
  export function validateCommand(
    command: string,
  ): CommandValidation {
    const value =
      command.trim();
  
    if (!value) {
      return {
        allowed: false,
        reason:
          "Command cannot be empty.",
      };
    }
  
    const normalized =
      value.toLowerCase();
  
    const commandName =
      normalized.split(/\s+/)[0];
  
    if (
      BLOCKED_COMMANDS.includes(
        commandName,
      )
    ) {
      return {
        allowed: false,
        reason:
          `Command '${commandName}' is not allowed.`,
      };
    }
  
    for (
      const pattern of BLOCKED_PATTERNS
    ) {
      if (pattern.test(value)) {
        return {
          allowed: false,
          reason:
            "Command contains a restricted shell pattern.",
        };
      }
    }
  
    return {
      allowed: true,
    };
  }
  
  export function isCommandAllowed(
    command: string,
  ): boolean {
    return validateCommand(
      command,
    ).allowed;
  }