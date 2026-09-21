"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { gsap, useGSAP } from "@/lib/story/gsap";
import { track } from "@/lib/story/analytics";
import { useStoryPage } from "../StoryRoot";
import { Dialog } from "../Dialog";
import { PauseIcon, PlayIcon } from "../icons";
import { sourcesFor } from "@/lib/story/video";

const p = content.story.practical;

// The seven Supernova clips. Short ones first: a nine-second clip gets watched.
const CLIPS = [
  { id: "03", seconds: 9 },
  { id: "04", seconds: 15 },
  { id: "07", seconds: 18 },
  { id: "01", seconds: 26 },
  { id: "05", seconds: 44 },
  { id: "02", seconds: 48 },
  { id: "06", seconds: 49 },
];

function Clip({ id, seconds, copy, playing, onOpen }: { id: string; seconds: number; copy: boolean; playing: boolean; onOpen: () => void }) {
  const card = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // Only the clips on screen play, so a wall of video stays cheap.
  useEffect(() => {
    const el = card.current;
    const v = video.current;
    if (!el || !v) return;
    if (!playing) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? void v.play().catch(() => {}) : v.pause()), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [playing]);

  return (
    <button
      ref={card}
      type="button"
      className="clip"
      onClick={onOpen}
      aria-label={fill(p.roomOpen, { s: seconds })}
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
    >
      <video ref={video} poster={`/videos/testimonial-${id}.jpg`} muted loop playsInline preload="none">
        {sourcesFor(`/videos/testimonial-${id}`, true).map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <span className="clip-time" aria-hidden="true">
        {seconds}s
      </span>
    </button>
  );
}

/**
 * The room, in its own words: the seven audience clips as a drifting wall,
 * muted and playing. The drift stops when pointed at, touched or focused,
 * and a visible control pauses the whole wall. A click opens the clip with
 * sound, and with English subtitles once they exist.
 */
export function ClipWall({ captions }: { captions: Record<string, string | null> }) {
  const { cinema } = useStoryPage();
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const tween = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(paused);

  useGSAP(
    () => {
      if (!cinema) return;
      const wall = root.current!.querySelector<HTMLElement>(".wall")!;
      const half = () => wall.scrollWidth / 2;
      tween.current = gsap.fromTo(wall, { x: 0 }, { x: () => -half(), duration: 70, ease: "none", repeat: -1, modifiers: { x: (v) => `${parseFloat(v) % half()}px` } });
      const stop = () => tween.current?.pause();
      const go = () => {
        if (!pausedRef.current) tween.current?.play();
      };
      wall.addEventListener("pointerenter", stop);
      wall.addEventListener("pointerdown", stop);
      wall.addEventListener("pointerleave", go);
      wall.addEventListener("focusin", stop);
      wall.addEventListener("focusout", go);
      return () => {
        tween.current?.kill();
        tween.current = null;
      };
    },
    { scope: root, dependencies: [cinema] },
  );

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) tween.current?.pause();
    else tween.current?.play();
  }, [paused]);

  const current = CLIPS.find((c) => c.id === open);
  const playing = cinema && !paused;

  return (
    <section className="pr pr-room" ref={root} aria-labelledby="pr-room">
      <div className="room-head">
        <h3 id="pr-room" className="pr-h3" data-reveal="rise">
          {p.roomTitle}
        </h3>
        <p className="pr-note">{p.roomNote}</p>
        {cinema && (
          <button type="button" className="round-btn room-pause" onClick={() => setPaused((v) => !v)} aria-label={paused ? p.roomPlay : p.roomPause}>
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
      <div className="room-scroll">
        <div className="wall">
          {(cinema ? [...CLIPS, ...CLIPS] : CLIPS).map((c, i) => (
            <Clip
              key={`${c.id}-${i}`}
              id={c.id}
              seconds={c.seconds}
              copy={i >= CLIPS.length}
              playing={playing}
              onOpen={() => {
                track("clip_opened", { clip: c.id });
                setOpen(c.id);
              }}
            />
          ))}
        </div>
      </div>

      {current && (
        <Dialog title={p.roomDialog} onClose={() => setOpen(null)} closeLabel={content.story.film.close} size="wide">
          <div className="film-frame film-frame-tall">
            <video poster={`/videos/testimonial-${current.id}.jpg`} controls autoPlay playsInline>
              {sourcesFor(`/videos/testimonial-${current.id}`, true).map((s) => (
                <source key={s.src} src={s.src} type={s.type} />
              ))}
              {captions[current.id] && <track kind="subtitles" src={captions[current.id]!} srcLang="en" label="English" default />}
            </video>
          </div>
        </Dialog>
      )}
    </section>
  );
}
