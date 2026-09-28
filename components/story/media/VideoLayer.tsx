"use client";

import { credits } from "@/lib/story/credits";
import { useLoadGate } from "@/lib/story/media";
import { footageCredit } from "@/lib/story/footage";
import { sourcesFor } from "@/lib/story/video";
import type { BeatId } from "@/lib/story/beats";

/**
 * A full-bleed, muted loop on the stage: a landscape cut for wide screens and
 * the camera's own vertical frame for portrait ones. It mounts when the load
 * queue reaches its beat and only plays while it can be seen (see playWhile).
 */
export function VideoLayer({
  name,
  beat,
  className,
  preload = "auto",
  rate = 1,
}: {
  name: string;
  beat: BeatId;
  className?: string;
  /** "none" for a clip that should not load until it first plays. */
  preload?: "auto" | "none";
  /** Below 1 for slow motion. */
  rate?: number;
}) {
  const gate = useLoadGate(beat);
  const base = `/story/kenya/${name}`;
  return (
    <div className={`L L-media video-layer ${className ?? ""}`} data-video={name}>
      <div className="pl-inner">
        {gate.load && (
          <video
            className="vl-video"
            muted
            loop
            playsInline
            preload={preload}
            poster={`${base}.jpg`}
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(e) => {
              e.currentTarget.defaultPlaybackRate = rate;
              e.currentTarget.playbackRate = rate;
            }}
          >
            {sourcesFor(`${base}-portrait`, false).map((s) => (
              <source key={s.src} src={s.src} type={s.type} media="(orientation: portrait)" />
            ))}
            {sourcesFor(base, false).map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        )}
      </div>
    </div>
  );
}

/** Plays a layer's video while it is visible and pauses it otherwise; reports its credit to the frame. */
export function playWhile(layer: HTMLElement | undefined, visible: number, id: string) {
  const v = layer?.querySelector("video");
  credits.report(id, footageCredit(), visible > 0.25 ? Math.max(visible, 0.51) : 0);
  if (!v) return;
  const want = visible > 0.02;
  if (v.dataset.want === String(want)) return;
  v.dataset.want = String(want);
  if (!want) {
    v.pause();
    return;
  }
  // play() also starts the download of a clip that has not loaded yet.
  v.play().catch(() => {});
}
