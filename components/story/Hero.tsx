"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { getImageProps } from "next/image";
import { content } from "@/lib/content";
import type { FilmAssets } from "@/lib/story/assets";
import { UPRIGHT } from "@/lib/story/video";
import { story } from "@/lib/story/store";
import { scroller } from "@/lib/story/scroll";
import { driver } from "@/lib/story/driver";
import { fill } from "@/lib/story/format";
import { photo } from "@/lib/photos";
import { STAND_IN_STILLS } from "@/lib/story/photos";
import { useStoryPage } from "./StoryRoot";
import { useFilmEntry } from "./media/useFilmEntry";
import { PlayIcon, PauseIcon, SoundOffIcon } from "./icons";

const t = content.story.hero;
const list = new Intl.ListFormat("en-GB", { type: "conjunction" });
const standInPhotographers = Array.from(new Set(STAND_IN_STILLS.map((s) => photo(s).credit)));
const REDUCE = "(prefers-reduced-motion: reduce)";
const WIDE = `not all and ${UPRIGHT}`;
/** Anything that shows a person is here: the moments a browser that blocked autoplay will allow it. */
const GESTURES = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"] as const;

/**
 * The poster, art-directed by shape: the square frame on upright screens, the
 * wide one everywhere else, each served at the width the screen needs and
 * preloaded from the head, so it is the first large paint on the page.
 */
function Poster({ film }: { film: FilmAssets }) {
  const common = { alt: "", fill: true, sizes: "100vw", quality: 75 } as const;
  const { props: wide } = getImageProps({ ...common, src: film.poster });
  const upright = film.posterPortrait ? getImageProps({ ...common, src: film.posterPortrait }).props : null;
  const hint = { as: "image", fetchPriority: "high", imageSizes: "100vw" } as const;
  preload(wide.src, { ...hint, imageSrcSet: wide.srcSet, media: upright ? WIDE : undefined });
  if (upright) preload(upright.src, { ...hint, imageSrcSet: upright.srcSet, media: UPRIGHT });
  return (
    <picture>
      {upright && <source media={UPRIGHT} srcSet={upright.srcSet} sizes={upright.sizes} />}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- getImageProps supplies the optimised img, alt included */}
      <img {...wide} className="hero-poster" fetchPriority="high" loading="eager" />
    </picture>
  );
}

/**
 * The page opens on the film's own first ten seconds: the live commentary from
 * the Paris heat, burned into the picture, cut on "Hey mom, I made it". It is
 * muted and already moving when the page arrives (autoplay in the markup, so it
 * does not wait for React), and it starts again on the first touch or scroll
 * if the browser held it back. With reduced motion no source loads: the poster
 * stays and the play button opens the film.
 *
 * The film with sound is the primary action, a large play button in the
 * middle of the picture; the enquiry lives in the frame's pill.
 */
