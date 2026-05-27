export type Topic = {
  slug: string;
  name: string;
  blurb: string;
  icon: string;
  gradient: string; // tailwind gradient classes
};

export const topics: Topic[] = [
  {
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    blurb: "Patterns, anti-patterns, and tricks that actually move the needle.",
    icon: "✍️",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    slug: "andrej-karpathy",
    name: "Andrej Karpathy",
    blurb: "Notes from his lectures, tweets, and zero-to-hero series.",
    icon: "🎓",
    gradient: "from-amber-400 to-pink-500",
  },
  {
    slug: "codedex-gen-ai",
    name: "Codedex Gen AI",
    blurb: "Course concepts, hands-on bits, and gotchas.",
    icon: "🎮",
    gradient: "from-emerald-400 to-cyan-500",
  },
  {
    slug: "ai-foundations",
    name: "AI Foundations",
    blurb: "Transformers, tokens, embeddings — the core mental model.",
    icon: "🧠",
    gradient: "from-sky-500 to-indigo-500",
  },
  {
    slug: "rag-and-agents",
    name: "RAG & Agents",
    blurb: "Retrieval, tools, and LLMs in a loop.",
    icon: "🤖",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    slug: "career-shift",
    name: "Career Shift",
    blurb: "From CRUD developer to AI engineer.",
    icon: "🧭",
    gradient: "from-teal-400 to-blue-500",
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
