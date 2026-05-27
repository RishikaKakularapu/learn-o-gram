"use client";

import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { BottomNav } from "../components/BottomNav";
import { useAllPosts } from "../lib/posts";

const DAILY_COUNT = 5;

// Stable string hash → unsigned 32-bit int.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function DailyPage() {
  const all = useAllPosts();
  const key = todayKey();

  // Pick DAILY_COUNT cards deterministically for the day.
  const picks = [...all]
    .map((p) => ({ p, score: hash(`${key}:${p.id}`) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.min(DAILY_COUNT, all.length))
    .map((x) => x.p);

  return (
    <main className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Sparkles size={18} className="text-accent" />
            <div>
              <div className="text-sm font-semibold leading-tight">Daily review</div>
              <div className="text-[11px] text-muted">
                {picks.length} {picks.length === 1 ? "card" : "cards"} · refreshes tomorrow
              </div>
            </div>
          </div>
        </div>
      </header>

      {picks.length === 0 ? (
        <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
          No cards yet. Add a few first.
        </div>
      ) : (
        <section className="feed h-[calc(100vh-56px-64px)] overflow-y-auto no-scrollbar pb-16">
          {picks.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </section>
      )}

      <BottomNav />
    </main>
  );
}
