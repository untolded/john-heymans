/**
 * The enquiry's rules, shared by the chat (components/story/Enquiry.tsx) and
 * the route that sends it (app/api/enquiry/route.ts), so both check the same
 * things. No dependencies: the page imports this.
 */

export const FIELDS = ["name", "org", "email", "phone", "event"] as const;
export type Field = (typeof FIELDS)[number];

export const MAX: Record<Field, number> = { name: 120, org: 160, email: 200, phone: 40, event: 2000 };

/** Seconds between the first question on screen and a send. Faster than this is a script. */
export const MIN_FILL_SECONDS = 4;

/** Links allowed in the event field. More reads as spam; a person is asked to trim them. */
export const MAX_LINKS = 2;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Loose on purpose: digits, spaces, +, -, dots, slashes and brackets, with 6 to 20 digits. */
const PHONE = /^[\d\s+\-().\/]+$/;
const LINK = /\bhttps?:\/\/|\bwww\.[a-z0-9-]+\./gi;

export const validEmail = (v: string) => EMAIL.test(v.trim());

export function validPhone(v: string) {
  const s = v.trim();
  if (!s) return true;
  const digits = s.replace(/\D/g, "").length;
  return PHONE.test(s) && digits >= 6 && digits <= 20;
}

export const countLinks = (v: string) => v.match(LINK)?.length ?? 0;

/** Why a field is not ready to send, or null when it is. */
export function problem(field: Field, value: string): "required" | "email" | "phone" | "links" | "long" | null {
  const v = value.trim();
  if (v.length > MAX[field]) return "long";
  if (field === "phone") return validPhone(v) ? null : "phone";
  if (!v) return "required";
  if (field === "email" && !validEmail(v)) return "email";
  if (field === "event" && countLinks(v) > MAX_LINKS) return "links";
  return null;
}
