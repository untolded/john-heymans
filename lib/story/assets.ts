import { existsSync } from "node:fs";
import path from "node:path";
import { sourcesFor, type VideoSource } from "./video";

/**
 * Which media files exist, checked on the server when the page renders. The
 * page prefers the real assets and falls back in the order the build brief
 * sets out, so dropping a file into public/story/film is all it takes.
 *
 *   F2  public/story/film/hero-loop.webm and .mp4               clean landscape loop
 *   F3  public/story/film/hero-loop-portrait.webm and .mp4      clean vertical loop
 *   F1  public/story/film/film.webm and .mp4                    the full film with sound
 *   F4  public/story/film/film.en.vtt                           its English captions
 *   F5  public/story/film/poster.jpg and poster-portrait.jpg   poster frames
 *   F9  public/videos/testimonial-0N.en.vtt                     clip subtitles
 */

const has = (p: string) => existsSync(path.join(process.cwd(), "public", p));

export type FilmAssets = {
  /** Sources for the muted hero loop, best first. */
  loop: VideoSource[];
  /** The vertical loop for portrait screens, best first; empty when there is none. */
  loopPortrait: VideoSource[];
  poster: string;
  posterPortrait: string | null;
  /** The film with sound, best first, or the stand-in when it has not arrived. */
  film: VideoSource[];
  filmIsStandIn: boolean;
  captions: string | null;
  /** True while the hero runs the full film rather than a clean loop, so our text must dodge its titles. */
  loopHasText: boolean;
  /** True while the hero runs the stand-in cut from stills, whose photographers must be credited. */
  loopIsStandIn: boolean;
};

/** The WebM and MP4 of a video, keeping only the files that exist. */
const present = (base: string, audio: boolean) => sourcesFor(base, audio).filter((s) => has(s.src.slice(1)));

export function filmAssets(): FilmAssets {
  const clean = present("/story/film/hero-loop", false);
  const full = present("/story/film/film", true);
  const standIn: VideoSource = { src: "/media/hero.mp4", type: "video/mp4" };

  return {
    loop: clean.length ? clean : full.length ? full : [standIn],
    loopPortrait: present("/story/film/hero-loop-portrait", false),
    poster: has("story/film/poster.jpg") ? "/story/film/poster.jpg" : "/media/hero-poster.jpg",
    posterPortrait: has("story/film/poster-portrait.jpg") ? "/story/film/poster-portrait.jpg" : null,
    film: full.length ? full : [standIn],
    filmIsStandIn: !full.length,
    captions: has("story/film/film.en.vtt") ? "/story/film/film.en.vtt" : null,
    loopHasText: !clean.length && !!full.length,
    loopIsStandIn: !clean.length && !full.length,
  };
}

/** Subtitle file for one of the Supernova clips, if it exists. */
export const clipCaptions = (id: string) => (has(`videos/testimonial-${id}.en.vtt`) ? `/videos/testimonial-${id}.en.vtt` : null);
