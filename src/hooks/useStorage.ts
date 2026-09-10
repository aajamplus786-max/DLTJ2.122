// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 13
// FILE: src/hooks/useStorage.ts
// DATE: 2026-08-31
// =====================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export function useStorage<T>(
  key: string,
  initialValue: T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved =
        localStorage.getItem(key);

      return saved
        ? (JSON.parse(saved) as T)
        : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value),
      );
    } catch {
      // Storage may be unavailable.
    }
  }, [key, value]);

  const clear = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]);

  return {
    value,
    setValue,
    clear,
  };
}