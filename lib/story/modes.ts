/**
 * Three ways to experience the page, decided on mount and again whenever one
 * of the media queries below changes.
 *
 * - cinema-desktop: fine pointer, at least 992px wide, motion allowed. Lenis
 *   smooth scroll, the full stage, every set piece.
 * - cinema-touch: coarse pointer or narrower than 992px, motion allowed.
 *   Native scroll, the stage at 100svh, simplified set pieces.
 * - static: reduced motion, or no JavaScript at all. The server-rendered
 *   stacked layout with every end state visible.
 */

export type Mode = "static" | "cinema-desktop" | "cinema-touch";

const QUERIES = {
  reduce: "(prefers-reduced-motion: reduce)",
  fine: "(pointer: fine)",
  wide: "(min-width: 992px)",
} as const;

export function detectMode(): Mode {
  if (typeof window === "undefined") return "static";
  const forced = forcedMode();
  if (forced) return forced;
  if (matchMedia(QUERIES.reduce).matches) return "static";
  return matchMedia(QUERIES.fine).matches && matchMedia(QUERIES.wide).matches ? "cinema-desktop" : "cinema-touch";
}

/** Calls back whenever one of the mode's media queries changes. Returns the unsubscribe. */
export function watchMode(onChange: () => void): () => void {
  const lists = Object.values(QUERIES).map((q) => matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

/** Development only: ?mode=static and friends, for checking each branch. */
function forcedMode(): Mode | null {
  if (process.env.NODE_ENV !== "development") return null;
  const m = new URLSearchParams(location.search).get("mode");
  return m === "static" || m === "cinema-desktop" || m === "cinema-touch" ? m : null;
}

export const isCinema = (m: Mode | null): m is "cinema-desktop" | "cinema-touch" => m === "cinema-desktop" || m === "cinema-touch";
