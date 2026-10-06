"use client";

import { useEffect, useRef } from "react";
import { credits } from "@/lib/story/credits";
import { useLoadGate, useWarm } from "@/lib/story/media";
import { footageCredit } from "@/lib/story/footage";
import { sourcesFor } from "@/lib/story/video";
import type { BeatId, Moment } from "@/lib/story/beats";

/**
 * A full-bleed, muted loop on the stage: a landscape cut for wide screens and
 * the camera's own vertical frame for portrait ones. Nothing of it loads with
 * the page: the poster and the clip are fetched once the scroll is about a
 * screen and a half from the moment it appears (see useWarm), and only the
 * one cut that fits the screen. It plays only while it can be seen, always
 * from its first frame, and never before it can play (see playWhile). Each
 * poster is the first frame of its own cut, so the hand-over is invisible.
 */
export function VideoLayer({
  name,
  beat,
  appear,
  className,
  preload = "none",
  rate = 1,
}: {
  name: string;
  beat: BeatId;
  /** The moment the clip first shows; it loads as the scroll approaches it. Defaults to the beat's start. */
  appear?: Moment;
  className?: string;
  /** "auto" loads with the page; "none" (the default) loads as the scroll approaches `appear`. */
  preload?: "auto" | "none";
  /** Below 1 for slow motion. */
  rate?: number;
}) {
  const gate = useLoadGate(beat);
  const warm = useWarm(appear ?? [beat, 0], gate.load, preload === "auto");
  const ref = useRef<HTMLVideoElement>(null);
  // One cut, chosen when it is first needed, so the browser never weighs up (or fetches) both.
  const cut = warm.poster ? `/story/kenya/${name}${warm.portrait ? "-portrait" : ""}` : null;

  useEffect(() => {
    const v = ref.current;
    if (!v || !cut || !warm.video || v.dataset.loading) return;
    v.dataset.loading = "true";
    v.preload = "auto";
    v.load();
  }, [cut, warm.video]);

  return (
    <div className={`L L-media video-layer ${className ?? ""}`} data-video={name}>
      <div className="pl-inner">
        {gate.load && (
          <video
            ref={ref}
            className="vl-video"
            muted
            loop
            playsInline
            preload="none"
            poster={cut ? `${cut}.jpg` : undefined}
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(e) => {
              e.currentTarget.defaultPlaybackRate = rate;
              e.currentTarget.playbackRate = rate;
            }}
          >
            {cut && warm.video && sourcesFor(cut, false).map((s) => <source key={s.src} src={s.src} type={s.type} />)}
          </video>
        )}
      </div>
    </div>
  );
}

/** Longest a visible clip waits for enough data before playing anyway (a browser that will not buffer until play()). */
const PATIENCE = 1500;

/**
 * Plays a layer's video while it is visible and pauses it otherwise; reports
 * its credit to the frame. Out of sight the clip goes back to its first
 * frame, so every entry, from above or below, starts the shot from the top
 * and never shows a jump from the poster to a frame somewhere in the middle.
 */
export function playWhile(layer: HTMLElement | undefined, visible: number, id: string) {
  const v = layer?.querySelector("video");
  credits.report(id, footageCredit(), visible > 0.25 ? Math.max(visible, 0.51) : 0);
  if (!v) return;
  const want = visible > 0.02;
  if (v.dataset.want === String(want)) return;
  v.dataset.want = String(want);
  if (!want) {
    v.pause();
    if (v.readyState > 0 && v.currentTime > 0) v.currentTime = 0;
    return;
  }
  start(v);
}

function start(v: HTMLVideoElement) {
  const go = () => {
    if (v.dataset.want !== "true" || !v.paused) return;
    v.play().catch(() => {});
  };
  if (v.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return go();
  // Not loaded yet (a fast scroll got here first): hold the poster, which is this frame, until it can play.
  const ready = () => {
    v.removeEventListener("canplay", ready);
    clearTimeout(timer);
    go();
  };
  const timer = setTimeout(ready, PATIENCE);
  v.addEventListener("canplay", ready);
}
