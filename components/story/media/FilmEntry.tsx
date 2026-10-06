"use client";

import { useRef } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import type { FilmSource } from "@/lib/story/analytics";
import { useStoryPage } from "../StoryRoot";
import { PlayIcon } from "../icons";
import { useFilmEntry } from "./useFilmEntry";

const t = content.story.film.entries;

/** The frame of the film the entry speaks about, cut from the film itself. */
const STILL = { src: "/story/film/still-stage.jpg", focus: "45% 40%" };

/**
 * A way into the film next to the enquiry. It opens the same player as the hero, counts its own
 * impressions and starts, and fetches the start of the stream when it comes into view. The
 * keynote section has its own entry (KeynoteFilm).
 */
export function FilmEntry({ at }: { at: Extract<FilmSource, "enquiry"> }) {
  const { openFilm } = useStoryPage();
  const ref = useRef<HTMLButtonElement>(null);
  useFilmEntry(ref, at);
  const copy = t[at];
  const still = STILL;

  return (
    <button type="button" ref={ref} className={`film-entry film-entry-${at}`} onClick={() => openFilm(at)}>
      <span className="film-entry-still">
        <Image src={still.src} alt="" fill sizes="(min-width: 992px) 14rem, 40vw" style={{ objectPosition: still.focus }} />
        <span className="film-entry-play" aria-hidden="true">
          <PlayIcon />
        </span>
        <span className="film-entry-time" aria-hidden="true">
          {t.duration}
        </span>
      </span>
      <span className="film-entry-text">
        <span className="film-entry-title">{copy.title}</span>
        <span className="film-entry-note">{copy.note}</span>
      </span>
    </button>
  );
}
