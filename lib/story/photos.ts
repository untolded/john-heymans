import { photo, type PhotoSlug } from "@/lib/photos";

/** The six stills the stand-in hero film was cut from (public/media/hero.mp4). */
export const STAND_IN_STILLS: PhotoSlug[] = ["stage-point", "heats-pack", "watch", "final-arms", "stage-wide", "audience"];

/** Every photograph the story page itself shows. */
export const PAGE_PHOTOS: PhotoSlug[] = ["track-lying", "lavender-race", "heats-pack", "final-pan", "final-arms", "outdoor-portrait", "stage-wide"];

/** Photographers whose work is on the page, in order of appearance, each once. */
export function pagePhotographers(filmIsStandIn: boolean): string[] {
  const slugs = filmIsStandIn ? [...STAND_IN_STILLS, ...PAGE_PHOTOS] : PAGE_PHOTOS;
  return Array.from(new Set(slugs.map((s) => photo(s).credit)));
}
