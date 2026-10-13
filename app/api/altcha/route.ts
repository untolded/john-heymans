import { issueChallenge } from "@/lib/altcha";

/**
 * A fresh, signed ALTCHA proof-of-work challenge for the enquiry. The page
 * asks for one when the enquiry first comes into view and solves it in the
 * background; see lib/altcha.ts.
 *
 * Environment:
 *   ALTCHA_HMAC_KEY  required in production (`openssl rand -hex 32`). Without
 *                    it this answers 503 and the enquiry shows the email address.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const challenge = await issueChallenge();
  if (!challenge) return Response.json({ error: "not_configured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  return Response.json(challenge, { headers: { "Cache-Control": "no-store" } });
}
