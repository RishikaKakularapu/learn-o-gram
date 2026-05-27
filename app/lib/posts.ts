"use client";

import { useCallback, useEffect, useState } from "react";
import { seedPosts, type LearningPost } from "../data/posts";
import { STORAGE_KEYS } from "./storage";

const EVT = "lg:posts-changed";
const OVERRIDES_KEY = "lg.seedOverrides";
const DELETED_KEY = "lg.deletedSeeds";

function readCustom(): LearningPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeCustom(list: LearningPost[]) {
  localStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}

function readOverrides(): Record<string, LearningPost> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeOverrides(map: Record<string, LearningPost>) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(EVT));
}

function readDeleted(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeDeleted(ids: string[]) {
  localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVT));
}

function safeWrite(fn: () => void) {
  try {
    fn();
  } catch (e) {
    alert("Could not save — storage may be full. Try smaller images.");
    throw e;
  }
}

function compose(): LearningPost[] {
  const custom = readCustom();
  const overrides = readOverrides();
  const deleted = new Set(readDeleted());
  const visibleSeed = seedPosts
    .filter((p) => !deleted.has(p.id))
    .map((p) => overrides[p.id] ?? p);
  return [...custom, ...visibleSeed];
}

export function useAllPosts(): LearningPost[] {
  const [posts, setPosts] = useState<LearningPost[]>([]);
  const reload = useCallback(() => setPosts(compose()), []);
  useEffect(() => {
    reload();
    const h = () => reload();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, [reload]);
  return posts;
}

export function getPostById(id: string): LearningPost | undefined {
  return compose().find((p) => p.id === id);
}

export function addCustomPost(post: LearningPost) {
  safeWrite(() => writeCustom([post, ...readCustom()]));
}

export function updatePost(post: LearningPost) {
  // Custom posts live in customPosts; seed posts are stored as overrides keyed by id.
  if (post.id.startsWith("c_")) {
    safeWrite(() =>
      writeCustom(readCustom().map((p) => (p.id === post.id ? post : p)))
    );
  } else {
    safeWrite(() => writeOverrides({ ...readOverrides(), [post.id]: post }));
  }
}

export function deletePost(id: string) {
  if (id.startsWith("c_")) {
    writeCustom(readCustom().filter((p) => p.id !== id));
  } else {
    // Hide the seed and drop any override.
    const overrides = readOverrides();
    delete overrides[id];
    writeOverrides(overrides);
    const del = readDeleted();
    if (!del.includes(id)) writeDeleted([...del, id]);
  }
  // Drop from saved list if present.
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      localStorage.setItem(
        STORAGE_KEYS.SAVED,
        JSON.stringify(ids.filter((x) => x !== id))
      );
    }
  } catch {}
}
