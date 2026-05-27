"use client";

import { useEffect, useState } from "react";

const SAVED_KEY = "lg.saved";
const CUSTOM_KEY = "lg.customPosts";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}

export const STORAGE_KEYS = { SAVED: SAVED_KEY, CUSTOM: CUSTOM_KEY };
