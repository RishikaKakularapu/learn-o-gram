"use client";

import { useCallback, useEffect, useState } from "react";
import { topics as seedTopics, type Topic } from "../data/topics";

const CUSTOM_KEY = "lg.customTopics";
const OVERRIDES_KEY = "lg.topicOverrides";
const DELETED_KEY = "lg.deletedTopics";
const EVT = "lg:topics-changed";

export const gradientPresets: { label: string; value: string }[] = [
  { label: "Violet → Pink", value: "from-violet-500 to-fuchsia-500" },
  { label: "Amber → Pink", value: "from-amber-400 to-pink-500" },
  { label: "Emerald → Cyan", value: "from-emerald-400 to-cyan-500" },
  { label: "Sky → Indigo", value: "from-sky-500 to-indigo-500" },
  { label: "Rose → Orange", value: "from-rose-500 to-orange-500" },
  { label: "Teal → Blue", value: "from-teal-400 to-blue-500" },
  { label: "Lime → Green", value: "from-lime-400 to-green-600" },
  { label: "Slate → Zinc", value: "from-slate-500 to-zinc-700" },
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVT));
}

function compose(): Topic[] {
  const custom = readJSON<Topic[]>(CUSTOM_KEY, []);
  const overrides = readJSON<Record<string, Topic>>(OVERRIDES_KEY, {});
  const deleted = new Set(readJSON<string[]>(DELETED_KEY, []));
  const visibleSeed = seedTopics
    .filter((t) => !deleted.has(t.slug))
    .map((t) => overrides[t.slug] ?? t);
  return [...visibleSeed, ...custom];
}

export function useAllTopics(): { topics: Topic[]; ready: boolean } {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [ready, setReady] = useState(false);
  const reload = useCallback(() => setTopics(compose()), []);
  useEffect(() => {
    reload();
    setReady(true);
    const h = () => reload();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, [reload]);
  return { topics, ready };
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return compose().find((t) => t.slug === slug);
}

export function isCustomTopic(slug: string): boolean {
  return readJSON<Topic[]>(CUSTOM_KEY, []).some((t) => t.slug === slug);
}

export function addCustomTopic(t: Topic) {
  writeJSON(CUSTOM_KEY, [...readJSON<Topic[]>(CUSTOM_KEY, []), t]);
}

export function updateTopic(t: Topic) {
  // Custom topics live in customTopics. Seed-topic edits go to overrides.
  if (isCustomTopic(t.slug)) {
    writeJSON(
      CUSTOM_KEY,
      readJSON<Topic[]>(CUSTOM_KEY, []).map((x) => (x.slug === t.slug ? t : x))
    );
  } else {
    writeJSON(OVERRIDES_KEY, {
      ...readJSON<Record<string, Topic>>(OVERRIDES_KEY, {}),
      [t.slug]: t,
    });
  }
}

export function deleteTopic(slug: string) {
  if (isCustomTopic(slug)) {
    writeJSON(
      CUSTOM_KEY,
      readJSON<Topic[]>(CUSTOM_KEY, []).filter((t) => t.slug !== slug)
    );
  } else {
    const overrides = readJSON<Record<string, Topic>>(OVERRIDES_KEY, {});
    delete overrides[slug];
    writeJSON(OVERRIDES_KEY, overrides);
    const del = readJSON<string[]>(DELETED_KEY, []);
    if (!del.includes(slug)) writeJSON(DELETED_KEY, [...del, slug]);
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
