/**
 * The visitor's cookie choice, kept in one first-party cookie for six months
 * (the Belgian and French regulators' usual horizon before asking again).
 * "necessary" means only what the site needs to work; "statistics" also
 * allows counting visits. Nothing on the site measures visits yet: when a tool
 * is added, it must check statisticsAllowed() first (lib/story/analytics.ts
 * already does), and the cookie policy must name it.
 */

export type Consent = "necessary" | "statistics";

export const CONSENT_COOKIE = "jh_consent";
const VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 182;
/** Fired on window when the choice changes, or when the footer asks to see the banner again. */
export const CONSENT_EVENT = "jh:consent";
export const SETTINGS_EVENT = "jh:cookie-settings";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`))?.split("=")[1];
  if (!raw) return null;
  const [version, choice] = decodeURIComponent(raw).split(":");
  return Number(version) === VERSION && (choice === "necessary" || choice === "statistics") ? choice : null;
}

export function saveConsent(choice: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(`${VERSION}:${choice}`)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

export const statisticsAllowed = () => readConsent() === "statistics";

/** Opens the banner again, from the footer's "Cookie settings". */
export const openCookieSettings = () => window.dispatchEvent(new Event(SETTINGS_EVENT));
