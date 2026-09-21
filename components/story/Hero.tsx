"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import type { FilmAssets } from "@/lib/story/assets";
import { story } from "@/lib/story/store";
import { scroller } from "@/lib/story/scroll";
import { driver } from "@/lib/story/driver";
import { fill } from "@/lib/story/format";
import { photo } from "@/lib/photos";
import { STAND_IN_STILLS } from "@/lib/story/photos";
import { useStoryPage } from "./StoryRoot";
import { PlayIcon, PauseIcon } from "./icons";

const t = content.story.hero;
const list = new Intl.ListFormat("en-GB", { type: "conjunction" });
const standInPhotographers = Array.from(new Set(STAND_IN_STILLS.map((s) => photo(s).credit)));

/**
 * The film opens the page. The poster paints first (it is the LCP image),
 * the muted loop fades over it when it can play, and the line, sub and film
 * button rise in from CSS alone. The film is the primary action; the enquiry
 * lives in the frame's pill. Autoplay only in cinema modes; the loop always
 * has a visible pause control.
 */
export function Hero({ film }: { film: FilmAssets }) {
  const { cinema, openFilm } = useStoryPage();
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [quiet, setQuiet] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v || !cinema || userPaused.current) return;
    v.muted = true;
    v.play().catch(() => setPlaying(false));
  }, [cinema]);

  // The film fades as the opener takes over, and stops once it is gone.
  useEffect(() => {
    if (!cinema) return;
    const media = section.current?.querySelector<HTMLElement>(".hero-media");
    return story.onBeat("opener", (b) => {
      const v = video.current;
      if (media) media.style.opacity = String(1 - b.show);
      if (!v) return;
      if (b.show >= 1 && !v.paused) v.pause();
      else if (b.show < 1 && v.paused && !userPaused.current && v.readyState > 1) v.play().catch(() => {});
    });
  }, [cinema]);

  // Our line steps aside while the film shows its own titles.
  useEffect(() => {
    const v = video.current;
    const cues = film.loopHasText ? t.quietCues : [];
    if (!v || !cues.length) return;
    const onTime = () => setQuiet(cues.some((c) => v.currentTime >= c.start && v.currentTime < c.end));
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [film.loopHasText]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.muted = true;
      void v.play();
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const begin = () => {
    if (driver.ready()) scroller.to(driver.yAt(0.02), { duration: 1.4 });
    else {
      const first = document.querySelector("#story .sb");
      if (first) scroller.toElement(first);
    }
  };

  const lines = t.line.split(/(?<=\.)\s+/);

  return (
    <section className="hero" id="top" ref={section} aria-label={content.story.a11y.heroRegion} data-quiet={quiet}>
      <div className="hero-media">
        <Image src={film.poster} alt="" fill preload sizes="100vw" className="hero-poster" />
        <video
          ref={video}
          className="hero-video"
          data-ready={canPlay}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setCanPlay(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {film.loopPortrait && <source src={film.loopPortrait} type="video/mp4" media="(orientation: portrait)" />}
          {film.loop.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
        <div className="hero-scrim" />
      </div>

      <div className="hero-copy">
        <h1 className="hero-line">
          {lines.map((line) => (
            <span className="hl" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-sub">{t.sub}</p>
        <button type="button" className="pill pill-amber pill-icon hero-film" onClick={openFilm}>
          <span className="pill-glyph" aria-hidden="true">
            <PlayIcon />
          </span>
          <span>{t.film}</span>
        </button>
      </div>

      <button type="button" className="hero-cue" onClick={begin}>
        <span>{t.scroll}</span>
        <span className="cue-line" aria-hidden="true" />
      </button>

      {film.loopIsStandIn && <p className="hero-credit">{fill(t.standInCredit, { names: list.format(standInPhotographers) })}</p>}

      <button type="button" className="hero-pause" onClick={toggle} aria-label={playing ? t.pause : t.play}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </section>
  );
}
