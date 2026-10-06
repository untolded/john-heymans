"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { sourcesFor } from "@/lib/story/video";
import { useStoryPage } from "../StoryRoot";
import { PauseIcon, PlayIcon } from "../icons";

const p = content.story.practical;

/**
 * One stage as a silent loop (scripts/encode-video.sh stage): the full house
 * cut from the keynote film, or the small room from a leadership lunch. It loads
 * nothing until it is near the screen and plays only while it is on it. With
 * reduced motion (static mode) it is the first frame, still.
 */
export function StageLoop({ name, sizes }: { name: "small-room" | "full-house"; sizes: string }) {
  const base = `/story/stage/${name}`;
  const { cinema } = useStoryPage();
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!cinema || !v) return;
    if (paused) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? void v.play().catch(() => {}) : v.pause()), { rootMargin: "120px" });
    io.observe(v);
    return () => io.disconnect();
  }, [cinema, paused]);

  if (!cinema) {
    return (
      <span className="venue-video">
        <Image src={`${base}.jpg`} alt="" fill sizes={sizes} />
      </span>
    );
  }

  return (
    <>
      <span className="venue-video">
        {/* The first frame as a lazy image under the video, so nothing loads before the section is near. */}
        <Image src={`${base}.jpg`} alt="" fill sizes={sizes} />
        <video ref={video} muted loop playsInline preload="none" aria-hidden="true">
          {sourcesFor(base, false).map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      </span>
      <button type="button" className="round-btn venue-pause" onClick={() => setPaused((v) => !v)} aria-label={paused ? p.stagePlay : p.stagePause}>
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </>
  );
}
