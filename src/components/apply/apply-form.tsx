"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Gamepad2, Loader2, Monitor, Smartphone, User, Users } from "lucide-react";

import {
  APPLICATION_TYPES,
  GAMES,
  OTHER,
  PLATFORMS,
  type AnswerValue,
  type Answers,
  type ApplicationType,
  type Field,
  type Section,
  sectionsFor,
  validateApplication,
} from "@/lib/apply";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HudCorners } from "@/components/site/hud";

const DRAFT_KEY = "wg-apply-draft-v1";
const PLATFORM_ICONS: Record<string, typeof Monitor> = { PC: Monitor, Mobile: Smartphone, Console: Gamepad2 };

type Draft = { type: ApplicationType | ""; platform: string; game: string; gameOther: string; answers: Answers };
const EMPTY: Draft = { type: "", platform: "", game: "", gameOther: "", answers: {} };

const inputCls =
  "h-11 w-full rounded-md border bg-white/[0.02] px-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-white/50 focus:bg-white/[0.04]";
const chipBase = "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors duration-200";
const chipOn = "border-white bg-white text-black";
const chipOff = "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white";

export function ApplyForm() {
  const [d, setD] = useState<Draft>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState<{ id: string; whatsapp: string } | null>(null);
  const loaded = useRef(false);

  // Restore an unfinished application from this browser, then keep saving it as they type.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setD({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current || done) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {}
  }, [d, done]);

  const sections = sectionsFor(d.type);
  const check = useMemo(() => validateApplication(d), [d]);
  const liveErrors = check.ok ? {} : check.errors;
  const errors = showErrors ? { ...serverErrors, ...liveErrors } : {};

  const setAnswer = (key: string, v: AnswerValue) => {
    setServerErrors((e) => ({ ...e, [key]: "" }));
    setD((p) => ({ ...p, answers: { ...p.answers, [key]: v } }));
  };

  const sectionDone = (s: Section) => s.fields.every((f) => !liveErrors[f.key]);
  const gameDone = d.type !== "" && !liveErrors.game;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowErrors(true);
    setMessage("");
    if (!check.ok) {
      setStatus("error");
      setMessage("Please complete the highlighted fields.");
      focusFirstError(Object.keys(check.errors));
      return;
    }
    setStatus("sending");
    try {
      const website = new FormData(e.currentTarget).get("website");
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, website }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(j.error || "Something went wrong. Please try again.");
        if (j.errors) {
          setServerErrors(j.errors);
          focusFirstError(Object.keys(j.errors));
        }
        return;
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setDone({ id: j.id, whatsapp: String(d.answers.whatsapp ?? "") });
      setD(EMPTY);
      setShowErrors(false);
      setStatus("idle");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Check your connection and try again.");
    }
  }

  if (done) return <Success id={done.id} whatsapp={done.whatsapp} onAgain={() => setDone(null)} />;

  return (
    <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Progress */}
      <aside className="hidden lg:col-span-3 lg:block">
        <ol className="sticky top-28 space-y-1">
          <ProgressItem n={1} label="Application type" done={gameDone} href="#s-type" />
          {d.type &&
            sections.map((s, i) => <ProgressItem key={s.id} n={i + 2} label={s.title} done={sectionDone(s)} href={`#s-${s.id}`} />)}
        </ol>
      </aside>

      <div className="min-w-0 space-y-6 lg:col-span-9">
        {/* 01 · Application type */}
        <SectionCard id="type" n={1} title="Application type">
          <Question label="What are you applying for?" error={errors.type}>
            <div className="grid gap-3 sm:grid-cols-2">
              {APPLICATION_TYPES.map((t) => {
                const on = d.type === t.value;
                const Icon = t.value === "team" ? Users : User;
                return (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setD((p) => ({ ...p, type: t.value }))}
                    className={cn(
                      "group relative flex items-start gap-4 overflow-hidden rounded-xl border p-5 text-left transition-colors duration-200",
                      on ? "border-white bg-white text-black" : "border-white/10 bg-white/[0.02] hover:border-white/30",
                    )}
                  >
                    <span className={cn("clip-chamfer-sm grid size-11 shrink-0 place-items-center", on ? "bg-black text-white" : "bg-white/[0.06] text-white")}>
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-lg font-semibold tracking-tight", on ? "text-black" : "text-white")}>{t.label}</span>
                      <span className={cn("mt-1 block text-sm leading-relaxed", on ? "text-zinc-700" : "text-zinc-400")}>{t.description}</span>
                    </span>
                    {on && <Check className="absolute top-4 right-4 size-4" />}
                  </button>
                );
              })}
            </div>
          </Question>

          <AnimatePresence initial={false}>
            {d.type && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div id="f-game" className="pt-8">
                  <Question label="Which game are you applying for?" error={errors.game}>
                    <div className="space-y-5">
                      {PLATFORMS.map((pl) => {
                        const Icon = PLATFORM_ICONS[pl] ?? Gamepad2;
                        return (
                          <div key={pl}>
                            <p className="hud-label mb-2.5 flex items-center gap-2">
                              <Icon className="size-3.5" /> {pl}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {GAMES[pl].map((g) => {
                                const on = d.platform === pl && d.game === g;
                                return (
                                  <button
                                    key={g}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => setD((p) => ({ ...p, platform: pl, game: g }))}
                                    className={cn(chipBase, on ? chipOn : chipOff)}
                                  >
                                    {on && <Check className="size-3.5" />}
                                    {g === OTHER ? "Other…" : g}
                                  </button>
                                );
                              })}
                            </div>
                            {d.platform === pl && d.game === OTHER && (
                              <input
                                autoFocus
                                value={d.gameOther}
                                onChange={(e) => setD((p) => ({ ...p, gameOther: e.target.value }))}
                                placeholder={`Which ${pl} game?`}
                                aria-label={`Other ${pl} game`}
                                maxLength={120}
                                className={cn(inputCls, "mt-3 max-w-sm", errors.game ? "border-red-400/60" : "border-white/10")}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Question>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>

        {/* The rest appears once they've chosen individual or team */}
        <AnimatePresence initial={false}>
          {d.type && (
            <motion.div
              key="rest"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {sections.map((s, i) => (
                <SectionCard key={s.id} id={s.id} n={i + 2} title={s.title} description={s.description}>
                  <div className={cn("grid gap-x-5 gap-y-7", s.id !== "confirm" && "sm:grid-cols-2")}>
                    {s.fields.map((f) => (
                      <FieldInput key={f.key} f={f} value={d.answers[f.key]} error={errors[f.key]} onChange={(v) => setAnswer(f.key, v)} />
                    ))}
                  </div>
                </SectionCard>
              ))}

              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              <div className="flex flex-col-reverse gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <p role="status" className={cn("flex items-start gap-2 text-sm", status === "error" ? "text-red-300" : "text-zinc-500")}>
                  {status === "error" && <AlertCircle className="mt-0.5 size-4 shrink-0" />}
                  {message || "Your progress is saved in this browser until you submit."}
                </p>
                <Button type="submit" size="lg" className="min-w-52" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <Loader2 className="animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      Submit application <ArrowRight />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function focusFirstError(keys: string[]) {
  const order = ["type", "game", ...Array.from(document.querySelectorAll<HTMLElement>("[data-field]")).map((el) => el.dataset.field!)];
  const first = order.find((k) => keys.includes(k));
  if (!first) return;
  const el = document.getElementById(`f-${first}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.querySelector<HTMLElement>("input, textarea, button")?.focus({ preventScroll: true });
}

function ProgressItem({ n, label, done, href }: { n: number; label: string; done: boolean; href: string }) {
  return (
    <li>
      <a href={href} className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.03] hover:text-white">
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] transition-colors",
            done ? "border-white bg-white text-black" : "border-white/15 text-zinc-500",
          )}
        >
          {done ? <Check className="size-3.5" /> : String(n).padStart(2, "0")}
        </span>
        <span className={cn(done && "text-white")}>{label}</span>
      </a>
    </li>
  );
}

function SectionCard({ id, n, title, description, children }: { id: string; n: number; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={`s-${id}`} className="relative scroll-mt-28 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.025] to-transparent p-6 sm:p-8">
      <HudCorners size="size-2.5" className="opacity-50" />
      <header className="mb-7 flex items-baseline gap-4 border-b border-white/[0.06] pb-5">
        <span className="font-mono text-xs text-zinc-500">{String(n).padStart(2, "0")}</span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Question({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div id={label.startsWith("What are") ? "f-type" : undefined}>
      <p className="mb-3 text-[15px] font-medium text-zinc-200">{label}</p>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
      <AlertCircle className="size-3.5 shrink-0" /> {children}
    </p>
  );
}

function FieldInput({ f, value, error, onChange }: { f: Field; value: AnswerValue | undefined; error?: string; onChange: (v: AnswerValue) => void }) {
  const id = `in-${f.key}`;
  const border = error ? "border-red-400/60" : "border-white/10";
  const label = (
    <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm text-zinc-300">
      <span>{f.label}</span>
      {!f.required && <span className="shrink-0 font-mono text-[10px] tracking-[0.15em] text-zinc-600 uppercase">Optional</span>}
    </label>
  );
  const wrap = (children: React.ReactNode, withLabel = true) => (
    <div id={`f-${f.key}`} data-field={f.key} className={cn("min-w-0", f.full && "sm:col-span-2")}>
      {withLabel && label}
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );

  switch (f.type) {
    case "textarea":
      return wrap(
        <textarea
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={f.placeholder}
          rows={4}
          maxLength={2000}
          className={cn(inputCls, "h-auto min-h-28 resize-y py-3 leading-relaxed", border)}
        />,
      );

    case "choice":
    case "select":
    case "yesno":
      return wrap(
        <div role="radiogroup" aria-label={f.label} className="flex flex-wrap gap-2">
          {f.options!.map((o) => {
            const on = value === o;
            return (
              <button key={o} type="button" role="radio" aria-checked={on} onClick={() => onChange(o)} className={cn(chipBase, on ? chipOn : chipOff, f.type === "yesno" && "min-w-20 justify-center")}>
                {on && <Check className="size-3.5" />}
                {o}
              </button>
            );
          })}
        </div>,
        true,
      );

    case "multi": {
      const list = Array.isArray(value) ? value : [];
      return wrap(
        <div role="group" aria-label={f.label} className="flex flex-wrap gap-2">
          {f.options!.map((o) => {
            const on = list.includes(o);
            return (
              <button
                key={o}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(on ? list.filter((x) => x !== o) : [...list, o])}
                className={cn(chipBase, on ? chipOn : chipOff)}
              >
                {on && <Check className="size-3.5" />}
                {o}
              </button>
            );
          })}
        </div>,
      );
    }

    case "confirm": {
      const on = value === true;
      return wrap(
        <button
          id={id}
          type="button"
          role="checkbox"
          aria-checked={on}
          onClick={() => onChange(!on)}
          className={cn(
            "flex w-full items-start gap-3.5 rounded-xl border p-4 text-left text-[15px] leading-relaxed transition-colors",
            on ? "border-white/40 bg-white/[0.05] text-white" : cn("bg-white/[0.015] text-zinc-300 hover:border-white/25", error ? "border-red-400/50" : "border-white/[0.08]"),
          )}
        >
          <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded border transition-colors", on ? "border-white bg-white text-black" : "border-white/30")}>
            {on && <Check className="size-3.5" />}
          </span>
          {f.label}
        </button>,
        false,
      );
    }

    default:
      return wrap(
        <input
          id={id}
          type={f.type === "number" ? "number" : f.type === "url" ? "url" : f.type === "tel" ? "tel" : "text"}
          inputMode={f.type === "number" ? "numeric" : f.type === "tel" ? "tel" : undefined}
          min={f.min}
          max={f.max}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={f.placeholder}
          maxLength={f.type === "url" ? 300 : 120}
          autoComplete={f.key === "fullName" ? "name" : f.key === "whatsapp" ? "tel" : f.key === "country" ? "country-name" : f.key === "city" ? "address-level2" : "off"}
          className={cn(inputCls, border)}
        />,
      );
  }
}

function Success({ id, whatsapp, onAgain }: { id: string; whatsapp: string; onAgain: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#121212] to-black p-8 text-center sm:p-12"
    >
      <HudCorners size="size-4" className="opacity-60" />
      <span className="clip-chamfer mx-auto grid size-16 place-items-center bg-white text-black">
        <Check className="size-7" />
      </span>
      <h2 className="mt-7 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Application received.</h2>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-zinc-400">
        Thanks for applying to Wolfgang e-Sports. We review every application, and if you&apos;re shortlisted we&apos;ll contact you
        on WhatsApp{whatsapp ? <> at <span className="text-white">{whatsapp}</span></> : null}.
      </p>
      <p className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs tracking-[0.15em] text-zinc-300 uppercase">
        Reference <span className="text-white">{id}</span>
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button size="lg" variant="outline" onClick={onAgain}>
          Submit another
        </Button>
      </div>
    </motion.div>
  );
}
