// =====================================================
// DLTJ2.1
// INTERNATIONALIZATION
// FILE: src/setting/i18n.ts
// =====================================================

import {
  type Language,
} from "./Settings";

// =====================================================
// TRANSLATIONS
// =====================================================

export const translations = {
  en: {
    home: "Home",
    learn: "Learn",
    workingTools: "Working Tools",
    practice: "Practice",
    tests: "Tests",
    settings: "Settings",
    logout: "Logout",

    appearance: "Appearance",
    theme: "Theme",
    light: "Light",
    dark: "Dark",

    accentColor: "Accent Color",

    language: "Language",

    layout: "Layout",
    normal: "Normal",
    compact: "Compact",

    editor: "Editor",
    fontSize: "Font Size",
    wordWrap: "Word Wrap",
    lineNumbers: "Show Line Numbers",

    notifications: "Notifications",
    enableNotifications:
      "Enable Notifications",
    notificationSound:
      "Notification Sound",

    accessibility: "Accessibility",
    textScale: "Text Scale",
    reduceMotion: "Reduce Motion",
    highContrast: "High Contrast",

    uiEffects: "Enable UI effects",

    resetSettings: "Reset Settings",
    restoreSettings:
      "Restore all settings to their default values.",

    reset: "Reset",

    settingsSaved: "Settings saved",

    customize:
      "Customize your DLTJ experience.",
  },

  ta: {
    home: "முகப்பு",
    learn: "கற்றல்",
    workingTools: "செயல்பாட்டு கருவிகள்",
    practice: "பயிற்சி",
    tests: "தேர்வுகள்",
    settings: "அமைப்புகள்",
    logout: "வெளியேறு",

    appearance: "தோற்றம்",
    theme: "தீம்",
    light: "வெளிச்சம்",
    dark: "இருள்",

    accentColor: "முக்கிய நிறம்",

    language: "மொழி",

    layout: "அமைப்பு",
    normal: "சாதாரணம்",
    compact: "சுருக்கம்",

    editor: "எடிட்டர்",
    fontSize: "எழுத்து அளவு",
    wordWrap: "வரி மடிப்பு",
    lineNumbers:
      "வரி எண்களைக் காட்டு",

    notifications: "அறிவிப்புகள்",
    enableNotifications:
      "அறிவிப்புகளை இயக்கு",
    notificationSound:
      "அறிவிப்பு ஒலி",

    accessibility: "அணுகல்தன்மை",
    textScale: "உரை அளவு",
    reduceMotion:
      "அசைவுகளைக் குறை",
    highContrast:
      "அதிக மாறுபாடு",

    uiEffects:
      "UI விளைவுகளை இயக்கு",

    resetSettings:
      "அமைப்புகளை மீட்டமை",
    restoreSettings:
      "அனைத்து அமைப்புகளையும் இயல்புநிலைக்கு மாற்றவும்.",

    reset: "மீட்டமை",

    settingsSaved:
      "அமைப்புகள் சேமிக்கப்பட்டன",

    customize:
      "உங்கள் DLTJ அனுபவத்தைத் தனிப்பயனாக்குங்கள்.",
  },
} as const;

// =====================================================
// TRANSLATION TYPE
// =====================================================

export type TranslationKey =
  keyof typeof translations.en;

// =====================================================
// TRANSLATION FUNCTION
// =====================================================

export function t(
  language: Language,
  key: TranslationKey
): string {
  return translations[language][key];
}

// =====================================================
// DEFAULT LANGUAGE
// =====================================================

export const defaultLanguage: Language =
  "en";