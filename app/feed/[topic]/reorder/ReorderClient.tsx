"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, GripVertical, Check } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { BottomNav } from "../../../components/BottomNav";
import { useAllPosts, reorderPosts } from "../../../lib/posts";
import { useAllTopics } from "../../../lib/topics";
import { useAuth } from "../../../lib/auth";
import type { LearningPost } from "../../../data/posts";

export default function ReorderClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { topics, ready } = useAllTopics();
  const all = useAllPosts();
  const { isOwner, loading: authLoading } = useAuth();

  const topic = topics.find((t) => t.slug === slug);
  const topicPosts = useMemo(
    () => all.filter((p) => p.topic === slug),
    [all, slug]
  );

  const [order, setOrder] = useState<LearningPost[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dirty) setOrder(topicPosts);
  }, [topicPosts, dirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((curr) => {
      const oldIdx = curr.findIndex((p) => p.id === active.id);
      const newIdx = curr.findIndex((p) => p.id === over.id);
      if (oldIdx < 0 || newIdx < 0) return curr;
      return arrayMove(curr, oldIdx, newIdx);
    });
    setDirty(true);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      await reorderPosts(order.map((p) => p.id));
      router.push(`/feed/${slug}`);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !ready) return null;

  if (!isOwner) {
    return (
      <main className="min-h-screen bg-bg text-text pb-20">
        <Header slug={slug} />
        <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
          You need to sign in to reorder cards.{" "}
          <Link href="/signin" className="text-accent">Sign in</Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  if (!topic) {
    return (
      <main className="min-h-screen bg-bg text-text pb-20">
        <Header slug={slug} />
        <div className="max-w-md mx-auto px-4 py-20 text-center text-muted">
          Topic not found.
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-text pb-24">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link
            href={`/feed/${slug}`}
            aria-label="Back"
            className="p-1.5 rounded-full hover:bg-surface2"
          >
            <ChevronLeft size={22} />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{topic.icon}</span>
            <div>
              <div className="text-sm font-semibold leading-tight">
                Reorder · {topic.name}
              </div>
              <div className="text-[11px] text-muted">
                {order.length} {order.length === 1 ? "card" : "cards"}
              </div>
            </div>
          </div>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="text-xs px-3 py-1.5 rounded-full gradient-accent font-semibold inline-flex items-center gap-1 disabled:opacity-40"
          >
            <Check size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <p className="max-w-md mx-auto px-4 pt-3 text-xs text-muted">
        On phone: hold the grip handle for a moment, then drag. On laptop: click
        and drag the handle.
      </p>

      <section className="max-w-md mx-auto px-3 py-3 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={order.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {order.map((p, i) => (
              <Row key={p.id} index={i} post={p} />
            ))}
          </SortableContext>
        </DndContext>

        {order.length === 0 && (
          <div className="text-center text-muted py-10">
            No cards in this topic yet.
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

function Header({ slug }: { slug: string }) {
  return (
    <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
      <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
        <Link
          href={`/feed/${slug}`}
          aria-label="Back"
          className="p-1.5 rounded-full hover:bg-surface2"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="text-sm font-semibold">Reorder</div>
      </div>
    </header>
  );
}

function Row({ post, index }: { post: LearningPost; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-2 ${
        isDragging ? "shadow-xl ring-1 ring-accent" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Drag handle"
        className="p-2 text-muted touch-none cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <div className="w-7 text-xs text-muted text-center">{index + 1}</div>
      <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-base shrink-0">
        {post.icon ?? "📘"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{post.title}</div>
        <div className="text-[11px] text-muted truncate">
          {post.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}
        </div>
      </div>
    </div>
  );
}
