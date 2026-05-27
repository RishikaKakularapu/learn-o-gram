"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Shuffle as ShuffleIcon } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { BottomNav } from "../components/BottomNav";
import { useAllPosts } from "../lib/posts";
import type { LearningPost } from "../data/posts";

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShufflePage() {
  const all = useAllPosts();
  const [deck, setDeck] = useState<LearningPost[]>([]);

  useEffect(() => {
    if (all.length && deck.length === 0) setDeck(shuffleArr(all));
  }, [all, deck.length]);

  return (
    <main className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="flex-1 flex items-center gap-2">
            <ShuffleIcon size={18} />
            <div className="text-sm font-semibold">Shuffle</div>
            <span className="text-[11px] text-muted">{deck.length} cards</span>
          </div>
          <button
            onClick={() => setDeck(shuffleArr(all))}
            className="text-xs px-3 py-1.5 rounded-full gradient-accent font-semibold"
          >
            Reshuffle
          </button>
        </div>
      </header>

      <section className="feed h-[calc(100vh-56px-64px)] overflow-y-auto no-scrollbar pb-16">
        {deck.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </section>

      <BottomNav />
    </main>
  );
}
