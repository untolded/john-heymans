import { createHash } from "node:crypto";
import { content } from "@/lib/content";

/**
 * Booking enquiries. Validates on the server, drops anything that fills the
 * honeypot, allows five enquiries per hour per visitor, and sends one email
 * through Resend. Nothing is stored beyond that email; the rate limit keeps
 * only a hash of the address, in memory, for an hour.
 *
 * Environment:
 *   RESEND_API_KEY  the Resend key (needs DNS records on johnheymans.com)
 *   ENQUIRY_FROM    the sender, for example "Website <enquiries@johnheymans.com>"
 *   ENQUIRY_TO      the inbox, defaults to the address shown on the site
 *
 * Until the key and sender are set, it answers 503 and the page shows the
 * email address instead.
 */

const e = content.story.enquiry;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = (v: string, options: readonly string[]) => v === "" || options.includes(v);

function visitor(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

function limited(id: string) {
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(id, recent);
    return true;
  }
  recent.push(now);
  hits.set(id, recent);
  return false;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Bots fill every field. Pretend it worked and send nothing.
  if (text(body.website, 200)) return Response.json({ ok: true });

  const f = {
    type: text(body.type, 80),
    date: text(body.date, 10),
    dateOpen: body.dateOpen === true,
    size: text(body.size, 40),
    language: text(body.language, 40),
    name: text(body.name, 120),
    org: text(body.org, 160),
    email: text(body.email, 200),
    message: text(body.message, 4000),
  };

  const invalid: string[] = [];
  if (!f.name) invalid.push("name");
  if (!f.org) invalid.push("org");
  if (!EMAIL.test(f.email)) invalid.push("email");
  if (f.date && !DATE.test(f.date)) invalid.push("date");
  if (!oneOf(f.type, e.steps.type.options)) invalid.push("type");
  if (!oneOf(f.size, e.steps.size.options)) invalid.push("size");
  if (!oneOf(f.language, e.steps.language.options)) invalid.push("language");
  if (invalid.length) return Response.json({ error: "invalid", fields: invalid }, { status: 422 });

  if (limited(visitor(request))) return Response.json({ error: "rate_limited" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  const to = process.env.ENQUIRY_TO || e.email;
  if (!key || !from) return Response.json({ error: "not_configured" }, { status: 503 });

  const lines = [
    `Event: ${f.type || "not given"}`,
    `Date: ${f.dateOpen ? "not fixed yet" : f.date || "not given"}`,
    `People in the room: ${f.size || "not given"}`,
    `Language: ${f.language || "not given"}`,
    "",
    `Name: ${f.name}`,
    `Organisation: ${f.org}`,
    `Email: ${f.email}`,
    "",
    f.message || "(no message)",
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: f.email,
      subject: `Enquiry: ${f.type || "an event"}, ${f.org}`,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) return Response.json({ error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
