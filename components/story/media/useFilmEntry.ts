"use client";

import { useEffect } from "react";
import { track, type FilmSource } from "@/lib/story/analytics";

/**
 * What a film play button does before it is pressed, so the film starts at once when it is:
 *
 *  - in view (60 percent, once per button): counts film_impression { from }, and when the
 *    browser is idle fetches the player's code and the start of the HLS stream: the master
 *    playlist, the 360p playlist, its init segment and first 2-second segment (about 230 KB).
 *    Both hls.js and Safari start on that rendition, so the first frame is already here.
 *  - pointed at, focused or touched: also fetches hls.js where the browser cannot play HLS
 *    itself, since a click is then likely.
 *
 * Nothing is fetched with Save-Data on or on a 2G connection.
 */

const HLS = "/story/film/hls/";
const FIRST = ["master.m3u8", "360p/index.m3u8", "360p/init_0.mp4", "360p/seg-000.m4s"];

type Connection = { saveData?: boolean; effectiveType?: string };
const frugal = () => {
  const c = (navigator as Navigator & { connection?: Connection }).connection;
  return !!c && (c.saveData === true || /2g/.test(c.effectiveType ?? ""));
};

/** True where the video element plays HLS itself (Safari, iOS, some Android browsers). */
export const nativeHls = () => typeof document !== "undefined" && document.createElement("video").canPlayType("application/vnd.apple.mpegurl") !== "";

let warmed = false;
/** The player's code and the first seconds of the stream, once per page view. */
export function warmFilm() {
  if (warmed || frugal()) return;
  warmed = true;
  void import("./FilmModal").catch(() => {});
  for (const f of FIRST) {
    // Low priority, so it never competes with what the visitor is looking at. The response
    // lands in the HTTP cache (the HLS folder is cached for a day, next.config.ts).
    fetch(HLS + f, { priority: "low" } as RequestInit).catch(() => {});
  }
}

let hlsWarmed = false;
/** hls.js itself, only where it will be needed. */
export function warmHls() {
  if (hlsWarmed || frugal() || nativeHls()) return;
  hlsWarmed = true;
  void import("hls.js/light").catch(() => {});
}

/** After the page has loaded and the browser is idle, so the stream never competes with the first paint. */
const idle = (fn: () => void) => {
  const go = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 2500 });
    else window.setTimeout(fn, 600);
  };
  if (document.readyState === "complete") go();
  else addEventListener("load", go, { once: true });
};

/** Wires the above to a play button. Use it on every element that opens the film. */
export function useFilmEntry(ref: React.RefObject<HTMLElement | null>, from: FilmSource) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        track("film_impression", { from });
        idle(warmFilm);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    const intent = () => {
      warmFilm();
      warmHls();
    };
    el.addEventListener("pointerenter", intent);
    el.addEventListener("focusin", intent);
    el.addEventListener("touchstart", intent, { passive: true });
    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", intent);
      el.removeEventListener("focusin", intent);
      el.removeEventListener("touchstart", intent);
    };
  }, [ref, from]);
}
