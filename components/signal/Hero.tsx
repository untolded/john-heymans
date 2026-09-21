"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { content } from "@/lib/content";

const t = content.signal.hero;

/**
 * The film, full screen, already running. The promo carries its own titles,
 * so nothing sits on top of it except one line, the sound control and the
 * cue to start scrolling.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    const next = !on;
    v.muted = !next;
    if (next) { v.currentTime = 0; void v.play(); }
    setOn(next);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".hero-bar > *", { opacity: 0, y: 14, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.4 });
        // The film keeps running as the story takes over from it.
        gsap.to(".hero-video", { yPercent: 10, opacity: 0.35, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section className="hero" id="top" ref={root} aria-label="Keynote film">
      <div className="hero-video">
        <video ref={video} src="/media/hero.mp4" poster="/media/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" />
      </div>

      <div className="hero-bar wrap">
        <p className="hero-line">{t.line}</p>
        <motion.button className="sound" onClick={toggle} data-on={on} aria-pressed={on} whileTap={{ scale: 0.97 }}>
          <span className="sound-disc" aria-hidden="true">
            {on ? (
              <span className="sound-bars"><i /><i /><i /><i /></span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
                <path d="M17 8.5a5 5 0 0 1 0 7M20 6a9 9 0 0 1 0 12" />
              </svg>
            )}
          </span>
          {on ? t.soundOff : t.soundOn}
        </motion.button>
      </div>

      <span className="scroll-cue" aria-hidden="true">{t.scroll}<i /></span>
    </section>
  );
}
