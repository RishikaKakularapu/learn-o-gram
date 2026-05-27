"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";
import { useAuth } from "../lib/auth";
import { BottomNav } from "../components/BottomNav";

export default function SignInPage() {
  const { user, isOwner, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await signIn(email.trim());
    setBusy(false);
    if (error) setErr(error);
    else setSent(true);
  }

  return (
    <main className="min-h-screen bg-bg text-text pb-24">
      <header className="sticky top-0 z-10 bg-bg/85 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-2 px-2 py-3">
          <Link href="/" aria-label="Back" className="p-1.5 rounded-full hover:bg-surface2">
            <ChevronLeft size={22} />
          </Link>
          <div className="text-sm font-semibold">Sign in</div>
        </div>
      </header>

      <section className="max-w-md mx-auto px-4 py-8 space-y-4">
        {user ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-surface2 border border-border p-4 text-sm">
              Signed in as <span className="font-semibold">{user.email}</span>
              {!isOwner && (
                <div className="text-xs text-pink-400 mt-2">
                  This email isn't the owner of this app. You can browse but not edit.
                </div>
              )}
            </div>
            <button
              onClick={signOut}
              className="w-full py-3 rounded-xl bg-surface2 border border-border font-semibold"
            >
              Sign out
            </button>
          </div>
        ) : sent ? (
          <div className="rounded-xl gradient-accent p-[1px]">
            <div className="rounded-xl bg-surface p-5 text-center space-y-2">
              <Mail size={28} className="mx-auto text-accent" />
              <div className="font-semibold">Check your email</div>
              <div className="text-sm text-muted">
                We sent a magic link to <span className="text-text">{email}</span>.
                Tap it on this device to finish signing in.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <p className="text-sm text-muted">
              Enter your email to receive a one-time sign-in link. You only need to do this
              once per device.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent placeholder:text-muted"
            />
            {err && <div className="text-xs text-pink-400">{err}</div>}
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="w-full py-3 rounded-xl gradient-accent font-semibold disabled:opacity-40"
            >
              {busy ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
