// =====================================================
// DLTJ2.1
// NOTIFICATION HOOK
// FILE: src/setting/useNotification.ts
// =====================================================

import useSettings from "./useSettings";

export default function useNotification() {
  const {
    settings,
  } = useSettings();

  return {
    enabled:
      settings.notifications.enabled,

    sound:
      settings.notifications.sound,
  };
}