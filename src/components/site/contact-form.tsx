"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const topics = ["General", "Partnership", "Players & creators", "Press", "Merch"];

const field =
  "peer w-full border-0 border-b border-white/15 bg-transparent px-0 pt-6 pb-3 text-base text-white outline-none transition-colors placeholder:text-transparent focus:border-white";
const label =
  "pointer-events-none absolute top-6 left-0 text-base text-zinc-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.18em] peer-focus:uppercase peer-focus:text-zinc-400 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:uppercase";

export function ContactForm() {
  const [topic, setTopic] = useState(topics[0]);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mail">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
      setError("Please add your name, a valid email and a message.");
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, topic, website: data.get("website") }),
      });
      if (res.ok) {
        form.reset();
        setState("sent");
        setTimeout(() => setState("idle"), 5000);
        return;
      }
      if (res.status !== 501) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || `Couldn't send. Please email ${site.email}.`);
        setState("idle");
        return;
      }
    } catch {
      // fall through to the email app
    }
    // Email sending isn't configured: open the visitor's email app instead.
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`[${topic}] Enquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
    setState("mail");
    setTimeout(() => setState("idle"), 4000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-9" noValidate>
      <div>
        <p className="hud-label mb-3">What&apos;s it about?</p>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={cn(
                "relative rounded-full border px-4 py-1.5 text-sm transition-colors duration-200",
                topic === t ? "border-white text-black" : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
              )}
            >
              {topic === t && (
                <motion.span layoutId="topic-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-9 sm:grid-cols-2">
        <div className="relative">
          <input id="name" name="name" required placeholder="Name" autoComplete="name" className={field} />
          <label htmlFor="name" className={label}>Your name</label>
        </div>
        <div className="relative">
          <input id="email" name="email" type="email" required placeholder="Email" autoComplete="email" className={field} />
          <label htmlFor="email" className={label}>Email address</label>
        </div>
      </div>

      <div className="relative">
        <textarea id="message" name="message" required placeholder="Message" rows={4} className={cn(field, "resize-none")} />
        <label htmlFor="message" className={label}>How can we help?</label>
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className={cn("text-sm", error ? "text-zinc-200" : "text-zinc-500")} role="status">
          {error || (state === "sent" ? "Message sent. We'll get back to you soon." : "We usually reply within a few days.")}
        </p>
        <Button type="submit" size="lg" className="min-w-44" disabled={state === "sending"}>
          <AnimatePresence mode="wait" initial={false}>
            {state === "sent" || state === "mail" ? (
              <motion.span key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                <Check className="size-4" /> {state === "sent" ? "Sent" : "Opening mail"}
              </motion.span>
            ) : (
              <motion.span key="send" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                {state === "sending" ? "Sending…" : "Send message"} <ArrowRight className="size-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </form>
  );
}
