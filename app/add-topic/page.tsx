"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import {
  addTopic,
  deleteTopic,
  getTopicBySlug,
  gradientPresets,
  slugify,
  updateTopic,
  useAllTopics,
} from "../lib/topics";
import { useAuth } from "../lib/auth";

function TopicForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editSlug = params.get("slug");
  const isEdit = Boolean(editSlug);
  const { topics } = useAllTopics();
  const { isOwner, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✨");
  const [blurb, setBlurb] = useState("");
  const [gradient, setGradient] = useState(gradientPresets[0].value);
  const [loaded, setLoaded] = useState(!isEdit);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit || !editSlug || loaded) return;
    getTopicBySlug(editSlug).then((t) => {
      if (t) {
        setName(t.name);
        setIcon(t.icon);
        setBlurb(t.blurb);
        setGradient(t.gradient);
      }
      setLoaded(true);
    });
  }, [isEdit, editSlug, loaded]);

  const newSlug = isEdit ? (editSlug as string) : slugify(name);
  const taken =
    !isEdit && topics.some((t) => t.slug === newSlug) && newSlug.length > 0;
  const canSubmit =
    !busy && name.trim().length > 0 && newSlug.length > 0 && !taken;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    const topic = {
      slug: newSlug,
      name: name.trim(),
      blurb: blurb.trim() || "Your topic.",
      icon: icon || "✨",
      gradient,
    };
    try {
      if (isEdit) await updateTopic(topic);
      else await addTopic(topic);
      router.push(`/feed/${newSlug}`);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!editSlug) return;
    if (
      !confirm(
        `Delete this topic? Its cards will also be deleted. This can't be undone.`
      )
    )
      return;
    setBusy(true);
    try {
      await deleteTopic(editSlug);
      router.push("/");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent placeholder:text-muted";

  if (authLoading || !loaded) return null;

  if (!isOwner) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
        You need to sign in to add or edit topics.{" "}
        <Link href="/signin" className="text-accent">Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto px-4 py-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-square rounded-2xl overflow-hidden border border-border relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex flex-col justify-between p-3">
            <div className="text-3xl">{icon || "✨"}</div>
            <div>
              <div className="text-[15px] font-semibold leading-tight">
                {name || "Topic name"}
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">Preview</div>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted self-center">
          Live preview of how your topic tile will look on the home grid.
        </div>
      </div>

      <div className="grid grid-cols-[80px_1fr] gap-2">
        <div>
          <label className="text-xs text-muted block mb-1">Icon</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            maxLength={2}
            className={field + " text-center text-xl"}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Name*</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. LangChain"
            className={field}
          />
          {taken && (
            <div className="text-[11px] text-pink-400 mt-1">
              A topic with this name already exists.
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-muted block mb-1">Short description</label>
        <input
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          placeholder="What's in this topic?"
          className={field}
        />
      </div>

      <div>
        <label className="text-xs text-muted block mb-2">Color</label>
        <div className="grid grid-cols-4 gap-2">
          {gradientPresets.map((g) => (
            <button
              type="button"
              key={g.value}
              onClick={() => setGradient(g.value)}
              aria-label={g.label}
              className={`h-12 rounded-lg bg-gradient-to-br ${g.value} ${
                gradient === g.value ? "ring-2 ring-white" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-3 rounded-xl gradient-accent font-semibold disabled:opacity-40"
      >
        {busy ? "Saving…" : isEdit ? "Update topic" : "Create topic"}
      </button>

      {isEdit && (
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="w-full py-3 rounded-xl bg-surface2 border border-border text-pink-400 font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Trash2 size={16} /> Delete topic
        </button>
      )}
    </form>
  );
}

export default function AddTopicPage() {
  return (
    <main className="min-h-screen bg-bg text-text pb-24">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="text-sm font-semibold">Topic</div>
        </div>
      </header>

      <Suspense fallback={null}>
        <TopicForm />
      </Suspense>

      <BottomNav />
    </main>
  );
}
