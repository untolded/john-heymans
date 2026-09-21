import { photo, type PhotoSlug } from "@/lib/photos";
import { content } from "@/lib/content";
import { SHOW_PENDING } from "./data";

/**
 * A photo's credit. Copyright-free photos (free: true) carry none. Where
 * the photographer is not known yet, development says so on screen and
 * production shows no credit line at all.
 */
export const creditFor = (slug: PhotoSlug) => photo(slug).credit || (SHOW_PENDING && !photo(slug).free ? content.story.dev.creditPending : "");

/** The six stills the stand-in hero film was cut from (public/media/hero.mp4). */
export const STAND_IN_STILLS: PhotoSlug[] = ["stage-point", "heats-pack", "watch", "final-arms", "stage-wide", "audience"];

/** Every photograph the story page itself shows. */
export const PAGE_PHOTOS: PhotoSlug[] = [
  "iten",
  "track-lying",
  "outdoor-portrait",
  "track-laugh",
  "heats-pack",
  "final-pan",
  "final-arms",
  "kit-portrait",
  "shoes",
  "lavender-race",
  "stage-wide",
];

/** Photographers whose work is on the page, in order of appearance, each once. */
export function pagePhotographers(filmIsStandIn: boolean): string[] {
  const slugs = filmIsStandIn ? [...STAND_IN_STILLS, ...PAGE_PHOTOS] : PAGE_PHOTOS;
  return Array.from(new Set(slugs.map((s) => photo(s).credit).filter(Boolean)));
}
