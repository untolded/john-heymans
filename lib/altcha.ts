import { createHmac } from "node:crypto";
import { CappedMap, createChallenge, randomInt, verifySolution, type Challenge, type Solution } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

/**
 * ALTCHA proof of work for the enquiry (https://altcha.org, MIT, self-hosted:
 * no account, no third party, no cookie). The server signs a challenge, the
 * visitor's browser spends about a second finding its answer while they type,
 * and the enquiry route checks the answer before it sends anything.
 *
 * Environment:
 *   ALTCHA_HMAC_KEY  a long random secret, for example `openssl rand -hex 32`.
 *                    Without it, development uses a fixed dev-only key (with a
 *                    warning) and production refuses challenges, so the page
 *                    shows John's email address instead of a form that can't send.
 *
 * Work: PBKDF2/SHA-256 at 1,000 iterations per try, and the answer sits at a
 * random try between 4,000 and 8,000 (deterministic mode). About half a second
 * in desktop Chrome, a few seconds on an older phone; checking it is one try.
 */

const ALGORITHM = "PBKDF2/SHA-256";
const COST = 1_000;
export const EXPIRES_SECONDS = 10 * 60;
const DEV_KEY = "dev-only-altcha-key-not-for-production";

let warned = false;

/** The signing secrets, or null when production has none (fail closed). */
function secrets() {
  let key = process.env.ALTCHA_HMAC_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") return null;
    if (!warned) {
      console.warn("[altcha] ALTCHA_HMAC_KEY is not set: using a dev-only key. Set it before deploying.");
      warned = true;
    }
    key = DEV_KEY;
  }
  // One env var, two independent secrets: one signs the challenge, one signs the derived key.
  const derive = (label: string) => createHmac("sha256", key).update(label).digest("hex");
  return { challenge: derive("altcha-challenge"), key: derive("altcha-key") };
}

export const altchaConfigured = () => secrets() !== null;

export async function issueChallenge(): Promise<Challenge | null> {
  const s = secrets();
  if (!s) return null;
  const now = Date.now();
  return createChallenge({
    algorithm: ALGORITHM,
    cost: COST,
    counter: randomInt(8_000, 4_000),
    deriveKey,
    // Signed with the challenge, so the route knows when the visitor first saw the questions.
    data: { t: now },
    expiresAt: Math.floor(now / 1000) + EXPIRES_SECONDS,
    hmacSignatureSecret: s.challenge,
    hmacKeySignatureSecret: s.key,
  });
}

/** Answers already used, kept until their challenge expires, so one solve sends one enquiry. */
const used = new CappedMap<string, number>({ maxSize: 10_000 });

export type Check = { ok: true; issuedAt: number } | { ok: false; reason: "missing" | "invalid" | "expired" | "replay" | "not_configured" };

/** Checks the payload the page sends: base64 JSON of { challenge, solution }. */
export async function checkPayload(raw: unknown): Promise<Check> {
  const s = secrets();
  if (!s) return { ok: false, reason: "not_configured" };
  if (typeof raw !== "string" || !raw || raw.length > 4000) return { ok: false, reason: "missing" };

  let payload: { challenge: Challenge; solution: Solution };
  try {
    payload = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    if (!payload?.challenge?.parameters || !payload?.solution) throw new Error("shape");
  } catch {
    return { ok: false, reason: "invalid" };
  }

  let result;
  try {
    result = await verifySolution({
      challenge: payload.challenge,
      solution: payload.solution,
      deriveKey,
      hmacSignatureSecret: s.challenge,
      hmacKeySignatureSecret: s.key,
    });
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (result.expired) return { ok: false, reason: "expired" };
  if (!result.verified) return { ok: false, reason: "invalid" };

  // Verified, so the signature is genuine and unique to this challenge.
  const id = payload.challenge.signature ?? payload.challenge.parameters.nonce;
  const now = Date.now();
  for (const [k, until] of used) if (until < now) used.delete(k);
  if (used.has(id)) return { ok: false, reason: "replay" };
  used.set(id, (payload.challenge.parameters.expiresAt ?? now / 1000 + EXPIRES_SECONDS) * 1000);

  const t = Number(payload.challenge.parameters.data?.t);
  return { ok: true, issuedAt: Number.isFinite(t) ? t : 0 };
}
