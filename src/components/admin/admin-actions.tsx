"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      <LogOut /> Sign out
    </Button>
  );
}

export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      aria-label={`Delete ${title}`}
      title="Delete"
      className="grid size-9 place-items-center rounded-md border border-white/[0.08] text-zinc-500 transition-colors hover:border-white/30 hover:text-white disabled:opacity-40"
      onClick={async () => {
        if (!window.confirm(`Delete "${title}"? It will be removed from the blog.`)) return;
        setBusy(true);
        const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, { method: "DELETE" });
        setBusy(false);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          window.alert(j.error || "Could not delete the post.");
          return;
        }
        router.refresh();
      }}
    >
      <Trash2 className="size-4" />
    </button>
  );
}
