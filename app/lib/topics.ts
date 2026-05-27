"use client";

import { useCallback, useEffect, useState } from "react";
import type { Topic } from "../data/topics";
import { supabase } from "./supabase";

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

type Row = {
  slug: string;
  name: string;
  blurb: string | null;
  icon: string | null;
  gradient: string | null;
  position: number | null;
};

function rowToTopic(r: Row): Topic {
  return {
    slug: r.slug,
    name: r.name,
    blurb: r.blurb ?? "",
    icon: r.icon ?? "",
    gradient: r.gradient ?? "from-violet-500 to-fuchsia-500",
  };
}

function topicToRow(t: Topic) {
  return {
    slug: t.slug,
    name: t.name,
    blurb: t.blurb,
    icon: t.icon,
    gradient: t.gradient,
    updated_at: new Date().toISOString(),
  };
}

export function useAllTopics(): { topics: Topic[]; ready: boolean } {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [ready, setReady] = useState(false);
  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("position", { ascending: true })
      .order("name", { ascending: true });
    if (!error) setTopics((data as Row[] | null ?? []).map(rowToTopic));
    setReady(true);
  }, []);
  useEffect(() => {
    reload();
    const h = () => reload();
    window.addEventListener(EVT, h);
    return () => window.removeEventListener(EVT, h);
  }, [reload]);
  return { topics, ready };
}

export async function getTopicBySlug(slug: string): Promise<Topic | undefined> {
  const { data } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ? rowToTopic(data as Row) : undefined;
}

export async function addTopic(t: Topic) {
  const { error } = await supabase.from("topics").insert(topicToRow(t));
  if (error) {
    alert(`Could not save: ${error.message}`);
    throw error;
  }
  window.dispatchEvent(new Event(EVT));
}

export async function updateTopic(t: Topic) {
  const { error } = await supabase
    .from("topics")
    .update(topicToRow(t))
    .eq("slug", t.slug);
  if (error) {
    alert(`Could not update: ${error.message}`);
    throw error;
  }
  window.dispatchEvent(new Event(EVT));
}

export async function deleteTopic(slug: string) {
  const { error } = await supabase.from("topics").delete().eq("slug", slug);
  if (error) {
    alert(`Could not delete: ${error.message}`);
    throw error;
  }
  window.dispatchEvent(new Event(EVT));
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
