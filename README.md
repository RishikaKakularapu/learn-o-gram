# Learn-o-gram

An Instagram-style feed for revising your own notes. Mobile-first, dark by default.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- lucide-react icons
- Storage: localStorage (custom topics, custom cards, saved, all image data URLs)
- Deploy target: Vercel (free)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or 3001 if 3000 is busy) and use Chrome DevTools "device toolbar" (Cmd+Shift+M) for the intended mobile feel.

## Roadmap

- [x] **M1** — Scaffold + feed UI with mock AI/career-shift cards
- [x] **M2** — Topics + Add / Edit / Delete cards (localStorage)
- [x] **M3** — Search, tag filter, favorites (saved)
- [x] **M4** — Shuffle + Daily review mode
- [x] **M5** — PWA manifest + Vercel deploy

## Routes

| Path | What it does |
|---|---|
| `/` | Topics grid + shortcuts to Daily review and Shuffle |
| `/feed/[topic]` | Snap-scrolling feed for one topic |
| `/search` | Full-text search; `?tag=foo` filters by tag |
| `/shuffle` | Random deck across all topics |
| `/daily` | Deterministic 5 cards for today |
| `/saved` | Cards you've bookmarked |
| `/add` | Create a card; `?id=...` edits an existing one; `?topic=...` prefills topic |
| `/add-topic` | Create a custom topic with icon + gradient |

## Data model

```ts
type LearningPost = {
  id: string;          // seed posts have stable ids; user posts start with "c_"
  topic: string;       // topic slug
  title: string;
  definition: string;
  example?: string;
  remember?: string;   // one-line takeaway
  tags: string[];
  source?: string;
  icon?: string;       // emoji
  backgroundImage?: string; // data URL or http(s)
  foregroundImage?: string; // data URL or http(s)
};

type Topic = {
  slug: string;
  name: string;
  blurb: string;
  icon: string;
  gradient: string;    // tailwind "from-x-### to-y-###"
};
```

Seed content lives in [`app/data/`](app/data); user-created topics and cards live in localStorage under `lg.customTopics`, `lg.customPosts`, and `lg.saved`.

## Deploy to Vercel (free)

```bash
npm i -g vercel        # one-time
vercel                 # follow prompts; pick the project name and "Yes" to defaults
vercel --prod          # promote to production URL
```

Or push to GitHub and "Import Project" on vercel.com — every push to `main` re-deploys automatically.

The app installs as a PWA: open the deployed URL on your phone → "Add to Home Screen".

## Project layout

```
app/
  layout.tsx              # root layout, fonts, metadata
  manifest.ts             # PWA manifest
  page.tsx                # home: topics grid + daily/shuffle shortcuts
  globals.css             # Tailwind + theme
  add/page.tsx            # Create / Edit / Delete a card
  add-topic/page.tsx      # Create a custom topic
  daily/page.tsx          # Today's 5 cards
  feed/[topic]/           # Per-topic snap feed
  saved/page.tsx          # Bookmarked cards
  search/page.tsx         # Search + tag filter
  shuffle/page.tsx        # Random deck
  components/
    PostCard.tsx
    BottomNav.tsx
    ImagePicker.tsx
  data/
    posts.ts              # Seed cards
    topics.ts             # Seed topics
  lib/
    posts.ts              # useAllPosts, add/update/delete custom posts
    topics.ts             # useAllTopics, add/delete custom topics, gradients
    storage.ts            # localStorage keys + generic hook
```

## Storage notes

- localStorage caps around 5–10 MB per origin. Images are auto-compressed (max 1280px, JPEG q=0.82) on upload to keep them ~700KB each.
- When you outgrow localStorage, swap `app/lib/*` for a Supabase free-tier client — the rest of the app shouldn't need changes.
