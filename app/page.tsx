"use client";

import Link from "next/link";
import { Plus, Sparkles, Shuffle, LogIn, LogOut } from "lucide-react";
import { useAllTopics } from "./lib/topics";
import { useAllPosts } from "./lib/posts";
import { useAuth } from "./lib/auth";
import { BottomNav } from "./components/BottomNav";

export default function Home() {
  const { topics } = useAllTopics();
  const posts = useAllPosts();
  const { isOwner, user, signOut } = useAuth();

  return (
    <main className="min-h-screen bg-bg text-text pb-20">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold gradient-text tracking-tight">
              Learn-o-gram
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Pick a topic. Scroll the cards. Remember more.
            </p>
          </div>
          {isOwner ? (
            <button
              onClick={signOut}
              aria-label="Sign out"
              title={user?.email ?? ""}
              className="p-2 rounded-full bg-surface2 border border-border text-muted hover:text-text"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <Link
              href="/signin"
              aria-label="Sign in"
              className="p-2 rounded-full bg-surface2 border border-border text-muted hover:text-text"
            >
              <LogIn size={16} />
            </Link>
          )}
        </div>
      </header>

      <section className="max-w-md mx-auto px-4 pt-4 grid grid-cols-2 gap-3">
        <Link
          href="/daily"
          className="rounded-2xl p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Sparkles size={20} />
          <div>
            <div className="text-sm font-semibold leading-tight">Daily review</div>
            <div className="text-[11px] text-white/80">5 cards for today</div>
          </div>
        </Link>
        <Link
          href="/shuffle"
          className="rounded-2xl p-4 bg-surface2 border border-border flex items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Shuffle size={20} />
          <div>
            <div className="text-sm font-semibold leading-tight">Shuffle</div>
            <div className="text-[11px] text-muted">Random deck</div>
          </div>
        </Link>
      </section>

      <section className="max-w-md mx-auto px-4 py-5 grid grid-cols-2 gap-3">
        {topics.map((t) => {
          const count = posts.filter((p) => p.topic === t.slug).length;
          return (
            <Link
              key={t.slug}
              href={`/feed/${t.slug}`}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-border active:scale-[0.98] transition-transform"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-90`} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative h-full flex flex-col justify-between p-3">
                <div className="text-3xl">{t.icon}</div>
                <div>
                  <div className="text-[15px] font-semibold leading-tight">{t.name}</div>
                  <div className="text-[11px] text-white/80 mt-0.5">
                    {count} {count === 1 ? "card" : "cards"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {isOwner && (
          <Link
            href="/add-topic"
            className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted hover:text-text hover:border-accent active:scale-[0.98] transition-all"
          >
            <Plus size={26} />
            <span className="text-xs font-medium">New topic</span>
          </Link>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
