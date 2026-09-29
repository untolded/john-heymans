"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { CHAPTERS, RELEASE_AT, BEAT_INDEX } from "@/lib/story/beats";
import { story, useStory } from "@/lib/story/store";
import { credits } from "@/lib/story/credits";
import { gsap } from "@/lib/story/gsap";
import { Social } from "@/components/shared/Social";
import { useStoryPage } from "./StoryRoot";

const t = content.story.frame;

/**
 * The interface, and the only one: a fixed frame the story plays inside.
 * Wordmark, chapter ticks, socials and the enquiry pill on top; the photo
 * credit at the bottom; a progress hairline along the edge. Nothing else
 * talks over the story. It inverts to ink exactly when a paper section
 * passes under it.
 */
export function Frame() {
  const { ready, openEnquiry } = useStoryPage();
  useInkOverPaper();

  return (
    <div className="frame">
      <header className="frame-top">
        <a className="wordmark" href="#top" aria-label={t.home}>
          {t.wordmark}
        </a>
        {ready && <Chapter />}
        <div className="frame-actions">
          <Social variant="icons" className="frame-social" />
          <a
            className="pill pill-amber frame-cta"
            href="#enquiry"
            aria-label={t.cta}
            onClick={(e) => {
              e.preventDefault();
              openEnquiry("frame");
            }}
          >
            <span className="cta-long">{t.cta}</span>
            <span className="cta-short" aria-hidden="true">
              {t.ctaShort}
            </span>
          </a>
        </div>
      </header>

      {ready && (
        <>
          <Progress />
          <div className="frame-bottom" aria-hidden="true">
            <Credit />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Watches the band the header occupies. When a paper section fills it, the
 * root gets data-nav="paper" and the frame turns to ink; above the story's
 * dark grounds it stays light. In cinema the visually hidden static story is
 * ignored, since the stage covers it.
 */
function useInkOverPaper() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".story-root");
    if (!root) return;
    const inside = new Set<Element>();
    let io: IntersectionObserver | null = null;

    const watch = () => {
      io?.disconnect();
      inside.clear();
      // A thin band at the very top: the frame flips once the paper covers the whole header, so its
      // paper backdrop never paints over the dark stage above the sheet's edge.
      const mid = 6;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) inside.add(e.target);
            else inside.delete(e.target);
          }
          const cinema = root.classList.contains("is-cinema");
          const paper = [...inside].some((t) => !(cinema && t.closest(".story-static")));
          root.dataset.nav = paper ? "paper" : "dark";
        },
        { rootMargin: `-${mid}px 0px -${Math.max(0, window.innerHeight - mid - 1)}px 0px` },
      );
      document.querySelectorAll('.practical, .footer, .sb[data-ground="paper"]').forEach((n) => io!.observe(n));
    };

    watch();
    let width = window.innerWidth;
    let height = window.innerHeight;
    const onResize = () => {
      if (window.innerWidth === width && Math.abs(window.innerHeight - height) < 120) return;
      width = window.innerWidth;
      height = window.innerHeight;
      watch();
    };
    window.addEventListener("resize", onResize);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);
}

/** One tick per chapter, lit up to the current one, like laps on a board. No names: the story says where it is. */
function Chapter() {
  const current = useStory((s) => s.current);
  const index = current ? CHAPTERS.findIndex((c) => c.id === current) : -1;

  return (
    <div className="chapter" data-on={index >= 0} aria-hidden="true">
      {CHAPTERS.map((c, i) => (
        <i className="tick" key={c.id} data-passed={i <= index} />
      ))}
    </div>
  );
}

const STORY_END = BEAT_INDEX.handover + RELEASE_AT;

function Progress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".story-root");
    return story.onTime((time, s) => {
      const el = bar.current;
      if (!el) return;
      el.style.transform = `scaleX(${s.story})`;
      const on = String(time >= 0 && time < STORY_END);
      el.dataset.on = on;
      // The frame's bottom shade belongs to the story; the rising paper sheet must not wear it.
      if (root && root.dataset.story !== on) root.dataset.story = on;
    });
  }, []);
  return <span className="progress" ref={bar} role="presentation" />;
}

/** "Photo: Jelle Jansegers" (or "Footage: ...") while that person's work is on screen. */
function Credit() {
  const el = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    let current: string | null = null;
    return credits.subscribe((line) => {
      const node = el.current;
      if (!node || line === current) return;
      current = line;
      gsap.killTweensOf(node);
      gsap.to(node, {
        y: -6,
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          node.textContent = line ?? "";
          if (line) gsap.fromTo(node, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
        },
      });
    });
  }, []);
  return <p className="credit" ref={el} />;
}
