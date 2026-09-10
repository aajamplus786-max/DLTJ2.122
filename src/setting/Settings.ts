// =====================================================
// DLTJ2.1
// SETTINGS TYPES
// FILE: src/setting/Settings.ts
// =====================================================

export type ThemeMode = "light" | "dark";

export type AccentColor =
  | "royal"
  | "rose"
  | "blue"
  | "purple"
  | "green";

export type UILayout =
  | "normal"
  | "compact";

export type Language =
  | "en"
  | "ta";

// =====================================================
// ACCESSIBILITY SETTINGS
// =====================================================

export interface AccessibilitySettings {
  textScale: number;
  reduceMotion: boolean;
  highContrast: boolean;
}

// =====================================================
// EDITOR SETTINGS
// =====================================================

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
}

// =====================================================
// NOTIFICATION SETTINGS
// =====================================================

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
}

// =====================================================
// SETTINGS
// =====================================================

export interface Settings {
  theme: ThemeMode;

  accentColor: AccentColor;

  uiEffects: boolean;

  layout: UILayout;

  mdljKey: boolean;

  editor: EditorSettings;

  notifications: NotificationSettings;

  language: Language;

  accessibility: AccessibilitySettings;
}

// =====================================================
// SETTINGS KEY
// =====================================================

export type SettingsKey =
  | "theme"
  | "accentColor"
  | "uiEffects"
  | "layout"
  | "mdljKey"
  | "editor"
  | "notifications"
  | "language"
  | "accessibility";

// =====================================================
// SETTINGS VALUE
// =====================================================

export type SettingsValue<
  K extends SettingsKey
> = Settings[K];

// =====================================================
// DEFAULT SETTINGS
// =====================================================

export const defaultSettings: Settings = {
  theme: "light",

  accentColor: "royal",

  uiEffects: true,

  layout: "normal",

  mdljKey: true,

  editor: {
    fontSize: 15,
    wordWrap: true,
    lineNumbers: true,
  },

  notifications: {
    enabled: true,
    sound: true,
  },

  language: "en",

  accessibility: {
    textScale: 1,
    reduceMotion: false,
    highContrast: false,
  },
};

// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

export const DEFAULT_SETTINGS =
  defaultSettings;