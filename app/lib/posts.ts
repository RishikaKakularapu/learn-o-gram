"use client";

import { useCallback, useEffect, useState } from "react";
import type { LearningPost } from "../data/posts";
import { supabase } from "./supabase";

const EVT = "lg:posts-changed";

type Row = {
  id: string;
  topic: string;
  title: string | null;
  definition: string | null;
  example: string | null;
  remember: string | null;
  tags: string[] | null;
  source: string | null;
  icon: string | null;
  background_image_url: string | null;
  foreground_image_url: string | null;
};

function rowToPost(r: Row): LearningPost {
  return {
    id: r.id,
    topic: r.topic,
    title: r.title ?? "",
    definition: r.definition ?? "",
    example: r.example ?? undefined,
    remember: r.remember ?? undefined,
    tags: r.tags ?? [],
    source: r.source ?? undefined,
    icon: r.icon ?? undefined,
    backgroundImage: r.background_image_url ?? undefined,
    foregroundImage: r.foreground_image_url ?? undefined,
  };
}

function postToRow(p: LearningPost) {
  return {
    id: p.id,
    topic: p.topic,
    title: p.title,
    definition: p.definition,
    example: p.example ?? null,
    remember: p.remember ?? null,
    tags: p.tags,
    source: p.source ?? null,
    icon: p.icon ?? null,
    background_image_url: p.backgroundImage ?? null,
    foreground_image_url: p.foregroundImage ?? null,
    updated_at: new Date().toISOString(),
  };
}

export function useAllPosts(): LearningPost[] {
  const [posts, setPosts] = useState<LearningPost[]>([]);
  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("position", { ascending: true })
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("posts fetch", error);
      return;
    }
    setPosts((data as Row[] | null ?? []).map(rowToPost));
  }, []);
  useEffect(() => {
    reload();
    const h = () => reload();
    window.addEventListener(EVT, h);
    return () => window.removeEventListener(EVT, h);
  }, [reload]);
  return posts;
}

export async function getPostById(id: string): Promise<LearningPost | undefined> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return undefined;
  return rowToPost(data as Row);
}

export async function addPost(post: LearningPost) {
  const { error } = await supabase.from("posts").insert(postToRow(post));
  if (error) {
    alert(`Could not save: ${error.message}`);
    throw error;
  }
  window.dispatchEvent(new Event(EVT));
}

export async function updatePost(post: LearningPost) {
  const { error } = await supabase
    .from("posts")
    .update(postToRow(post))
    .eq("id", post.id);
  if (error) {
    alert(`Could not update: ${error.message}`);
    throw error;
  }
  window.dispatchEvent(new Event(EVT));
}

/**
 * Reorder posts within a topic by writing the index of each id as `position`.
 * orderedIds[0] gets position 1, orderedIds[1] gets position 2, ... etc.
 */
export async function reorderPosts(orderedIds: string[]) {
  if (orderedIds.length === 0) return;
  const updates = orderedIds.map((id, i) =>
    supabase
      .from("posts")
      .update({ position: i + 1 })
      .eq("id", id)
  );
  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error)?.error;
  if (firstError) {
    alert(`Could not save order: ${firstError.message}`);
    throw firstError;
  }
  window.dispatchEvent(new Event(EVT));
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    alert(`Could not delete: ${error.message}`);
    throw error;
  }
  // Drop from local saves too
  try {
    const raw = localStorage.getItem("lg.saved");
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      localStorage.setItem(
        "lg.saved",
        JSON.stringify(ids.filter((x) => x !== id))
      );
    }
  } catch {}
  window.dispatchEvent(new Event(EVT));
}
