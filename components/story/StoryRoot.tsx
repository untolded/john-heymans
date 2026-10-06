"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Lenis, { type VirtualScrollData } from "lenis";
import { content } from "@/lib/content";
import { detectMode, isCinema, watchMode, type Mode } from "@/lib/story/modes";
import { story } from "@/lib/story/store";
import { scroller } from "@/lib/story/scroll";
import { wheelStops } from "@/lib/story/stopper";
import { gsap, ScrollTrigger } from "@/lib/story/gsap";
import { track, type FilmSource } from "@/lib/story/analytics";
import type { FilmAssets } from "@/lib/story/assets";
import { Frame } from "./Frame";
import { warmHls } from "./media/useFilmEntry";
import type { FilmMode } from "./media/FilmModal";
import { CookieBanner } from "@/components/site/CookieBanner";

const EnquiryDialog = dynamic(() => import("./EnquiryDialog"), { ssr: false });
const FilmDialog = dynamic(() => import("./media/FilmModal"), { ssr: false });
const Ground = dynamic(() => import("./Ground"), { ssr: false });

type Dialog = null | "enquiry";

type StoryPage = {
  mode: Mode | null;
  cinema: boolean;
  /** The cinema layout is on screen. */
  ready: boolean;
  setReady: (ready: boolean) => void;
  openEnquiry: (from: string) => void;
  /** Opens the large film player, or brings the corner player back to it. */
  openFilm: (from?: FilmSource) => void;
};

const Ctx = createContext<StoryPage | null>(null);

export function useStoryPage(): StoryPage {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStoryPage outside StoryRoot");
  return ctx;
}

/** For parts shared with the other pages (the footer): null outside the story page. */
export const useStoryPageIfAny = (): StoryPage | null => useContext(Ctx);

/**
 * The client root. Decides the mode once on mount (and again if a media
 * query changes), runs the one clock that drives Lenis and the story, and
 * owns the two dialogs. Until the cinema layout is ready, the page is the
 * server-rendered static document.
 */
export function StoryRoot({ children, className, typeKit, film }: { children: React.ReactNode; className: string; typeKit: string; film: FilmAssets }) {
  // The server renders the static layout (mode null); the client reads the real mode after hydration.
  const mode = useSyncExternalStore<Mode | null>(watchMode, detectMode, () => null);
  const [ready, setReady] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const cinema = isCinema(mode);

  useEffect(() => story.setMode(mode, ready), [mode, ready]);

  // One clock for the page. Lenis joins it on desktop cinema only.
  useEffect(() => {
    const tick = (time: number) => scroller.tick(time);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useEffect(() => {
    if (mode !== "cinema-desktop") return;
    // The wheel passes the story's stops first (lib/story/stopper.ts).
    let stops: ((data: VirtualScrollData) => boolean) | null = null;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false, anchors: false, virtualScroll: (data) => stops?.(data) ?? true });
    stops = wheelStops(lenis);
    scroller.set(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      scroller.set(null);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "cinema-touch") ScrollTrigger.config({ ignoreMobileResize: true });
  }, [mode]);

  const openEnquiry = useCallback((from: string) => {
    track("cta_clicked", { location: from });
    setDialog("enquiry");
  }, []);
  // The film player: large (modal) or, after closing it mid-film, small in the corner.
  const [filmState, setFilmState] = useState<{ mode: FilmMode; from: FilmSource } | null>(null);
  const openFilm = useCallback((from?: FilmSource) => {
    // Some buttons pass their click event straight through: those are the hero's.
    const source: FilmSource = typeof from === "string" ? from : "hero";
    warmHls();
    track("film_opened", { from: source });
    setFilmState((f) => (f ? { ...f, mode: "modal" } : { mode: "modal", from: source }));
  }, []);
  const filmMini = useCallback(() => setFilmState((f) => f && { ...f, mode: "mini" }), []);
  const filmExpand = useCallback(() => openFilm("mini"), [openFilm]);
  const filmClose = useCallback(() => setFilmState(null), []);
  const close = useCallback(() => setDialog(null), []);

  const value = useMemo(() => ({ mode, cinema, ready, setReady, openEnquiry, openFilm }), [mode, cinema, ready, openEnquiry, openFilm]);

  return (
    <Ctx.Provider value={value}>
      <div className={`story-root ${className} ${ready ? "is-cinema" : ""}`} data-mode={mode ?? "static"} data-ground="night" data-type={typeKit}>
        <a className="skip-link" href="#keynote">
          {content.story.a11y.skip}
        </a>
        <Frame />
        {cinema && <Ground />}
        {children}
        {dialog === "enquiry" && <EnquiryDialog onClose={close} />}
        {filmState && (
          <FilmDialog film={film} mode={filmState.mode} from={filmState.from} onMini={filmMini} onExpand={filmExpand} onClose={filmClose} />
        )}
        <CookieBanner />
      </div>
    </Ctx.Provider>
  );
}
