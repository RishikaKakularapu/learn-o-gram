"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImagePicker } from "../components/ImagePicker";
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
        <div className="text-[11px] text-muted mt-1 leading-relaxed">
          Markdown supported: <code className="text-accent">**bold**</code>{" "}
          <code className="text-accent">*italic*</code>{" "}
          <code className="text-accent">`code`</code>{" "}
          <code className="text-accent">- bullet</code>{" "}
          <code className="text-accent"># heading</code>{" "}
          <code className="text-accent">&gt; quote</code>
          . For colors:{" "}
          <code className="text-accent">
            &lt;span style="color:#ec4899"&gt;text&lt;/span&gt;
          </code>
          .
        </div>
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
