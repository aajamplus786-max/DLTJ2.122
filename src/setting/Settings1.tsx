
// =====================================================
// DLTJ2.2
// SETTINGS PAGE
// FILE: src/setting/Settings1.tsx
// =====================================================

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useSettings } from "./SettingsContext";

import { useAuth } from "../hooks/useAuth";

// =====================================================
// TYPES
// =====================================================

export type ThemeMode =
  | "light"
  | "dark";

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

export interface AccessibilitySettings {
  textScale: number;
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
}

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
// SETTINGS KEY / VALUE TYPES
// =====================================================

export type SettingsKey =
  keyof Settings;

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

export const DEFAULT_SETTINGS: Settings =
  defaultSettings;

// =====================================================
// COMPONENT
// =====================================================

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    resetSettings,
  } = useSettings();

  const {
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    savedMessage,
    setSavedMessage,
  ] = useState(false);

  const [
    logoutLoading,
    setLogoutLoading,
  ] = useState(false);

  // ===================================================
  // SAVED MESSAGE
  // ===================================================

  useEffect(() => {
    setSavedMessage(true);

    const timer =
      window.setTimeout(() => {
        setSavedMessage(false);
      }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [settings]);

  // ===================================================
  // RESET
  // ===================================================

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "Reset all settings to default?",
      );

    if (!confirmed) {
      return;
    }

    resetSettings();
  };

  // ===================================================
  // THEME
  // ===================================================

  const handleThemeChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    updateSettings({
      theme:
        event.target.value as ThemeMode,
    });
  };

  // ===================================================
  // ACCENT COLOR
  // ===================================================

  const handleAccentChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    updateSettings({
      accentColor:
        event.target.value as AccentColor,
    });
  };

  // ===================================================
  // LANGUAGE
  // ===================================================

  const handleLanguageChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    updateSettings({
      language:
        event.target.value as Language,
    });
  };

  // ===================================================
  // LAYOUT
  // ===================================================

  const handleLayoutChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    updateSettings({
      layout:
        event.target.value as UILayout,
    });
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to logout?",
      );

    if (!confirmed) {
      return;
    }

    setLogoutLoading(true);

    try {
      await logout();
    } catch (error) {
      console.error(
        "[DLTJ LOGOUT]",
        error,
      );
    } finally {
      // ===============================================
      // ALWAYS RETURN TO LOGIN PAGE
      // ===============================================

      navigate(
        "/login",
        {
          replace: true,
        },
      );

      setLogoutLoading(false);
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div
      className="dltj-page settings-page"
      style={{
        minHeight: "100vh",
        padding: "30px",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 25px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          <div>

            <h1
              className="page-title"
              style={{
                margin: 0,
              }}
            >
              Settings
            </h1>

            <p
              style={{
                marginTop: "8px",
                color:
                  "var(--color-text-muted, #737373)",
              }}
            >
              Customize your DLTJ experience.
            </p>

          </div>

          {savedMessage && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                background:
                  "rgba(59,130,246,0.10)",
                color: "#2563eb",
              }}
            >
              <span>✓</span>
              Settings saved
            </div>
          )}

        </div>

      </div>

      {/* =================================================
          SETTINGS CONTENT
      ================================================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gap: "18px",
        }}
      >

        {/* =================================================
            APPEARANCE
        ================================================= */}

        <section className="dltj-card">

          <div style={{ padding: "22px" }}>

            <h2
              style={{
                margin: "0 0 18px",
              }}
            >
              Appearance
            </h2>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 700,
                }}
              >
                Theme
              </label>

              <select
                value={settings.theme}
                onChange={handleThemeChange}
              >
                <option value="light">
                  Light
                </option>

                <option value="dark">
                  Dark
                </option>
              </select>

            </div>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 700,
                }}
              >
                Accent Color
              </label>

              <select
                value={settings.accentColor}
                onChange={handleAccentChange}
              >
                <option value="royal">
                  Royal
                </option>

                <option value="rose">
                  Rose
                </option>

                <option value="blue">
                  Blue
                </option>

                <option value="purple">
                  Purple
                </option>

                <option value="green">
                  Green
                </option>
              </select>

            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  settings.uiEffects
                }
                onChange={(event) =>
                  updateSettings({
                    uiEffects:
                      event.target.checked,
                  })
                }
                style={{
                  width: "auto",
                }}
              />

              <span>
                Enable UI effects
              </span>

            </label>

          </div>

        </section>

        {/* =================================================
            LANGUAGE
        ================================================= */}

        <section className="dltj-card">

          <div style={{ padding: "22px" }}>

            <h2
              style={{
                margin: "0 0 18px",
              }}
            >
              Language
            </h2>

            <select
              value={settings.language}
              onChange={handleLanguageChange}
            >
              <option value="en">
                English
              </option>

              <option value="ta">
                தமிழ்
              </option>
            </select>

          </div>

        </section>

        {/* =================================================
            LAYOUT
        ================================================= */}

        <section className="dltj-card">

          <div style={{ padding: "22px" }}>

            <h2
              style={{
                margin: "0 0 18px",
              }}
            >
              Layout
            </h2>

            <select
              value={settings.layout}
              onChange={handleLayoutChange}
            >
              <option value="normal">
                Normal
              </option>

              <option value="compact">
                Compact
              </option>
            </select>

          </div>

        </section>

        {/* =================================================
            EDITOR
        ================================================= */}

        <section className="dltj-card">

          <div style={{ padding: "22px" }}>

            <h2
              style={{
                margin: "0 0 18px",
              }}
            >
              Editor
            </h2>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 700,
                }}
              >
                Font Size:{" "}
                {settings.editor.fontSize}px
              </label>

              <input
                type="range"
                min="10"
                max="24"
                value={
                  settings.editor.fontSize
                }
                onChange={(event) =>
                  updateSettings({
                    editor: {
                      ...settings.editor,
                      fontSize:
                        Number(
                          event.target.value,
                        ),
                    },
                  })
                }
              />

            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  settings.editor.wordWrap
                }
                onChange={(event) =>
                  updateSettings({
                    editor: {
                      ...settings.editor,
                      wordWrap:
                        event.target.checked,
                    },
                  })
                }
                style={{
                  width: "auto",
                }}
              />

              <span>
                Word Wrap
              </span>

            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  settings.editor.lineNumbers
                }
                onChange={(event) =>
                  updateSettings({
                    editor: {
                      ...settings.editor,
                      lineNumbers:
                        event.target.checked,
                    },
                  })
                }
                style={{
                  width: "auto",
                }}
              />

              <span>
                Show Line Numbers
              </span>

            </label>

          </div>

        </section>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <section className="dltj-card">

          <div style={{ padding: "22px" }}>

            <h2
              style={{
                margin: "0 0 18px",
              }}
            >
              Notifications
            </h2>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  settings.notifications.enabled
                }
                onChange={(event) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      enabled:
                        event.target.checked,
                    },
                  })
                }
                style={{
                  width: "auto",
                }}
              />

              <span>
                Enable Notifications
              </span>

            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  settings.notifications.sound
                }
                onChange={(event) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      sound:
                        event.target.checked,
                    },
                  })
                }
                style={{
                  width: "auto",
                }}
              />

              <span>
                Notification Sound
              </span>

            </label>

          </div>

        </section>

        {/* =================================================
            ACCESSIBILITY
        ================================================= */}

        <section className="dltj-card">

          <div style={{ padding: "22px" }}>

            <h2
              style={{
                margin: "0 0 18px",
              }}
            >
              Accessibility
            </h2>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 700,
                }}
              >
                Text Scale:{" "}
                {settings.accessibility.textScale.toFixed(1)}
              </label>

              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                value={
                  settings.accessibility.textScale
                }
                onChange={(event) =>
                  updateSettings({
                    accessibility: {
                      ...settings.accessibility,
                      textScale:
                        Number(
                          event.target.value,
                        ),
                    },
                  })
                }
              />

            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  settings.accessibility.reduceMotion
                }
                onChange={(event) =>
                  updateSettings({
                    accessibility: {
                      ...settings.accessibility,
                      reduceMotion:
                        event.target.checked,
                    },
                  })
                }
                style={{
                  width: "auto",
                }}
              />

              <span>
                Reduce Motion
              </span>

            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  settings.accessibility.highContrast
                }
                onChange={(event) =>
                  updateSettings({
                    accessibility: {
                      ...settings.accessibility,
                      highContrast:
                        event.target.checked,
                    },
                  })
                }
                style={{
                  width: "auto",
                }}
              />

              <span>
                High Contrast
              </span>

            </label>

          </div>

        </section>

        {/* =================================================
            RESET
        ================================================= */}

        <section className="dltj-card">

          <div
            style={{
              padding: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >

            <div>

              <h2
                style={{
                  margin: 0,
                }}
              >
                Reset Settings
              </h2>

              <p
                style={{
                  margin: "7px 0 0",
                  color:
                    "var(--color-text-muted, #737373)",
                }}
              >
                Restore all settings to their
                default values.
              </p>

            </div>

            <button
              type="button"
              className="rose-button"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </section>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <section className="dltj-card">

          <div
            style={{
              padding: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >

            <div>

              <h2
                style={{
                  margin: 0,
                }}
              >
                Logout
              </h2>

              <p
                style={{
                  margin: "7px 0 0",
                  color:
                    "var(--color-text-muted, #737373)",
                }}
              >
                Sign out of your DLTJ account.
              </p>

            </div>

            <button
              type="button"
              className="rose-button"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading
                ? "Logging out..."
                : "Logout"}
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}
