"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { track } from "@/lib/story/analytics";
import { sourcesFor } from "@/lib/story/video";
import { PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from "./icons";

const r = content.story.bio.reel;
const SOURCES = sourcesFor("/story/reel/about", true);

/**
 * John in his own words: the vertical reel, muted and looping while it is on
 * screen (its captions are burned in), with sound one tap away. Turning the
 * sound on starts it from the top, so the first line is heard. With reduced
 * motion it waits for a tap.
 */
export function BioReel() {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = box.current;
    const v = video.current;
    if (!el || !v) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) v.pause();
        else if (!still && !userPaused.current) void v.play().catch(() => {});
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      void v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const sound = () => {
    const v = video.current;
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      v.currentTime = 0;
      userPaused.current = false;
      void v.play().catch(() => {});
      track("bio_reel_sound");
    } else v.muted = true;
  };

  return (
    <div className="bio-reel" ref={box}>
      <video
        ref={video}
        poster="/story/reel/about-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-label={r.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      >
        {SOURCES.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <div className="reel-controls">
        <button type="button" className="reel-btn reel-sound" onClick={sound} aria-pressed={!muted}>
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          <span>{muted ? r.soundOn : r.soundOff}</span>
        </button>
        <button type="button" className="reel-btn reel-play" onClick={toggle} aria-label={playing ? r.pause : r.play}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </div>
  );
}
