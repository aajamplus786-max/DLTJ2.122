// =====================================================
// DLTJ2.1
// MDLJ KEY HOOK
// FILE: src/setting/useMDLJKey.ts
// =====================================================

import {
  useEffect,
} from "react";

import useSettings from "./useSettings";

export default function useMDLJKey() {
  const {
    settings,
  } = useSettings();

  const enabled =
    settings.mdljKey;

  useEffect(() => {
    document.documentElement.dataset.mdljKey =
      enabled
        ? "on"
        : "off";
  }, [enabled]);

  return {
    enabled,
  };
}