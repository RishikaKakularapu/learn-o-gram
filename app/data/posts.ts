export type LearningPost = {
  id: string;
  topic: string; // topic slug
  title: string;
  definition: string;
  example?: string;
  remember?: string;
  tags: string[];
  source?: string;
  icon?: string;
  backgroundImage?: string; // data URL or http(s) URL — full-card backdrop
  foregroundImage?: string; // data URL or http(s) URL — hero image inside the card
};

export const seedPosts: LearningPost[] = [
  // ---------- AI Foundations ----------
  {
    id: "p1",
    topic: "ai-foundations",
    title: "Transformer",
    definition:
      "A neural network architecture built on self-attention. Instead of reading tokens left-to-right, every token attends to every other token in parallel.",
    example:
      "GPT, Claude, and Gemini are all transformer-based. 'Attention' lets the model link 'it' in a sentence back to the right noun several words earlier.",
    remember: "Attention replaces recurrence. Parallel > sequential.",
    tags: ["architecture", "foundations"],
    source: "Vaswani et al., 'Attention Is All You Need' (2017)",
    icon: "🧠",
  },
  {
    id: "p2",
    topic: "ai-foundations",
    title: "Embedding",
    definition:
      "A dense vector representation of a token, sentence, or item. Similar meanings land near each other in vector space.",
    example:
      "vec('king') − vec('man') + vec('woman') ≈ vec('queen'). Used for semantic search, RAG, and clustering.",
    remember: "Embeddings turn meaning into geometry.",
    tags: ["nlp", "rag"],
    icon: "📐",
  },
  {
    id: "p4",
    topic: "ai-foundations",
    title: "Token",
    definition:
      "The atomic unit a language model reads and writes. Usually a sub-word piece — not always a full word.",
    example:
      "'unbelievable' might be ['un', 'believ', 'able']. Pricing and context windows are measured in tokens, not characters.",
    remember: "1 token ≈ 4 chars of English. Budget accordingly.",
    tags: ["foundations"],
    icon: "🔤",
  },
  {
    id: "p5",
    topic: "ai-foundations",
    title: "Context Window",
    definition:
      "The maximum number of tokens a model can consider at once — prompt + response combined.",
    example:
      "A 200k window can fit a whole book, but every extra token costs money and latency.",
    remember: "Bigger window ≠ better answer. Relevance beats volume.",
    tags: ["foundations", "practical"],
    icon: "📏",
  },
  {
    id: "p7",
    topic: "ai-foundations",
    title: "Hallucination",
    definition:
      "When a model generates output that is fluent and confident but factually wrong or fabricated.",
    example: "Asking for a paper citation and getting a real-sounding title with a fake author and year.",
    remember: "LLMs predict plausible text, not truth. Ground with retrieval or tools.",
    tags: ["limits"],
    icon: "👻",
  },

  // ---------- Prompt Engineering ----------
  {
    id: "pe1",
    topic: "prompt-engineering",
    title: "Role + Task + Format",
    definition:
      "The simplest reliable prompt skeleton: tell the model who it is, what to do, and how to shape the output.",
    example:
      "'You are a senior code reviewer. Review this diff. Reply as a bulleted list of issues, severity-tagged.'",
    remember: "Vague prompts give vague answers. Constrain the shape.",
    tags: ["patterns", "basics"],
    icon: "✍️",
  },
  {
    id: "pe2",
    topic: "prompt-engineering",
    title: "Few-shot Examples",
    definition:
      "Show the model 2–5 input/output pairs before the real input. It picks up the pattern faster than any instruction.",
    example:
      "Want JSON output? Paste 3 input → JSON examples first. Beats writing 'reply in JSON' five times.",
    remember: "Examples > explanations. Show, don't tell.",
    tags: ["patterns"],
    icon: "🎯",
  },
  {
    id: "pe3",
    topic: "prompt-engineering",
    title: "Chain-of-Thought",
    definition:
      "Ask the model to think step-by-step before answering. Improves reasoning on math, logic, and multi-step tasks.",
    example: "'Think step by step, then give the final answer on the last line as: Answer: X'",
    remember: "Reasoning tokens are cheap. Use them.",
    tags: ["reasoning"],
    icon: "🧩",
  },
  {
    id: "pe4",
    topic: "prompt-engineering",
    title: "Fine-tuning vs Prompting",
    definition:
      "Prompting steers a model at inference time. Fine-tuning bakes new behavior into the weights via training examples.",
    example: "Try prompting first. Only fine-tune when prompting plateaus and you have ≥1k clean examples.",
    remember: "Prompt → eval → fine-tune. In that order.",
    tags: ["practical"],
    icon: "🎚️",
  },

  // ---------- Andrej Karpathy ----------
  {
    id: "ak1",
    topic: "andrej-karpathy",
    title: "The hottest new programming language is English",
    definition:
      "Karpathy's framing for the shift: natural language is now a way to program computers, with LLMs as the runtime.",
    example: "Cursor, Claude Code, v0 — you describe intent in English; the model produces working code.",
    remember: "Prompts are a new kind of source code. Version them.",
    tags: ["mindset", "quotes"],
    source: "Karpathy on X, 2023",
    icon: "💬",
  },
  {
    id: "ak2",
    topic: "andrej-karpathy",
    title: "Software 2.0",
    definition:
      "Code where the behavior is learned from data (weights) rather than written by humans (instructions).",
    example:
      "A spam filter written as 50 if-statements is 1.0. The same filter trained on a million emails is 2.0.",
    remember: "1.0 = code. 2.0 = weights. 3.0 = prompts.",
    tags: ["mindset"],
    source: "karpathy.medium.com, 2017",
    icon: "🧬",
  },
  {
    id: "ak3",
    topic: "andrej-karpathy",
    title: "Zero-to-Hero: micrograd",
    definition:
      "A tiny autograd engine in ~100 lines of Python. Builds backprop from scratch over a scalar-valued computation graph.",
    example: "Forward pass builds the graph; .backward() walks it in reverse applying the chain rule.",
    remember: "Backprop = chain rule + bookkeeping. That's it.",
    tags: ["fundamentals", "lecture"],
    source: "YouTube: Karpathy 'Neural Networks: Zero to Hero'",
    icon: "🎓",
  },
  {
    id: "ak4",
    topic: "andrej-karpathy",
    title: "Tokenization is everyone's least favorite part",
    definition:
      "Most weird LLM behaviors (counting letters, math, non-English) trace back to how text is split into tokens.",
    example:
      "Ask GPT 'how many r's in strawberry?' — fails because 'strawberry' is one or two tokens, not 10 letters.",
    remember: "When a model behaves oddly, suspect the tokenizer first.",
    tags: ["foundations", "gotchas"],
    icon: "🔤",
  },

  // ---------- Codedex Gen AI ----------
  {
    id: "cd1",
    topic: "codedex-gen-ai",
    title: "Temperature",
    definition:
      "A sampling knob (0 to ~2) that controls randomness. Low = focused and repetitive. High = creative and chaotic.",
    example: "Code generation: 0.0–0.3. Brainstorming taglines: 0.8–1.2.",
    remember: "Boring task → low temp. Creative task → high temp.",
    tags: ["api", "basics"],
    icon: "🌡️",
  },
  {
    id: "cd2",
    topic: "codedex-gen-ai",
    title: "Top-p (nucleus) sampling",
    definition:
      "Instead of picking from all tokens, the model picks from the smallest set whose probabilities sum to p (e.g. 0.9).",
    example: "top_p=0.9 keeps only the most likely options. Cuts off the long tail of nonsense.",
    remember: "Tune temperature OR top-p — usually not both.",
    tags: ["api"],
    icon: "🎲",
  },
  {
    id: "cd3",
    topic: "codedex-gen-ai",
    title: "System prompt vs User prompt",
    definition:
      "System prompt sets persistent behavior (role, rules, style). User prompts are turn-by-turn requests.",
    example:
      "System: 'You are a Python tutor for absolute beginners. Never use jargon.' User: 'What is a variable?'",
    remember: "Rules go in system. Questions go in user.",
    tags: ["api", "basics"],
    icon: "🧷",
  },

  // ---------- RAG & Agents ----------
  {
    id: "p3",
    topic: "rag-and-agents",
    title: "RAG (Retrieval-Augmented Generation)",
    definition:
      "Fetch relevant docs from a vector store, then stuff them into the prompt so the model answers using your data.",
    example:
      "A chatbot for company docs: embed docs → on each question retrieve top-k chunks → send them as context.",
    remember: "RAG = search + prompt. The model doesn't memorize; it reads.",
    tags: ["rag", "patterns"],
    icon: "🔎",
  },
  {
    id: "p8",
    topic: "rag-and-agents",
    title: "Agent",
    definition:
      "An LLM in a loop with tools. It decides what to do, calls a tool, observes the result, and decides again.",
    example: "Claude Code is an agent: reads files, edits them, runs tests, sees output, iterates.",
    remember: "LLM = brain. Tools = hands. Loop = autonomy.",
    tags: ["agents", "patterns"],
    icon: "🤖",
  },
  {
    id: "p9",
    topic: "rag-and-agents",
    title: "Vector Database",
    definition:
      "A database optimized for similarity search over embeddings using approximate nearest-neighbor algorithms.",
    example: "Pinecone, Weaviate, pgvector, Chroma. Insert (id, vector, metadata) → query nearest neighbors.",
    remember: "A search engine for meaning, not keywords.",
    tags: ["rag", "infra"],
    icon: "🗂️",
  },

  // ---------- Career Shift ----------
  {
    id: "p10",
    topic: "career-shift",
    title: "From CRUD to AI engineering",
    definition:
      "The shift isn't a new language — it's a new mental model: probabilistic outputs, evals instead of unit tests, prompts as code.",
    example:
      "Old: 'Did the function return 42?' New: 'On 200 prompts, did the model produce valid JSON 98% of the time?'",
    remember: "Determinism → distributions. Tests → evals. Specs → prompts.",
    tags: ["mindset"],
    icon: "🧭",
  },
  {
    id: "cs2",
    topic: "career-shift",
    title: "Evals are the new unit tests",
    definition:
      "You can't assert exact strings against a stochastic model. Instead, score outputs across a dataset and track the score over time.",
    example:
      "Build a 50-prompt golden set. Each release, run it and log: % valid JSON, % factually correct, avg cost, p95 latency.",
    remember: "If you can't measure it, you can't ship it.",
    tags: ["practice"],
    icon: "📊",
  },
];

export function postsByTopic(slug: string): LearningPost[] {
  return seedPosts.filter((p) => p.topic === slug);
}
