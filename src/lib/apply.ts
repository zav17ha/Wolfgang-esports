/**
 * The player & team application (/apply).
 *
 * Every question is defined once here. The form, the server-side validation, the admin view
 * and the CSV export all read from this file, so they always stay in step.
 * Safe to import on the client (no Node APIs).
 */

export type ApplicationType = "individual" | "team";

export const APPLICATION_TYPES: { value: ApplicationType; label: string; description: string }[] = [
  { value: "individual", label: "Individual Player", description: "Apply as a solo player to join one of our rosters." },
  { value: "team", label: "Existing Team", description: "Apply as a full squad to compete under the Wolfgang banner." },
];

export const typeLabel = (t: string) => APPLICATION_TYPES.find((a) => a.value === t)?.label ?? t;

export const OTHER = "Other";

export const GAMES: Record<string, string[]> = {
  PC: ["Call of Duty 4", "VALORANT", "Counter Strike 2", "DOTA 2", "League of Legends", "Overwatch", OTHER],
  Mobile: ["PUBG Mobile", "Free Fire", "Clash Royale", "Mobile Legends", OTHER],
  Console: ["Mortal Kombat 1", "eFOOTBALL", "Tekken", "FC27", "Street Fighter", OTHER],
};
export const PLATFORMS = Object.keys(GAMES);

export type FieldType = "text" | "number" | "tel" | "url" | "textarea" | "select" | "choice" | "multi" | "yesno" | "confirm";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  /** Spans the full width of the form grid. */
  full?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  /** Only shown (and only required) for "Existing Team" applications. */
  teamOnly?: boolean;
  fields: Field[];
}

const YES_NO = ["Yes", "No"];

