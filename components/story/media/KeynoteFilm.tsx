"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import type { VideoSource } from "@/lib/story/video";
import { useStoryPage } from "../StoryRoot";
import { PlayIcon } from "../icons";
import { useFilmEntry } from "./useFilmEntry";

const t = content.story.film.entries.keynote;
const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * The film, offered again where the keynote is described: a small silent
 * preview beside the heading with one clear button under it. The preview is
 * the hero's own loop, which the visitor has already downloaded, so it costs
 * nothing; it loads only near the screen, plays only on it, and stays a still
 * frame with reduced motion. Preview and button both open the film with sound.
 */
export function KeynoteFilm({ loop, poster }: { loop: VideoSource[]; poster: string }) {
  const { openFilm } = useStoryPage();
  const button = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useFilmEntry(button, "story");

  useEffect(() => {
    const v = video.current;
    if (!v || matchMedia(REDUCE).matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return void v.pause();
        v.muted = true;
        v.play().catch(() => {});
      },
      { rootMargin: "120px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="keynote-film">
      <button type="button" className="keynote-film-preview" onClick={() => openFilm("story")} tabIndex={-1} aria-hidden="true">
        <Image src={poster} alt="" fill sizes="(min-width: 992px) 24rem, 92vw" />
        <video ref={video} muted loop playsInline preload="none" disablePictureInPicture disableRemotePlayback>
          {loop.map((s) => (
            <source key={s.src} src={s.src} type={s.type} media={s.media} />
          ))}
        </video>
        <span className="film-entry-time">{content.story.film.entries.duration}</span>
      </button>
      <button type="button" ref={button} className="pill pill-amber pill-icon keynote-film-cta" onClick={() => openFilm("story")}>
        <span className="pill-glyph" aria-hidden="true">
          <PlayIcon />
        </span>
        <span>{t.cta}</span>
      </button>
      <p className="keynote-film-note">{t.note}</p>
    </div>
  );
}
