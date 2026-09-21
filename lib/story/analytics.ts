"use client";

/**
 * Analytics events, whichever provider is chosen (Plausible and Vercel
 * Analytics are both cookie-free). Until one is installed this only logs in
 * development. No personal data ever goes into an event.
 */

export type StoryEvent =
  | "film_opened"
  | "film_sound_on"
  | "story_skipped"
  | "beat_reached"
  | "cta_clicked"
  | "enquiry_step"
  | "enquiry_sent"
  | "clip_opened"
  | "bio_reel_sound";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    va?: (event: "event", payload: { name: string; data?: Props }) => void;
  }
}

export function track(event: StoryEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  window.plausible?.(event, { props });
  window.va?.("event", { name: event, data: props });
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, props);
}