export const SECTIONS: Section[] = [
  {
    id: "personal",
    title: "Personal information",
    fields: [
      { key: "fullName", label: "Full name", type: "text", required: true },
      { key: "ign", label: "In-game name (IGN)", type: "text", required: true },
      { key: "age", label: "Age", type: "number", required: true, min: 10, max: 60 },
      { key: "country", label: "Country", type: "text", required: true, placeholder: "Sri Lanka" },
      { key: "city", label: "City", type: "text", required: true },
      { key: "whatsapp", label: "WhatsApp number (with country code)", type: "tel", required: true, placeholder: "+94 7X XXX XXXX" },
      { key: "altContact", label: "Alternative contact number", type: "tel" },
    ],
  },
  {
    id: "gaming",
    title: "Gaming information",
    fields: [
      { key: "gameId", label: "In-game ID / UID", type: "text", required: true },
      { key: "currentRank", label: "Current rank", type: "text", required: true },
      { key: "highestRank", label: "Highest rank achieved", type: "text", required: true },
      { key: "mainRole", label: "Main role / position", type: "text", required: true },
      { key: "secondaryRole", label: "Secondary role", type: "text" },
      { key: "experienceYears", label: "Years of gaming experience", type: "number", required: true, min: 0, max: 40 },
      { key: "previousTeam", label: "Previous team / organization", type: "text", full: true },
      { key: "achievements", label: "Competitive achievements", type: "textarea", required: true, full: true, placeholder: "Tournaments, placements, rankings…" },
      { key: "highlightsLink", label: "Gameplay highlights link", type: "url", full: true, placeholder: "YouTube, Twitch, Google Drive…" },
    ],
  },
  {
    id: "availability",
    title: "Availability & commitment",
    fields: [
      { key: "hoursPerDay", label: "How many hours can you play per day?", type: "choice", required: true, full: true, options: ["Less than 2 hours", "2–4 hours", "4–6 hours", "6+ hours"] },
      { key: "practiceDays", label: "What days are you available for practice?", type: "multi", required: true, full: true, options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      { key: "timeAvailable", label: "What time are you usually available?", type: "choice", required: true, full: true, options: ["Morning (6 AM – 12 PM)", "Afternoon (12 – 5 PM)", "Evening (5 – 9 PM)", "Night (9 PM onwards)", "Flexible"] },
      { key: "tournaments", label: "Are you willing to participate in tournaments?", type: "yesno", required: true, options: YES_NO },
      { key: "practices", label: "Are you willing to attend mandatory team practices?", type: "yesno", required: true, options: YES_NO },
      { key: "longTerm", label: "Are you looking for a long-term commitment with Wolfgang Esports?", type: "yesno", required: true, full: true, options: YES_NO },
    ],
  },
  {
    id: "team",
    title: "Team information",
    description: "For existing teams only.",
    teamOnly: true,
    fields: [
      { key: "teamName", label: "Team name", type: "text", required: true },
      { key: "playerCount", label: "Number of players in the team", type: "number", required: true, min: 1, max: 30 },
      { key: "captainName", label: "Team captain's full name", type: "text", required: true },
      { key: "captainIgn", label: "Team captain's IGN", type: "text", required: true },
      { key: "captainWhatsapp", label: "Team captain's WhatsApp number", type: "tel", required: true, placeholder: "+94 7X XXX XXXX" },
      { key: "teamRank", label: "Team's current rank / competitive level", type: "text", required: true },
      { key: "members", label: "List of team members (names and IGNs)", type: "textarea", required: true, full: true, placeholder: "One per line, e.g. Kasun Perera — WG_Kasun" },
      { key: "teamPrevOrg", label: "Previous organization", type: "text", full: true },
      { key: "tournamentExperience", label: "Tournament experience", type: "textarea", required: true, full: true },
      { key: "teamAchievements", label: "Team achievements", type: "textarea", required: true, full: true },
      { key: "teamHighlights", label: "Team gameplay highlights link", type: "url", required: true, full: true, placeholder: "YouTube, Twitch, Google Drive…" },
      { key: "hasSubstitute", label: "Does your team have a substitute player?", type: "yesno", required: true, full: true, options: YES_NO },
    ],
  },
  {
    id: "expectations",
    title: "Organization expectations",
    fields: [
      { key: "whyJoin", label: "Why do you want to join Wolfgang Esports?", type: "textarea", required: true, full: true },
      { key: "bring", label: "What can you bring to our organization?", type: "textarea", required: true, full: true },
      { key: "expectations", label: "What are your expectations from Wolfgang Esports?", type: "textarea", required: true, full: true },
      { key: "representProfessionally", label: "Are you willing to represent Wolfgang Esports professionally?", type: "yesno", required: true, full: true, options: YES_NO },
      { key: "followRules", label: "Are you willing to follow organizational rules and regulations?", type: "yesno", required: true, full: true, options: YES_NO },
    ],
  },
  {
    id: "confirm",
    title: "Final confirmation",
    fields: [
      { key: "confirmAccurate", label: "I confirm that the information provided is accurate.", type: "confirm", required: true, full: true },
      { key: "agreeRules", label: "I agree to follow Wolfgang Esports rules and regulations.", type: "confirm", required: true, full: true },
      { key: "understandNoGuarantee", label: "I understand that submitting this application does not guarantee acceptance.", type: "confirm", required: true, full: true },
      { key: "agreeConduct", label: "I agree to maintain professional behavior while representing Wolfgang Esports.", type: "confirm", required: true, full: true },
    ],
  },
];

export const sectionsFor = (type: ApplicationType | "" | undefined) => SECTIONS.filter((s) => !s.teamOnly || type === "team");

export type AnswerValue = string | string[] | boolean;
export type Answers = Record<string, AnswerValue>;

/** What the form sends: the type, the game and the answers. */
export interface ApplicationInput {
  type: ApplicationType | "";
  platform: string;
  game: string;
  gameOther: string;
  answers: Answers;
}

/** A stored application. */
export interface Application {
  id: string;
  submittedAt: string;
  type: ApplicationType;
  platform: string;
  /** The game name, with the typed name when "Other" was picked. */
  game: string;
  answers: Answers;
}

const MAX = { text: 120, tel: 32, url: 300, textarea: 2000 } as const;

/**
 * Checks an application. Returns the cleaned data, or an error message per field key.
 * Game errors use the key "game", type errors use "type".
 */
export function validateApplication(input: Partial<ApplicationInput>):
  | { ok: true; data: Omit<Application, "id" | "submittedAt"> }
  | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const type = input.type;
  if (type !== "individual" && type !== "team") {
    return { ok: false, errors: { type: "Choose what you're applying for." } };
  }

  const platform = String(input.platform ?? "");
  const pick = String(input.game ?? "");
  const other = String(input.gameOther ?? "").trim().slice(0, MAX.text);
  let game = "";
  if (!GAMES[platform]?.includes(pick)) errors.game = "Choose the game you're applying for.";
  else if (pick === OTHER && !other) errors.game = "Type the name of the game.";
  else game = pick === OTHER ? other : pick;

  const raw = input.answers ?? {};
  const answers: Answers = {};
  for (const section of sectionsFor(type)) {
    for (const f of section.fields) {
      const v = raw[f.key];
      const msg = checkField(f, v);
      if (msg) {
        errors[f.key] = msg;
        continue;
      }
      const clean = cleanValue(f, v);
      if (clean !== undefined) answers[f.key] = clean;
    }
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { type, platform, game, answers } };
}

