"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImagePicker } from "../components/ImagePicker";
import { Markdown } from "../components/Markdown";
import { useAllTopics } from "../lib/topics";
import { addPost, deletePost, getPostById, updatePost } from "../lib/posts";
import { useAuth } from "../lib/auth";
import type { LearningPost } from "../data/posts";

function AddForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { topics, ready } = useAllTopics();
  const { isOwner, loading: authLoading } = useAuth();

  const editId = search.get("id");
  const preset = search.get("topic");
  const isEdit = Boolean(editId);

  const [topic, setTopic] = useState<string>("");
  const [title, setTitle] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [remember, setRemember] = useState("");
  const [tags, setTags] = useState("");
  const [icon, setIcon] = useState("📝");
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>();
  const [foregroundImage, setForegroundImage] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(!isEdit);
  const [showPreview, setShowPreview] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit || !editId || loaded) return;
    getPostById(editId).then((existing) => {
      if (existing) {
        setTopic(existing.topic);
        setTitle(existing.title);
        setDefinition(existing.definition);
        setExample(existing.example ?? "");
        setRemember(existing.remember ?? "");
        setTags(existing.tags.join(", "));
        setIcon(existing.icon ?? "📝");
        setBackgroundImage(existing.backgroundImage);
        setForegroundImage(existing.foregroundImage);
      }
      setLoaded(true);
    });
  }, [isEdit, editId, loaded]);

  useEffect(() => {
    if (isEdit || !ready || topic) return;
    const initial =
      preset && topics.find((t) => t.slug === preset)
        ? preset
        : topics[0]?.slug ?? "";
    setTopic(initial);
  }, [isEdit, ready, preset, topics, topic]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !definition.trim() || !topic) return;
    setBusy(true);
    const post: LearningPost = {
      id: editId ?? `c_${Date.now()}`,
      topic,
      title: title.trim(),
      definition: definition.trim(),
      example: example.trim() || undefined,
      remember: remember.trim() || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      icon: icon || "📝",
      backgroundImage,
      foregroundImage,
    };
    try {
      if (isEdit) await updatePost(post);
      else await addPost(post);
      router.push(`/feed/${topic}`);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!editId) return;
    if (!confirm("Delete this card? This can't be undone.")) return;
    setBusy(true);
    try {
      await deletePost(editId);
      router.push(`/feed/${topic}`);
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent placeholder:text-muted";

  if (authLoading || !ready || !loaded) return null;

  if (!isOwner) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
        You need to sign in to add or edit cards.{" "}
        <Link href="/signin" className="text-accent">Sign in</Link>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
        Create a topic first.{" "}
        <Link href="/add-topic" className="text-accent">+ New topic</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto px-4 py-4 space-y-3">
      <div>
        <label className="text-xs text-muted block mb-1">Topic</label>
        <div className="flex gap-2">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={field + " flex-1"}
          >
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.icon} {t.name}
              </option>
            ))}
          </select>
          <Link
            href="/add-topic"
            className="px-3 rounded-lg bg-surface2 border border-border text-sm flex items-center"
          >
            + New
          </Link>
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
          <label className="text-xs text-muted block mb-1">Title*</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Few-shot prompting"
            className={field}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted block mb-1">Definition*</label>
        <textarea
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          rows={8}
          placeholder="Write as much as you need — the card will scroll."
          className={field}
        />
        <div className="flex items-center justify-between mt-1">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-[11px] text-accent underline-offset-2 hover:underline"
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </button>
          <div className="text-[11px] text-muted">Markdown supported</div>
        </div>

        {showPreview && definition.trim() && (
          <div className="mt-2 rounded-lg border border-border bg-surface2/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted mb-2">
              Preview
            </div>
            <div className="text-[15px] leading-relaxed space-y-2">
              <Markdown>{definition}</Markdown>
            </div>
          </div>
        )}

        <details className="mt-2 text-[11px] text-muted">
          <summary className="cursor-pointer hover:text-text">
            Markdown cheatsheet
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 leading-relaxed">
            <code className="text-accent">- item</code><span>bullet list</span>
            <code className="text-accent">1. item</code><span>numbered list</span>
            <code className="text-accent">- [ ] todo</code><span>checkbox</span>
            <code className="text-accent">**bold**</code><span><b>bold</b></span>
            <code className="text-accent">*italic*</code><span><i>italic</i></span>
            <code className="text-accent">`code`</code><span>inline code</span>
            <code className="text-accent"># Title</code><span>big heading</span>
            <code className="text-accent">## Section</code><span>medium heading</span>
            <code className="text-accent">&gt; note</code><span>callout quote</span>
            <code className="text-accent">[text](url)</code><span>link</span>
            <code className="text-accent">---</code><span>horizontal rule</span>
            <code className="text-accent">&lt;span style=&quot;color:#ec4899&quot;&gt;x&lt;/span&gt;</code>
            <span>inline color</span>
          </div>
          <div className="mt-2 text-[11px]">
            <b>Tip:</b> each bullet must start at the <i>beginning</i> of its line, with a dash + space.
          </div>
        </details>
      </div>

      <div>
        <label className="text-xs text-muted block mb-1">Remember this</label>
        <input
          value={remember}
          onChange={(e) => setRemember(e.target.value)}
          placeholder="One-line takeaway."
          className={field}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ImagePicker
          label="Foreground image"
          value={foregroundImage}
          onChange={setForegroundImage}
          helper="Shown at the top of the card."
        />
        <ImagePicker
          label="Background image"
          value={backgroundImage}
          onChange={setBackgroundImage}
          helper="Subtle backdrop behind text."
        />
      </div>

      <div>
        <label className="text-xs text-muted block mb-1">Tags (comma-separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="patterns, basics"
          className={field}
        />
      </div>

      <button
        type="submit"
        disabled={busy || !title.trim() || !definition.trim() || !topic}
        className="w-full py-3 rounded-xl gradient-accent font-semibold disabled:opacity-40"
      >
        {busy ? "Saving…" : isEdit ? "Update card" : "Save card"}
      </button>

      {isEdit && (
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="w-full py-3 rounded-xl bg-surface2 border border-border text-pink-400 font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Trash2 size={16} /> Delete card
        </button>
      )}
    </form>
  );
}

export default function AddPage() {
  return (
    <main className="min-h-screen bg-bg text-text pb-24">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Plus size={18} />
            <div className="text-sm font-semibold">Card</div>
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <AddForm />
      </Suspense>

      <BottomNav />
    </main>
  );
}