export function Hero({ film }: { film: FilmAssets }) {
  const { cinema, openFilm } = useStoryPage();
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const watch = useRef<HTMLButtonElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [motion, setMotion] = useState(true);
  const [quiet, setQuiet] = useState(false);
  // The loop's sources join the video once the page has loaded, so the poster (the LCP) never shares
  // the connection with megabytes of video. Adding a source to an empty video starts it loading, and
  // autoplay takes it from there.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const arm = () => setArmed(true);
    if (document.readyState === "complete") arm();
    else addEventListener("load", arm, { once: true });
    return () => removeEventListener("load", arm);
  }, []);

  // Once the sources are in, start at once (autoplay alone waits for a full buffer in some browsers).
  useEffect(() => {
    const v = video.current;
    if (!armed || !v || userPaused.current || matchMedia(REDUCE).matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [armed]);

  // Keep the loop moving: try now, again when it can play, and again on the first sign of a person.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = matchMedia(REDUCE);
    const kick = () => {
      if (reduce.matches || userPaused.current || !v.paused || !v.currentSrc || story.get().beats.prologue.show >= 1) return;
      v.muted = true;
      v.play().catch(() => {});
    };
    const onGesture = () => kick();
    const stopListening = () => GESTURES.forEach((e) => removeEventListener(e, onGesture, { capture: true }));
    GESTURES.forEach((e) => addEventListener(e, onGesture, { capture: true, passive: true }));
    v.addEventListener("playing", stopListening);
    v.addEventListener("canplay", kick);
    // The sources are chosen by shape when the video loads; a turned tablet or a dragged window needs the other cut.
    const upright = matchMedia(UPRIGHT);
    const reshape = () => {
      setCanPlay(false);
      v.load();
    };
    upright.addEventListener("change", reshape);
    const onReduce = () => {
      setMotion(!reduce.matches);
      if (reduce.matches) v.pause();
      else v.load();
    };
    reduce.addEventListener("change", onReduce);
    setMotion(!reduce.matches);
    if (v.readyState >= 3) setCanPlay(true);
    if (!v.paused) setPlaying(true);
    kick();
    return () => {
      stopListening();
      v.removeEventListener("playing", stopListening);
      v.removeEventListener("canplay", kick);
      upright.removeEventListener("change", reshape);
      reduce.removeEventListener("change", onReduce);
    };
  }, []);

  // The film fades as the first page of the story slides over it, and stops once it is gone.
  useEffect(() => {
    if (!cinema) return;
    const media = section.current?.querySelector<HTMLElement>(".hero-media");
    return story.onBeat("prologue", (b) => {
      const v = video.current;
      if (media) media.style.opacity = String(1 - b.show);
      if (!v) return;
      if (b.show >= 1 && !v.paused) v.pause();
      else if (b.show < 1 && v.paused && !userPaused.current && v.currentSrc) v.play().catch(() => {});
    });
  }, [cinema]);

  // Our line steps aside while the film's own words fill the frame.
  useEffect(() => {
    const v = video.current;
    const cues = film.loopHasText ? t.quietCues : [];
    if (!v || !cues.length) return;
    const onTime = () => setQuiet(cues.some((c) => v.currentTime >= c.start && v.currentTime < c.end));
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [film.loopHasText]);

  // Counts the impression and warms the start of the stream once the button is on screen.
  useFilmEntry(watch, "hero");

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.muted = true;
      v.play().catch(() => {});
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
        <div className="hero-screen">
          <Poster film={film} />
          <video
            ref={video}
            className="hero-video"
            data-ready={canPlay}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setCanPlay(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            {armed && film.loop.map((s) => <source key={s.src} src={s.src} type={s.type} media={s.media} />)}
          </video>
          <div className="hero-scrim" />
        </div>
        <button type="button" ref={watch} className="hero-watch" onClick={() => openFilm("hero")}>
          <span className="hero-watch-disc" aria-hidden="true">
            <PlayIcon />
          </span>
          <span className="hero-watch-text">
            <span className="hero-watch-title">{t.watch}</span>
          </span>
        </button>
      </div>

      <div className="hero-copy">
        <p className="hero-context">{t.context}</p>
        <h1 className="hero-line">
          {lines.map((line) => (
            <span className="hl" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
      </div>

      <button type="button" className="hero-cue" onClick={begin}>
        <span>{t.scroll}</span>
        <span className="cue-line" aria-hidden="true" />
      </button>

      {film.loopIsStandIn && <p className="hero-credit">{fill(t.standInCredit, { names: list.format(standInPhotographers) })}</p>}

      <div className="hero-controls">
        <button type="button" className="hero-sound" onClick={() => openFilm("hero")} aria-label={t.soundLabel}>
          <SoundOffIcon />
          <span className="hero-sound-touch" aria-hidden="true">{t.soundTouch}</span>
          <span className="hero-sound-pointer" aria-hidden="true">{t.soundPointer}</span>
        </button>
        {motion && (
          <button type="button" className="hero-pause" onClick={toggle} aria-label={playing ? t.pause : t.play}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </section>
  );
}
