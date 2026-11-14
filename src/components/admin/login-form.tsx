"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HudCorners, WolfMark } from "@/components/site/hud";

export function LoginForm({ problems, next }: { problems: string[]; next?: string }) {
  const configured = problems.length === 0;
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error || "Sign-in failed.");
        return;
      }
      const dest = next && next.startsWith("/admin") ? next : "/admin";
      router.replace(dest);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-8 sm:p-10">
      <HudCorners size="size-4" className="opacity-50" />
      <WolfMark className="h-8 w-auto text-white" />
      <p className="hud-label mt-8">{"// Admin access"}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Sign in to the blog</h1>
      <p className="mt-2 text-sm text-zinc-500">Write, edit and publish stories for wolfgangesports.com.</p>

      {!configured && (
        <div className="mt-6 rounded-xl border border-white/15 bg-white/[0.04] p-4 text-sm text-zinc-300">
          <p>Login isn&apos;t set up yet:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs text-white">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="mt-3">
            Fix these in Vercel → Settings → Environment Variables (for the Production environment), then redeploy.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-zinc-300">Username</Label>
          <Input id="username" name="username" autoComplete="username" required autoFocus disabled={!configured} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300">Password</Label>
          <div className="relative">
            <Input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required className="pr-10" disabled={!configured} />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-zinc-200" role="alert">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={busy || !configured}>
          {busy ? "Signing in…" : (<>Sign in <ArrowRight /></>)}
        </Button>
      </form>
      <p className="mt-6 flex items-center gap-2 text-xs text-zinc-600">
        <Lock className="size-3.5" /> Sessions last 7 days on this device.
      </p>
    </div>
  );
}