function isEmpty(v: unknown) {
  return v === undefined || v === null || v === false || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length);
}

function checkField(f: Field, v: unknown): string | null {
  if (f.type === "confirm") return v === true ? null : "Please tick this box to continue.";
  if (isEmpty(v)) return f.required ? "This field is required." : null;

  switch (f.type) {
    case "number": {
      const n = Number(v);
      if (!Number.isFinite(n) || !Number.isInteger(n)) return "Enter a whole number.";
      if (f.min !== undefined && n < f.min) return `Must be at least ${f.min}.`;
      if (f.max !== undefined && n > f.max) return `Must be ${f.max} or less.`;
      return null;
    }
    case "tel": {
      const s = String(v).trim();
      if (s.length > MAX.tel || !/^\+?[0-9 ()-]{7,}$/.test(s)) return "Enter a valid phone number, e.g. +94 77 123 4567.";
      return null;
    }
    case "url": {
      const s = String(v).trim();
      if (s.length > MAX.url) return "That link is too long.";
      try {
        const u = new URL(s);
        if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
      } catch {
        return "Enter a full link starting with https://";
      }
      return null;
    }
    case "select":
    case "choice":
    case "yesno":
      return f.options?.includes(String(v)) ? null : "Choose one of the options.";
    case "multi":
      return Array.isArray(v) && v.every((x) => f.options?.includes(String(x))) ? null : "Choose from the options.";
    case "textarea":
      return String(v).length > MAX.textarea ? `Keep this under ${MAX.textarea} characters.` : null;
    default:
      return String(v).length > MAX.text ? `Keep this under ${MAX.text} characters.` : null;
  }
}

function cleanValue(f: Field, v: unknown): AnswerValue | undefined {
  if (f.type === "confirm") return true;
  if (isEmpty(v)) return undefined;
  if (f.type === "multi") return (f.options ?? []).filter((o) => (v as unknown[]).includes(o));
  if (f.type === "number") return String(Number(v));
  return String(v).trim();
}

/** How an answer reads in the admin and the CSV. */
export function formatAnswer(v: AnswerValue | undefined): string {
  if (v === undefined) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ");
  return v;
}

/** Every column in the CSV export, in form order. */
export function csvColumns(): { key: string; label: string; get: (a: Application) => string }[] {
  const base = [
    { key: "id", label: "Application ID", get: (a: Application) => a.id },
    { key: "submittedAt", label: "Submitted (UTC)", get: (a: Application) => a.submittedAt.replace("T", " ").slice(0, 19) },
    { key: "type", label: "Applying as", get: (a: Application) => typeLabel(a.type) },
    { key: "platform", label: "Platform", get: (a: Application) => a.platform },
    { key: "game", label: "Game", get: (a: Application) => a.game },
  ];
  const fields = SECTIONS.flatMap((s) =>
    s.fields.map((f) => ({ key: f.key, label: f.label, get: (a: Application) => formatAnswer(a.answers[f.key]) })),
  );
  return [...base, ...fields];
}
