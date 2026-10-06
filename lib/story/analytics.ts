"use client";

import { statisticsAllowed } from "@/lib/consent";

/**
 * Analytics events, whichever provider is chosen (Plausible and Vercel
 * Analytics are both cookie-free). Until one is installed this only logs in
 * development. No personal data ever goes into an event.
 */

/** Where a film player was opened from: the hero, the card after the story, the enquiry, the corner player. */
export type FilmSource = "hero" | "story" | "enquiry" | "mini";

export type StoryEvent =
  | "film_opened"
  | "film_sound_on"
  /** A play button was properly on screen, once per button per page view. { from } */
  | "film_impression"
  /** The film really started playing, once per opening. { from } */
  | "film_start"
  /** Half and all of the film watched, once each per page view. { pct: 50 | 100, from } */
  | "film_progress"
  /** The enquiry was opened, or sent, after the film started in the same session. { stage, from } */
  | "film_to_enquiry"
  | "story_skipped"
  | "beat_reached"
  | "cta_clicked"
  | "enquiry_step"
  | "enquiry_sent"
  | "clip_opened";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    va?: (event: "event", payload: { name: string; data?: Props }) => void;
  }
}

export function track(event: StoryEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, props);
  // Nothing leaves the browser unless the visitor allowed statistics in the cookie banner.
  if (statisticsAllowed()) {
    window.plausible?.(event, { props });
    window.va?.("event", { name: event, data: props });
  }
  if (event === "film_start") remember(String(props.from ?? ""));
  if (event === "cta_clicked" || event === "enquiry_step") afterFilm("opened");
  if (event === "enquiry_sent") afterFilm("sent");
}

/*
 * film_to_enquiry: the film's job is to move a visitor to the enquiry. Once the film has started
 * in this tab's session, the first enquiry opening (a CTA or the first answer in the inline chat)
 * and the first send each count once. sessionStorage holds only the source of the start.
 */
const KEY = "jh-film-start";

function remember(from: string) {
  try {
    if (!sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, from || "unknown");
  } catch {}
}

function afterFilm(stage: "opened" | "sent") {
  try {
    const from = sessionStorage.getItem(KEY);
    if (!from || sessionStorage.getItem(`${KEY}-${stage}`)) return;
    sessionStorage.setItem(`${KEY}-${stage}`, "1");
    track("film_to_enquiry", { stage, from });
  } catch {}
}
