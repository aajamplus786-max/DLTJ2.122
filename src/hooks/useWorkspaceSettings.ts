// =====================================================
// DLTJ2.1
// WORKING TOOL — WORKSPACE SETTINGS
// FILE: src/hooks/useWorkspaceSettings.ts
// DATE: 2026-08-31
// =====================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

// =====================================================
// TYPES
// =====================================================

export type WorkspaceTheme =
  | "dark"
  | "light"
  | "system";

export interface WorkspaceSettings {
  theme: WorkspaceTheme;

  fontSize: number;

  tabSize: number;

  wordWrap: boolean;

  lineNumbers: boolean;

  minimap: boolean;

  autoSave: boolean;

  autoSaveDelay: number;

  bracketMatching: boolean;

  highlightActiveLine: boolean;

  showWhitespace: boolean;

  smoothScrolling: boolean;

  cursorBlink: boolean;

  confirmDelete: boolean;

  sidebarWidth: number;

  bottomPanelHeight: number;
}

// =====================================================
// DEFAULT SETTINGS
// =====================================================

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  theme: "dark",

  fontSize: 14,

  tabSize: 2,

  wordWrap: true,

  lineNumbers: true,

  minimap: false,

  autoSave: true,

  autoSaveDelay: 1000,

  bracketMatching: true,

  highlightActiveLine: true,

  showWhitespace: false,

  smoothScrolling: true,

  cursorBlink: true,

  confirmDelete: true,

  sidebarWidth: 260,

  bottomPanelHeight: 220,
};

// =====================================================
// STORAGE
// =====================================================

const STORAGE_PREFIX =
  "dltj2.1-working-tool-settings-";

// =====================================================
// RETURN TYPE
// =====================================================

export interface UseWorkspaceSettingsReturn {
  settings: WorkspaceSettings;

  setSetting: <
    K extends keyof WorkspaceSettings
  >(
    key: K,
    value: WorkspaceSettings[K],
  ) => void;

  updateSettings: (
    updates: Partial<WorkspaceSettings>,
  ) => void;

  resetSettings: () => void;

  resetSetting: <
    K extends keyof WorkspaceSettings
  >(
    key: K,
  ) => void;

  getSetting: <
    K extends keyof WorkspaceSettings
  >(
    key: K,
  ) => WorkspaceSettings[K];

  isDarkTheme: boolean;

  isLightTheme: boolean;

  toggleTheme: () => void;
}

// =====================================================
// HOOK
// =====================================================

export default function useWorkspaceSettings(
  technologyId: string,
): UseWorkspaceSettingsReturn {
  const storageKey =
    `${STORAGE_PREFIX}${technologyId}`;

  // ===================================================
  // LOAD INITIAL SETTINGS
  // ===================================================

  const [settings, setSettings] =
    useState<WorkspaceSettings>(() =>
      loadSettings(storageKey),
    );

  // ===================================================
  // SAVE SETTINGS
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(settings),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [settings, storageKey]);

  // ===================================================
  // SET ONE SETTING
  // ===================================================

  const setSetting = useCallback(
    <
      K extends keyof WorkspaceSettings
    >(
      key: K,
      value: WorkspaceSettings[K],
    ) => {
      setSettings((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  // ===================================================
  // UPDATE MULTIPLE SETTINGS
  // ===================================================

  const updateSettings = useCallback(
    (
      updates: Partial<WorkspaceSettings>,
    ) => {
      setSettings((current) => ({
        ...current,
        ...updates,
      }));
    },
    [],
  );

  // ===================================================
  // RESET ALL SETTINGS
  // ===================================================

  const resetSettings = useCallback(() => {
    const defaults = {
      ...DEFAULT_WORKSPACE_SETTINGS,
    };

    setSettings(defaults);

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(defaults),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [storageKey]);

  // ===================================================
  // RESET ONE SETTING
  // ===================================================

  const resetSetting = useCallback(
    <
      K extends keyof WorkspaceSettings
    >(
      key: K,
    ) => {
      setSettings((current) => ({
        ...current,
        [key]:
          DEFAULT_WORKSPACE_SETTINGS[key],
      }));
    },
    [],
  );

  // ===================================================
  // GET SETTING
  // ===================================================

  const getSetting = useCallback(
    <
      K extends keyof WorkspaceSettings
    >(
      key: K,
    ): WorkspaceSettings[K] => {
      return settings[key];
    },
    [settings],
  );

  // ===================================================
  // THEME
  // ===================================================

  const isDarkTheme =
    settings.theme === "dark" ||
    (
      settings.theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches
    );

  const isLightTheme =
    !isDarkTheme;

  // ===================================================
  // TOGGLE THEME
  // ===================================================

  const toggleTheme = useCallback(() => {
    setSettings((current) => ({
      ...current,
      theme:
        current.theme === "dark"
          ? "light"
          : "dark",
    }));
  }, []);

  // ===================================================
  // RETURN
  // ===================================================

  return {
    settings,

    setSetting,

    updateSettings,

    resetSettings,

    resetSetting,

    getSetting,

    isDarkTheme,

    isLightTheme,

    toggleTheme,
  };
}

// =====================================================
// LOAD SETTINGS
// =====================================================

function loadSettings(
  storageKey: string,
): WorkspaceSettings {
  try {
    const saved =
      localStorage.getItem(storageKey);

    if (!saved) {
      return {
        ...DEFAULT_WORKSPACE_SETTINGS,
      };
    }

    const parsed: unknown =
      JSON.parse(saved);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {
        ...DEFAULT_WORKSPACE_SETTINGS,
      };
    }

    const savedSettings =
      parsed as Partial<WorkspaceSettings>;

    return {
      ...DEFAULT_WORKSPACE_SETTINGS,
      ...savedSettings,
    };
  } catch {
    return {
      ...DEFAULT_WORKSPACE_SETTINGS,
    };
  }
}