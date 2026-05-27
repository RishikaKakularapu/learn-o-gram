"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Shuffle, Bookmark, Plus } from "lucide-react";
import { useAuth } from "../lib/auth";

export function BottomNav() {
  const pathname = usePathname();
  const { isOwner } = useAuth();

  const items = [
    { href: "/", icon: Home, label: "Feed" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/shuffle", icon: Shuffle, label: "Shuffle" },
    { href: "/saved", icon: Bookmark, label: "Saved" },
    ...(isOwner ? [{ href: "/add", icon: Plus, label: "Add" }] : []),
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-bg/85 backdrop-blur border-t border-border">
      <div className="max-w-md mx-auto flex justify-around items-center px-2 py-2">
        {items.map(({ href, icon: Icon, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg ${
                active ? "text-text" : "text-muted"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
