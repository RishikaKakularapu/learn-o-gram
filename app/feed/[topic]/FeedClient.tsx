"use client";

import Link from "next/link";
import { ChevronLeft, Pencil, ArrowUpDown } from "lucide-react";
import { PostCard } from "../../components/PostCard";
import { BottomNav } from "../../components/BottomNav";
import { useAllPosts } from "../../lib/posts";
import { useAllTopics } from "../../lib/topics";
import { useAuth } from "../../lib/auth";

export default function FeedClient({ slug }: { slug: string }) {
  const { topics, ready } = useAllTopics();
  const all = useAllPosts();
  const { isOwner } = useAuth();
  const topic = topics.find((t) => t.slug === slug);
  const posts = all.filter((p) => p.topic === slug);

  if (!ready) return null;

  if (!topic) {
    return (
      <main className="min-h-screen bg-bg text-text pb-20">
        <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
          <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
            <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
              <ChevronLeft size={22} />
            </Link>
            <div className="text-sm font-semibold">Topic not found</div>
          </div>
        </header>
        <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
          This topic doesn’t exist.{" "}
          <Link href="/" className="text-accent">Back to home</Link>.
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{topic.icon}</span>
            <div>
              <div className="text-sm font-semibold leading-tight">{topic.name}</div>
              <div className="text-[11px] text-muted">
                {posts.length} {posts.length === 1 ? "card" : "cards"}
              </div>
            </div>
          </div>
          {isOwner && (
            <>
              <Link
                href={`/add-topic?slug=${topic.slug}`}
                aria-label="Edit topic"
                className="p-1.5 rounded-full text-muted hover:text-text"
              >
                <Pencil size={16} />
              </Link>
              <Link
                href={`/add?topic=${topic.slug}`}
                className="text-xs px-3 py-1.5 rounded-full gradient-accent font-semibold"
              >
                + Card
              </Link>
            </>
          )}
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
          No cards in this topic yet.
          {isOwner && (
            <>
              {" "}
              <Link href={`/add?topic=${topic.slug}`} className="text-accent">
                Add the first one
              </Link>
              .
            </>
          )}
        </div>
      ) : (
        <section className="feed h-[calc(100vh-56px-64px)] overflow-y-auto no-scrollbar pb-16">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}

      <BottomNav />
    </main>
  );
}
