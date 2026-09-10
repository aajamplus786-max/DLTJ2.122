// =====================================================
// DLTJ2.1
// SETTINGS CONTEXT
// FILE: src/setting/SettingsContext.tsx
// =====================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type Settings,
  type SettingsKey,
  type SettingsValue,
  defaultSettings,
} from "./Settings1";

// =====================================================
// CONTEXT TYPE
// =====================================================

interface SettingsContextType {
  settings: Settings;

  setSetting: <K extends SettingsKey>(
    key: K,
    value: SettingsValue<K>
  ) => void;

  updateSettings: (
    updates: Partial<Settings>
  ) => void;

  resetSettings: () => void;
}

// =====================================================
// STORAGE KEY
// =====================================================

const SETTINGS_STORAGE_KEY =
  "dltj2.1-settings";

// =====================================================
// CONTEXT
// =====================================================

const SettingsContext =
  createContext<
    SettingsContextType | undefined
  >(undefined);

// =====================================================
// PROVIDER PROPS
// =====================================================

interface SettingsProviderProps {
  children: ReactNode;
}

// =====================================================
// CREATE DEFAULT SETTINGS
// =====================================================

function createDefaultSettings(): Settings {
  return {
    ...defaultSettings,

    editor: {
      ...defaultSettings.editor,
    },

    notifications: {
      ...defaultSettings.notifications,
    },

    accessibility: {
      ...defaultSettings.accessibility,
    },
  };
}

// =====================================================
// LOAD SETTINGS
// =====================================================

function loadStoredSettings(): Settings {
  try {
    const storedSettings =
      localStorage.getItem(
        SETTINGS_STORAGE_KEY
      );

    // -------------------------------------------------
    // NO SAVED SETTINGS
    // -------------------------------------------------

    if (!storedSettings) {
      return createDefaultSettings();
    }

    // -------------------------------------------------
    // PARSE SAVED SETTINGS
    // -------------------------------------------------

    const parsedSettings =
      JSON.parse(
        storedSettings
      ) as Partial<Settings>;

    // -------------------------------------------------
    // MERGE SAVED SETTINGS WITH DEFAULT SETTINGS
    // -------------------------------------------------

    return {
      ...defaultSettings,

      ...parsedSettings,

      editor: {
        ...defaultSettings.editor,
        ...(parsedSettings.editor ?? {}),
      },

      notifications: {
        ...defaultSettings.notifications,
        ...(parsedSettings.notifications ?? {}),
      },

      accessibility: {
        ...defaultSettings.accessibility,
        ...(parsedSettings.accessibility ?? {}),
      },
    };
  } catch {
    return createDefaultSettings();
  }
}

// =====================================================
// SETTINGS PROVIDER
// =====================================================

export function SettingsProvider({
  children,
}: SettingsProviderProps) {

  const [
    settings,
    setSettings,
  ] = useState<Settings>(
    loadStoredSettings
  );

  // ===================================================
  // SAVE SETTINGS TO LOCAL STORAGE
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [settings]);

  // ===================================================
  // APPLY TEXT SCALE
  // ===================================================

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--dltj-text-scale",
      String(
        settings.accessibility.textScale
      )
    );
  }, [
    settings.accessibility.textScale,
  ]);

  // ===================================================
  // APPLY REDUCED MOTION
  // ===================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      settings.accessibility.reduceMotion
    );
  }, [
    settings.accessibility.reduceMotion,
  ]);

  // ===================================================
  // APPLY HIGH CONTRAST
  // ===================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "high-contrast",
      settings.accessibility.highContrast
    );
  }, [
    settings.accessibility.highContrast,
  ]);

  // ===================================================
  // APPLY THEME
  // ===================================================

  useEffect(() => {
    document.documentElement.dataset.theme =
      settings.theme;
  }, [
    settings.theme,
  ]);

  // ===================================================
  // APPLY ACCENT COLOR
  // ===================================================

  useEffect(() => {
    document.documentElement.dataset.accent =
      settings.accentColor;
  }, [
    settings.accentColor,
  ]);

  // ===================================================
  // APPLY UI EFFECTS
  // ===================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "effects-disabled",
      !settings.uiEffects
    );
  }, [
    settings.uiEffects,
  ]);

  // ===================================================
  // APPLY LAYOUT
  // ===================================================

  useEffect(() => {
    document.documentElement.dataset.layout =
      settings.layout;
  }, [
    settings.layout,
  ]);

  // ===================================================
  // SET SINGLE SETTING
  // ===================================================

  const setSetting = useCallback(
    <K extends SettingsKey>(
      key: K,
      value: SettingsValue<K>
    ) => {
      setSettings(
        (
          previousSettings
        ) => ({
          ...previousSettings,

          [key]: value,
        })
      );
    },
    []
  );

  // ===================================================
  // UPDATE MULTIPLE SETTINGS
  // ===================================================

  const updateSettings =
    useCallback(
      (
        updates: Partial<Settings>
      ) => {

        setSettings(
          (
            previousSettings
          ) => ({
            ...previousSettings,

            ...updates,

            // -----------------------------------------
            // EDITOR
            // -----------------------------------------

            editor: {
              ...previousSettings.editor,

              ...(updates.editor ?? {}),
            },

            // -----------------------------------------
            // NOTIFICATIONS
            // -----------------------------------------

            notifications: {
              ...previousSettings.notifications,

              ...(updates.notifications ?? {}),
            },

            // -----------------------------------------
            // ACCESSIBILITY
            // -----------------------------------------

            accessibility: {
              ...previousSettings.accessibility,

              ...(updates.accessibility ?? {}),
            },
          })
        );
      },
      []
    );

  // ===================================================
  // RESET SETTINGS
  // ===================================================

  const resetSettings =
    useCallback(() => {

      setSettings(
        createDefaultSettings()
      );

    }, []);

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const contextValue =
    useMemo<SettingsContextType>(
      () => ({
        settings,

        setSetting,

        updateSettings,

        resetSettings,
      }),
      [
        settings,
        setSetting,
        updateSettings,
        resetSettings,
      ]
    );

  // ===================================================
  // RENDER PROVIDER
  // ===================================================

  return (
    <SettingsContext.Provider
      value={contextValue}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// =====================================================
// USE SETTINGS
// =====================================================

export function useSettings() {

  const context =
    useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}

// =====================================================
// USE SETTINGS CONTEXT
// =====================================================

export function useSettingsContext() {
  return useSettings();
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default SettingsContext;