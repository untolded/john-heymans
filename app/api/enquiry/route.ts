import { createHash } from "node:crypto";
import { content } from "@/lib/content";
import { checkPayload } from "@/lib/altcha";
import { FIELDS, MAX, MIN_FILL_SECONDS, countLinks, problem, type Field } from "@/lib/enquiry-rules";

/**
 * Booking enquiries: name, company or organisation, email, phone (optional)
 * and a free text about the event. One email to John through Resend, with
 * Reply-To set to the visitor. Nothing is stored beyond that email.
 *
 * Spam protection, in order, none of it needing an account or a cookie:
 *   1. Honeypot: a hidden "website" field people never see. Filled: answer ok, send nothing.
 *   2. ALTCHA proof of work (lib/altcha.ts): the browser solves a signed challenge while the
 *      visitor types. Missing, invalid or expired: 400 { error: "captcha" }, the page offers
 *      a retry and the email address. Each solution sends once (replays are refused).
 *   3. Minimum fill time: the challenge carries, signed, when the questions were first on
 *      screen. A send within MIN_FILL_SECONDS of that is a script: answer ok, send nothing.
 *      The page itself never sends that fast, so a person is never dropped.
 *   4. Content: link markup a person never types (BBCode, HTML anchors) or a link in the name
 *      is dropped silently. More than two links in the event text is answered 422 so a person
 *      can trim them. Language or script is never a reason to reject.
 *   5. Rate limit: five enquiries per hour per visitor, keyed by a hash of the IP, in memory.
 *
 * Environment:
 *   RESEND_API_KEY   the Resend key (needs DNS records on johnheymans.com)
 *   ENQUIRY_FROM     the sender, for example "Website <enquiries@johnheymans.com>"
 *   ENQUIRY_TO       the inbox, defaults to the address shown on the site
 *   ALTCHA_HMAC_KEY  signs the proof-of-work challenges (`openssl rand -hex 32`); dev falls
 *                    back to a dev-only key, production without it answers 503
 *
 * Until the Resend key and sender are set, it answers 503 and the page shows
 * the email address instead.
 */

const e = content.story.enquiry;
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();
/** Link markup that comes from spam tools, never from someone typing into a chat. */
const MARKUP = /\[url[=\]]|\[link[=\]]|<a\s+href|\[\/url\]/i;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
/** Accepted, but nothing is sent: what a bot sees is indistinguishable from success. */
const dropped = () => Response.json({ ok: true });

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

  // 1. Bots fill every field. Pretend it worked and send nothing.
  if (text(body.website, 200)) return dropped();

  const f = Object.fromEntries(FIELDS.map((k) => [k, text(body[k], MAX[k])])) as Record<Field, string>;
  const invalid = FIELDS.filter((k) => problem(k, f[k]) !== null);
  if (invalid.length) return Response.json({ error: "invalid", fields: invalid }, { status: 422 });

  // 2. Proof of work.
  const pow = await checkPayload(body.altcha);
  if (!pow.ok) {
    if (pow.reason === "not_configured") return Response.json({ error: "not_configured" }, { status: 503 });
    return Response.json({ error: "captcha", reason: pow.reason }, { status: 400 });
  }

  // 3. Faster than a person can read five questions.
  if (Date.now() - pow.issuedAt < MIN_FILL_SECONDS * 1000) return dropped();

  // 4. Markup only spam tools write, or a link where a name goes.
  if (FIELDS.some((k) => MARKUP.test(f[k])) || countLinks(f.name) > 0) return dropped();

  // 5. Five an hour from one visitor.
  if (limited(visitor(request))) return Response.json({ error: "rate_limited" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  const to = process.env.ENQUIRY_TO || e.email;
  if (!key || !from) return Response.json({ error: "not_configured" }, { status: 503 });

  const lines = [
    `Name: ${f.name}`,
    `Company or organisation: ${f.org}`,
    `Email: ${f.email}`,
    `Phone: ${f.phone || "not given"}`,
    "",
    "About the event:",
    f.event,
    "",
    "Reply to this email to answer them directly.",
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: f.email,
      subject: `Enquiry from ${f.name}, ${f.org}`,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) return Response.json({ error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
