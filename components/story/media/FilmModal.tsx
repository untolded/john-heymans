"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { content } from "@/lib/content";
import type { FilmAssets } from "@/lib/story/assets";
import { track, type FilmSource } from "@/lib/story/analytics";
import { scroller } from "@/lib/story/scroll";
import { CloseIcon, PauseIcon, PlayIcon } from "../icons";
import { nativeHls } from "./useFilmEntry";

const t = content.story.film;

export type FilmMode = "modal" | "mini";

type Props = {
  film: FilmAssets;
  mode: FilmMode;
  from: FilmSource;
  /** The large player was closed mid-film: carry on in the corner. */
  onMini: () => void;
  /** Gone: closed at the end, or stopped from the corner. */
  onClose: () => void;
  /** Back from the corner to the large player. */
  onExpand: () => void;
};

/** Phones and small tablets held upright or sideways: the film goes full screen there. */
const PHONE = "(pointer: coarse) and (max-width: 820px), (pointer: coarse) and (max-height: 500px)";

type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitDisplayingFullscreen?: boolean };
type LockableOrientation = ScreenOrientation & { lock?: (o: string) => Promise<void>; unlock?: () => void };

/** Full screen on the video itself, with the iPhone's own player where element full screen does not exist. */
async function enterFullscreen(v: IOSVideo) {
  if (document.fullscreenElement === v || v.webkitDisplayingFullscreen) return true;
  try {
    if (v.requestFullscreen) await v.requestFullscreen({ navigationUI: "hide" });
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    else return false;
  } catch {
    return false;
  }
  // Sideways where the browser allows it (Chrome on Android in full screen); ignored elsewhere.
  (screen.orientation as LockableOrientation | undefined)?.lock?.("landscape").catch(() => {});
  return true;
}

/** Media Source Extensions, which hls.js needs (ManagedMediaSource on newer iPhones). */
const canMse = () => "MediaSource" in window || "ManagedMediaSource" in window;

/** Each half of the film counts once per page view, however often it is opened. */
const counted = new Set<number>();

/**
 * The keynote film with sound, in one <dialog> that is either the large modal player or, when
 * it is closed mid-film, a small non-modal player in the bottom-left corner. It is the same
 * video element throughout, so the film never stops or reloads between the two.
 *
 * Streams the HLS ladder: natively where the browser can (Safari, iOS), with hls.js loaded on
 * demand elsewhere, and the progressive files as the last resort. Phones go full screen on
 * open; every screen has a full screen button.
 *
 * The page behind the large player is locked and kept exactly where it was: the position is
 * stored on open and put back on close, and focus moves without scrolling.
 *
 * Captions: the film has its English subtitles burned in, so the English WebVTT track is
 * loaded but not painted over them (it would double every line). It is there for the
 * transcript below the player, for the captions menu and for full screen players, and a
 * Dutch or French track (film.nl.vtt, film.fr.vtt) would show by default.
 */
