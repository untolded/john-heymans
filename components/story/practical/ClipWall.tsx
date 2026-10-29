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

// The seven Supernova clips (October 2026), each with the speaker's name burned in. Short ones first.
const CLIPS = [
  { id: "02", name: "Erhan Kilicozlu", seconds: 7 },
  { id: "06", name: "Nero Vanbiervliet", seconds: 7 },
  { id: "05", name: "Lucy Izquierdo Greene", seconds: 10 },
  { id: "01", name: "Barbara Soalheiro", seconds: 11 },
  { id: "04", name: "Leen Anthuenis", seconds: 12 },
  { id: "07", name: "Robert Seghers", seconds: 13 },
  { id: "03", name: "Jürgen Ingels", seconds: 13 },
];

function Clip({ id, name, seconds, copy, playing, onOpen }: { id: string; name: string; seconds: number; copy: boolean; playing: boolean; onOpen: () => void }) {
  const card = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  // The poster too waits until the wall is about two screens away: seven stills are half a megabyte.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = card.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "200% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

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
      aria-label={fill(p.roomOpen, { name, s: seconds })}
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
    >
      <video ref={video} poster={near ? `/videos/testimonial-${id}.jpg` : undefined} muted loop playsInline preload="none">
        {/* The wall plays a light, silent preview; the dialog loads the full clip with sound. */}
        {sourcesFor(`/videos/testimonial-${id}-preview`, false).map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      {/* Muted, like a feed: the play button says there is more behind a click, with sound. */}
      <span className="clip-play" aria-hidden="true">
        <PlayIcon />
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
  const syncRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      if (!cinema) return;
      const wall = root.current!.querySelector<HTMLElement>(".wall")!;
      // Measured once and on resize, never per frame: reading scrollWidth in the modifier forced a layout every tick.
      let half = wall.scrollWidth / 2;
      tween.current = gsap.fromTo(wall, { x: 0 }, { x: () => -half, duration: 70, ease: "none", repeat: -1, paused: true, modifiers: { x: (v) => `${parseFloat(v) % half}px` } });
      // The drift runs only while the wall is on screen and nobody is pointing at it, touching or focused in it.
      let onScreen = false;
      let held = false;
      const sync = () => (onScreen && !held && !pausedRef.current ? tween.current?.play() : tween.current?.pause());
      syncRef.current = sync;
      const stop = () => ((held = true), sync());
      const go = () => ((held = false), sync());
      const io = new IntersectionObserver(([entry]) => ((onScreen = entry.isIntersecting), sync()));
      io.observe(wall);
      const ro = new ResizeObserver(() => {
        half = wall.scrollWidth / 2;
        tween.current?.invalidate();
      });
      ro.observe(wall);
      wall.addEventListener("pointerenter", stop);
      wall.addEventListener("pointerdown", stop);
      wall.addEventListener("pointerleave", go);
      wall.addEventListener("focusin", stop);
      wall.addEventListener("focusout", go);
      return () => {
        io.disconnect();
        ro.disconnect();
        syncRef.current = null;
        tween.current?.kill();
        tween.current = null;
      };
    },
    { scope: root, dependencies: [cinema] },
  );

  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  const current = CLIPS.find((c) => c.id === open);
  const playing = cinema && !paused;

  return (
    <section className="pr pr-room" ref={root} aria-labelledby="pr-room">
      <div className="room-head">
        <h3 id="pr-room" className="pr-h3" data-reveal="rise">
          {p.roomTitle}
        </h3>
        <p className="pr-note" data-reveal="fade">
          {p.roomNote}
        </p>
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
              name={c.name}
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
          <div className="clip-frame">
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
