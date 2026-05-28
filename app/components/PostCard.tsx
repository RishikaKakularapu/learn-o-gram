"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Pencil,
} from "lucide-react";
import type { LearningPost } from "../data/posts";
import { STORAGE_KEYS } from "../lib/storage";
import { useAuth } from "../lib/auth";
import { Markdown } from "./Markdown";

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeSaved(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(ids));
  } catch {}
}

export function PostCard({ post }: { post: LearningPost }) {
  const { isOwner } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(post.id));
  }, [post.id]);

  function toggleSave() {
    const ids = readSaved();
    const next = ids.includes(post.id)
      ? ids.filter((x) => x !== post.id)
      : [post.id, ...ids];
    writeSaved(next);
    setSaved(next.includes(post.id));
  }

  const hasTitle = !!post.title?.trim();
  const hasDef = !!post.definition?.trim();
  const hasExample = !!post.example?.trim();
  const hasRemember = !!post.remember?.trim();
  const hasTags = post.tags.length > 0;
  const hasSource = !!post.source;
  const hasBody = hasDef || hasExample || hasTags || hasSource;
  const imageFocused = !!post.foregroundImage && !hasDef && !hasExample;

  return (
    <article className="min-h-screen w-full flex items-center justify-center px-4 py-6">
      <div className="relative w-full max-w-md h-[68vh] flex flex-col rounded-2xl bg-surface border border-border overflow-hidden shadow-xl">
        {post.backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-black/70" />
          </>
        )}

        {/* Header (pinned) */}
        <div className="relative flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-lg">
            {post.icon ?? "📘"}
          </div>
          {hasTitle ? (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                {post.title}
              </div>
              <div className="text-xs text-muted truncate">
                {post.tags.slice(0, 2).map((t) => `#${t}`).join(" ")}
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}
          {isOwner && (
            <Link
              href={`/add?id=${post.id}`}
              aria-label="Edit"
              className="p-1.5 rounded-full hover:bg-surface2 text-muted"
            >
              <Pencil size={16} />
            </Link>
          )}
        </div>

        {/* Foreground image — fills body when there's no text */}
        {post.foregroundImage &&
          (imageFocused ? (
            <div className="relative flex-1 min-h-0 bg-black/30">
              <img
                src={post.foregroundImage}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative shrink-0">
              <img
                src={post.foregroundImage}
                alt=""
                className="w-full h-40 object-cover"
              />
            </div>
          ))}

        {/* Body — only when there's text/tags/source */}
        {hasBody && (
          <div className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">
            {hasDef && (
              <div className="text-[15px] leading-relaxed space-y-2">
                <Markdown>{post.definition}</Markdown>
              </div>
            )}

            {hasExample && (
              <div className="rounded-xl bg-surface2 border border-border p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                  Example
                </div>
                <div className="text-sm leading-relaxed space-y-2">
                  <Markdown>{post.example ?? ""}</Markdown>
                </div>
              </div>
            )}

            {hasTags && (
              <div className="flex flex-wrap gap-2 pt-1">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/search?tag=${encodeURIComponent(t)}`}
                    className="text-xs px-2 py-1 rounded-full bg-surface2 border border-border text-muted hover:text-text"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {hasSource && (
              <div className="inline-flex items-center gap-1 text-xs text-muted">
                <ExternalLink size={12} />
                {post.source}
              </div>
            )}
          </div>
        )}

        {/* Image-only cards still show tags in a thin strip */}
        {imageFocused && hasTags && (
          <div className="relative shrink-0 px-4 pt-2 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/search?tag=${encodeURIComponent(t)}`}
                className="text-xs px-2 py-1 rounded-full bg-surface2 border border-border text-muted hover:text-text"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {/* Remember (pinned to bottom, optional) */}
        {hasRemember && (
          <div className="relative px-4 pt-2 pb-3 shrink-0">
            <div className="rounded-xl p-[1px] gradient-accent">
              <div className="rounded-xl bg-surface px-3 py-2">
                <div className="text-[11px] uppercase tracking-wider gradient-text font-semibold mb-1">
                  Remember
                </div>
                <div className="text-sm leading-relaxed">
                  <Markdown>{post.remember ?? ""}</Markdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions (pinned) */}
        <div className="relative flex items-center gap-4 px-4 py-3 border-t border-border shrink-0">
          <button
            onClick={() => setLiked((v) => !v)}
            aria-label="Like"
            className="transition-transform active:scale-90"
          >
            <Heart
              size={22}
              className={liked ? "fill-pink-500 text-pink-500" : "text-text"}
            />
          </button>
          <button
            onClick={toggleSave}
            aria-label="Save"
            className="transition-transform active:scale-90"
          >
            <Bookmark
              size={22}
              className={saved ? "fill-accent text-accent" : "text-text"}
            />
          </button>
          <button aria-label="Share" className="transition-transform active:scale-90">
            <Share2 size={22} className="text-text" />
          </button>
        </div>
      </div>
    </article>
  );
}