export default function FilmModal({ film, mode, from, onMini, onClose, onExpand }: Props) {
  const dlg = useRef<HTMLDialogElement>(null);
  const video = useRef<IOSVideo>(null);
  const opener = useRef<HTMLElement | null>(null);
  const savedY = useRef(0);
  const started = useRef(false);
  const fsTried = useRef(false);
  const labelId = useId();
  const [closing, setClosing] = useState(false);
  // The progressive files, where there is no HLS ladder or no way to play one. (Client only.)
  const [fallback, setFallback] = useState(() => !film.hls || (!nativeHls() && !canMse()));
  const [playing, setPlaying] = useState(false);
  const [tapForFull, setTapForFull] = useState(false);
  const [cues, setCues] = useState<string[] | null>(null);

  // Open as a modal or as the corner player. Switching closes and reopens the same dialog.
  useEffect(() => {
    const d = dlg.current!;
    if (mode === "modal") {
      // Back from the corner, the button that first opened the film keeps that role.
      const active = document.activeElement as HTMLElement | null;
      if (active && !d.contains(active)) opener.current = active;
      savedY.current = scroller.y();
      if (d.open) d.close();
      d.showModal();
      scroller.lock(true);
      // showModal would focus the first control and could scroll; place focus ourselves.
      d.querySelector<HTMLElement>(".film-close")?.focus({ preventScroll: true });
      return () => {
        scroller.lock(false);
        // Put the page back exactly where it was, whatever moved it meanwhile.
        if (Math.abs(scroller.y() - savedY.current) > 0.5) scroller.to(savedY.current, { immediate: true });
        const o = opener.current;
        if (o?.isConnected) o.focus({ preventScroll: true });
      };
    }
    if (d.open) d.close();
    d.show();
  }, [mode]);

  // Unmount: make sure the dialog is closed and nothing is still locked.
  useEffect(() => {
    const d = dlg.current!;
    return () => {
      if (d.open) d.close();
    };
  }, []);

  // The stream: native HLS, else hls.js, else the progressive files.
  useEffect(() => {
    const v = video.current!;
    if (!film.hls) return;
    let dead = false;
    let destroy = () => {};
    const start = () => v.play().catch(() => {});
    if (nativeHls()) {
      v.src = film.hls;
      start();
    } else if (canMse()) {
      import("hls.js/light")
        .then(({ default: Hls }) => {
          if (dead) return;
          if (!Hls.isSupported()) return setFallback(true);
          const hls = new Hls({
            // Always start on 360p: its first segment is small (about 220 KB) and is the one
            // prefetched when a play button came into view, so the first frame is immediate.
            // The bandwidth measured on it then picks the rendition for the rest.
            startLevel: 0,
            capLevelToPlayerSize: true,
            maxBufferLength: 20,
          });
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (!data.fatal) return;
            hls.destroy();
            setFallback(true);
          });
          hls.loadSource(film.hls!);
          hls.attachMedia(v);
          destroy = () => hls.destroy();
          start();
        })
        .catch(() => !dead && setFallback(true));
    }
    return () => {
      dead = true;
      destroy();
    };
  }, [film.hls]);

  // The progressive files, once they are rendered as sources.
  useEffect(() => {
    if (!fallback) return;
    const v = video.current!;
    v.removeAttribute("src");
    v.load();
    v.play().catch(() => {});
  }, [fallback]);

  // Phones: full screen at once. Opening was a tap, so the browser usually allows it; if not,
  // the first tap on the film does it.
  useEffect(() => {
    // Once per player (development runs effects twice, and a second request would fail).
    if (fsTried.current || !matchMedia(PHONE).matches) return;
    fsTried.current = true;
    const v = video.current!;
    enterFullscreen(v).then((ok) => !ok && setTapForFull(true));
  }, []);

  // Leaving full screen hands the screen back its own orientation.
  useEffect(() => {
    const done = () => {
      if (!document.fullscreenElement) (screen.orientation as LockableOrientation | undefined)?.unlock?.();
    };
    document.addEventListener("fullscreenchange", done);
    return () => document.removeEventListener("fullscreenchange", done);
  }, []);

  // English captions load quietly (see above); any other language shows.
  useEffect(() => {
    const v = video.current!;
    for (const tt of Array.from(v.textTracks)) tt.mode = tt.language === "en" ? "hidden" : "showing";
  }, []);

  const finish = useCallback(() => {
    setClosing(true);
    const quick = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onClose, quick ? 0 : 200);
  }, [onClose]);

  /** Close the large player: mid-film it carries on in the corner, otherwise it goes. */
  const close = useCallback(() => {
    if (closing) return;
    const v = video.current!;
    const midFilm = started.current && !v.paused && !v.ended && v.duration - v.currentTime > 3;
    if (midFilm) onMini();
    else finish();
  }, [closing, onMini, finish]);

  const stop = () => {
    video.current?.pause();
    finish();
  };

  const toggle = () => {
    const v = video.current!;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const loadTranscript = () => {
    if (cues) return;
    const tr = Array.from(video.current?.textTracks ?? []).find((x) => x.language === "en");
    const list = tr?.cues ? Array.from(tr.cues).map((c) => (c as VTTCue).text.replace(/\n/g, " ")) : [];
    setCues(list);
  };

  const mini = mode === "mini";

  return (
    <dialog
      ref={dlg}
      className={`dlg dlg-wide film-dlg ${mini ? "is-mini" : ""}`}
      data-closing={closing}
      aria-labelledby={mini ? undefined : labelId}
      aria-label={mini ? t.mini.label : undefined}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (!mini && e.target === e.currentTarget) close();
      }}
      onKeyDown={(e) => {
        if (mini && e.key === "Escape") stop();
      }}
    >
      <div className="dlg-panel film-panel">
        {!mini && (
          <div className="dlg-head film-head">
            <h2 id={labelId} className="dlg-title">
              {t.title}
            </h2>
            <button type="button" className="film-btn film-full" onClick={() => enterFullscreen(video.current!)} aria-label={t.fullscreen}>
              <FullscreenIcon />
              <span>{t.fullscreen}</span>
            </button>
            <button type="button" className="dlg-close film-close" onClick={close} aria-label={t.close}>
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="film-frame">
          <video
            ref={video}
            poster={film.poster}
            controls={!mini}
            playsInline
            preload="metadata"
            onPlay={(e) => {
              setPlaying(true);
              if (!e.currentTarget.muted && !film.filmIsStandIn) track("film_sound_on");
            }}
            onPause={() => setPlaying(false)}
            onPlaying={() => {
              if (started.current) return;
              started.current = true;
              track("film_start", { from });
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (!counted.has(50) && v.duration && v.currentTime / v.duration >= 0.5) {
                counted.add(50);
                track("film_progress", { pct: 50, from });
              }
            }}
            onEnded={() => {
              if (!counted.has(100)) {
                counted.add(100);
                track("film_progress", { pct: 100, from });
              }
              if (mini) finish();
            }}
          >
            {fallback && film.film.map((s) => <source key={s.src} src={s.src} type={s.type} media={s.media} />)}
            {film.captions && <track kind="captions" src={film.captions} srcLang="en" label={t.captions} />}
          </video>
          {tapForFull && !mini && (
            <button
              type="button"
              className="film-tap"
              onClick={() => {
                setTapForFull(false);
                enterFullscreen(video.current!);
                video.current?.play().catch(() => {});
              }}
            >
              <FullscreenIcon />
              <span>{t.tapFullscreen}</span>
            </button>
          )}
          {mini && (
            <div className="film-mini-bar">
              <button type="button" className="film-btn" onClick={toggle} aria-label={playing ? t.mini.pause : t.mini.play}>
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button type="button" className="film-btn" onClick={onExpand} aria-label={t.mini.expand}>
                <ExpandIcon />
              </button>
              <button type="button" className="film-btn" onClick={stop} aria-label={t.mini.close}>
                <CloseIcon />
              </button>
            </div>
          )}
        </div>
        {!mini && film.captions && (
          <details className="film-transcript" onToggle={loadTranscript}>
            <summary>{t.transcript}</summary>
            {cues && (
              <p lang="en">
                {cues.map((c, i) => (
                  <span key={i}>{c} </span>
                ))}
              </p>
            )}
          </details>
        )}
        {!mini && film.filmIsStandIn && <p className="film-note">{t.standIn}</p>}
      </div>
    </dialog>
  );
}

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M9 2h5v5M14 2 8.5 7.5M7 14H2V9M2 14l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
