import { NextResponse } from "next/server";

/**
 * POST /api/contact
 * Sends the contact form to your inbox through Resend (https://resend.com) when
 * RESEND_API_KEY and CONTACT_TO_EMAIL are set. Without them it returns 501 and the
 * form falls back to opening the visitor's email app.
 */

const MAX = { name: 120, email: 200, topic: 40, game: 60, ign: 120, org: 160, message: 5000 };

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const field = (k: keyof typeof MAX) => String(body[k] ?? "").trim().slice(0, MAX[k]);
  const data = {
    name: field("name"), email: field("email"), topic: field("topic"),
    game: field("game"), ign: field("ign"), org: field("org"), message: field("message"),
  };
  // simple bot trap: real users never fill this hidden field
  if (String(body.website ?? "")) return NextResponse.json({ ok: true });

  if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email) || !data.message) {
    return NextResponse.json({ error: "Please add your name, a valid email and a message." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "Email sending is not configured" }, { status: 501 });
  }

  const subject = `[${data.topic || "General"}] Enquiry from ${data.name}`;
  const text = [`Name: ${data.name}`, `Email: ${data.email}`, `Topic: ${data.topic || "General"}`, "", data.message].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Wolfgang Website <onboarding@resend.dev>",
      to: [to],
      reply_to: data.email,
      subject,
      text,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Could not send right now" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
