/**
 * Every fact on the story page carries its status and where it came from.
 * Only confirmed values reach visitors. In development, pending values still
 * render, outlined and labelled, so the gaps are visible during review.
 */

export type Status = "confirmed" | "pending";

export type Sourced<T> = {
  value: T;
  status: Status;
  /** e.g. "World Athletics profile, screenshot 2024-06-30" */
  source?: string;
  /** Shape-only stand-in so a chart can be built. Never rendered in production. */
  placeholder?: boolean;
};

/**
 * Pending values render only in development, and never when
 * NEXT_PUBLIC_FACTS=strict, which previews exactly what production shows.
 */
export const SHOW_PENDING = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_FACTS !== "strict";

export const isConfirmed = (s?: Sourced<unknown> | null): boolean => !!s && s.status === "confirmed" && s.value != null;

/** The value if it may be shown, otherwise undefined. */
export function show<T>(s?: Sourced<T> | null): T | undefined {
  if (!s || s.value == null) return undefined;
  if (s.status === "confirmed") return s.value;
  return SHOW_PENDING ? s.value : undefined;
}

/** How a shown value should be marked: nothing, or the development outline. */
export function mark(s?: Sourced<unknown> | null): "" | "pending" | "placeholder" {
  if (!s || s.status === "confirmed" || !SHOW_PENDING) return "";
  return s.placeholder ? "placeholder" : "pending";
}
