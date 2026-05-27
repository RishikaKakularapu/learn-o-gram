"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, ChevronLeft, X } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { BottomNav } from "../components/BottomNav";
import { useAllPosts } from "../lib/posts";
import { useAllTopics } from "../lib/topics";

function SearchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTag = params.get("tag") ?? "";

  const all = useAllPosts();
  const { topics } = useAllTopics();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState(initialTag);

  useEffect(() => {
    setTag(params.get("tag") ?? "");
  }, [params]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    all.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [all]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle && !tag) return [];
    return all.filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      if (!needle) return true;
      const hay = [
        p.title,
        p.definition,
        p.example ?? "",
        p.remember ?? "",
        p.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q, tag, all]);

  function clearTag() {
    setTag("");
    router.replace("/search");
  }

  return (
    <main className="min-h-screen bg-bg text-text pb-20">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="flex-1 flex items-center gap-2 bg-surface2 rounded-full px-3 py-1.5 border border-border">
            <SearchIcon size={16} className="text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cards, concepts…"
              className="bg-transparent outline-none w-full text-sm placeholder:text-muted"
            />
          </div>
        </div>
        {tag && (
          <div className="max-w-md mx-auto px-3 pb-2 flex items-center gap-2">
            <span className="text-xs text-muted">Filtering by</span>
            <button
              onClick={clearTag}
              className="text-xs px-2 py-1 rounded-full gradient-accent font-semibold inline-flex items-center gap-1"
            >
              #{tag} <X size={12} />
            </button>
          </div>
        )}
      </header>

      {q.trim() === "" && !tag ? (
        <section className="max-w-md mx-auto px-4 py-5 space-y-5">
          <div>
            <div className="text-xs text-muted uppercase tracking-wider mb-2">Topics</div>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/feed/${t.slug}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-surface2 border border-border"
                >
                  {t.icon} {t.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wider mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface2 border border-border text-muted hover:text-text"
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : results.length === 0 ? (
        <div className="max-w-md mx-auto px-4 py-12 text-center text-muted">
          No cards match{q && ` “${q}”`}{tag && ` #${tag}`}.
        </div>
      ) : (
        <section>
          {results.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </section>
      )}

      <BottomNav />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchInner />
    </Suspense>
  );
}
