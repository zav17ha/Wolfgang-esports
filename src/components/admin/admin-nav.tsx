"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Posts", Icon: FileText, match: (p: string) => p === "/admin" || p.startsWith("/admin/posts") },
  { href: "/admin/applications", label: "Applications", Icon: Inbox, match: (p: string) => p.startsWith("/admin/applications") },
];

/** Switches between the admin's sections. */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="mb-10 inline-flex rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
      {TABS.map(({ href, label, Icon, match }) => {
        const on = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors",
              on ? "bg-white text-black" : "text-zinc-400 hover:text-white",
            )}
          >
            <Icon className="size-3.5" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
