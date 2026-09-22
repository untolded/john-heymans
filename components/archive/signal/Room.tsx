"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { content } from "@/lib/content";
import { Modal } from "@/components/shared/Modal";

const t = content.signal.room;

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

function Clip({ id, seconds, onOpen }: { id: string; seconds: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // Only the clips on screen play, so a wall of video stays cheap.
  useEffect(() => {
    const el = ref.current;
    const v = video.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button className="clip" ref={ref} onClick={onOpen} aria-label={`${t.hint}, ${seconds} second testimonial`}>
      <video ref={video} src={`/videos/testimonial-${id}.mp4`} poster={`/videos/testimonial-${id}.jpg`} muted loop playsInline preload="metadata" />
      <span className="clip-time">{seconds}s</span>
      <span className="clip-hint">{t.hint}</span>
    </button>
  );
}

/** The audience, in their own words, straight after the talk. */
export function Room() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const wall = root.current!.querySelector<HTMLElement>(".wall")!;
        // The wall drifts. It stops the moment anyone points at it, touches it
        // or tabs into it, so nobody has to chase a moving card.
        const half = () => wall.scrollWidth / 2;
        const tween = gsap.fromTo(wall, { x: 0 }, { x: () => -half(), duration: 60, ease: "none", repeat: -1, modifiers: { x: (v) => `${parseFloat(v) % half()}px` } });
        const stop = () => tween.pause();
        const go = () => tween.play();
        wall.addEventListener("pointerenter", stop);
        wall.addEventListener("pointerdown", stop);
        wall.addEventListener("pointerleave", go);
        wall.addEventListener("focusin", stop);
        wall.addEventListener("focusout", go);
        return () => tween.kill();
      });
    },
    { scope: root },
  );

  const current = CLIPS.find((c) => c.id === open);

  return (
    <section className="room" id="room" ref={root} data-theme="paper" aria-labelledby="room-title">
      <div className="room-head wrap">
        <h2 id="room-title" className="display d-l" data-rise>{t.title}</h2>
        <p className="note">{t.note}</p>
      </div>
      <div className="room-scroll">
        <div className="wall">
          {[...CLIPS, ...CLIPS].map((c, i) => (
            <Clip key={`${c.id}-${i}`} id={c.id} seconds={c.seconds} onOpen={() => setOpen(c.id)} />
          ))}
        </div>
      </div>

      <Modal open={!!current} onClose={() => setOpen(null)} title={t.title} size="wide" closeLabel="Close">
        <div className="film-frame">
          {current && <video src={`/videos/testimonial-${current.id}.mp4`} poster={`/videos/testimonial-${current.id}.jpg`} controls autoPlay playsInline />}
        </div>
      </Modal>
    </section>
  );
}
