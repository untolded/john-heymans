import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Which media files exist, checked on the server when the page renders. The
 * page prefers the real assets and falls back in the order the build brief
 * sets out, so dropping a file into public/story/film is all it takes.
 *
 *   F2  public/story/film/hero-loop.webm and hero-loop.mp4    clean landscape loop
 *   F3  public/story/film/hero-loop-portrait.mp4               clean vertical loop
 *   F1  public/story/film/film.mp4                              the full film with sound
 *   F4  public/story/film/film.en.vtt                           its English captions
 *   F5  public/story/film/poster.jpg and poster-portrait.jpg   poster frames
 *   F9  public/videos/testimonial-0N.en.vtt                     clip subtitles
 */

const has = (p: string) => existsSync(path.join(process.cwd(), "public", p));

export type FilmAssets = {
  /** Sources for the muted hero loop, best first. */
  loop: { src: string; type: string }[];
  loopPortrait: string | null;
  poster: string;
  posterPortrait: string | null;
  /** The film with sound, or the stand-in when it has not arrived. */
  film: string;
  filmIsStandIn: boolean;
  captions: string | null;
  /** True while the hero runs the full film rather than a clean loop, so our text must dodge its titles. */
  loopHasText: boolean;
  /** True while the hero runs the stand-in cut from stills, whose photographers must be credited. */
  loopIsStandIn: boolean;
};

export function filmAssets(): FilmAssets {
  const webm = has("story/film/hero-loop.webm") ? "/story/film/hero-loop.webm" : null;
  const mp4 = has("story/film/hero-loop.mp4") ? "/story/film/hero-loop.mp4" : null;
  const full = has("story/film/film.mp4") ? "/story/film/film.mp4" : null;
  const standIn = "/media/hero.mp4";

  const loop: FilmAssets["loop"] = [];
  if (webm) loop.push({ src: webm, type: "video/webm" });
  if (mp4) loop.push({ src: mp4, type: "video/mp4" });
  if (!loop.length) loop.push({ src: full ?? standIn, type: "video/mp4" });

  return {
    loop,
    loopPortrait: has("story/film/hero-loop-portrait.mp4") ? "/story/film/hero-loop-portrait.mp4" : null,
    poster: has("story/film/poster.jpg") ? "/story/film/poster.jpg" : "/media/hero-poster.jpg",
    posterPortrait: has("story/film/poster-portrait.jpg") ? "/story/film/poster-portrait.jpg" : null,
    film: full ?? standIn,
    filmIsStandIn: !full,
    captions: has("story/film/film.en.vtt") ? "/story/film/film.en.vtt" : null,
    loopHasText: !webm && !mp4 && !!full,
    loopIsStandIn: !webm && !mp4 && !full,
  };
}

/** Subtitle file for one of the Supernova clips, if it exists. */
export const clipCaptions = (id: string) => (has(`videos/testimonial-${id}.en.vtt`) ? `/videos/testimonial-${id}.en.vtt` : null);
