"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Bookmark } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { BottomNav } from "../components/BottomNav";
import { useAllPosts } from "../lib/posts";
import { STORAGE_KEYS } from "../lib/storage";

export default function SavedPage() {
  const all = useAllPosts();
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED);
      setIds(raw ? JSON.parse(raw) : []);
    } catch {}
    setReady(true);
  }, []);

  const saved = all.filter((p) => ids.includes(p.id));

  return (
    <main className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Bookmark size={18} />
            <div className="text-sm font-semibold">Saved</div>
            <span className="text-[11px] text-muted">{saved.length}</span>
          </div>
        </div>
      </header>

      {!ready ? null : saved.length === 0 ? (
        <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
          Nothing saved yet. Tap the bookmark on any card to save it for revision.
        </div>
      ) : (
        <section className="feed h-[calc(100vh-56px-64px)] overflow-y-auto no-scrollbar pb-16">
          {saved.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </section>
      )}

      <BottomNav />
    </main>
  );
}
