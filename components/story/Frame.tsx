"use client";

import { Fragment, useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { CHAPTERS, RELEASE_AT, BEAT_INDEX } from "@/lib/story/beats";
import { story, useStory } from "@/lib/story/store";
import { credits } from "@/lib/story/credits";
import { gsap } from "@/lib/story/gsap";
import { fill } from "@/lib/story/format";
import { Social } from "@/components/shared/Social";
import { useStoryPage } from "./StoryRoot";
import { Telemetry } from "./Telemetry";
import { RankingChip } from "./RankingChip";

const t = content.story.frame;

/**
 * The interface, and the only one: a fixed frame the story plays inside.
 * Wordmark, chapter, socials and the enquiry pill on top; credit, telemetry
 * and the ranking chip at the bottom; a progress hairline along the edge.
 * It inverts to ink when the ground turns to paper.
 */
export function Frame() {
  const { ready, openEnquiry } = useStoryPage();

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
            <div className="frame-readouts">
              <Telemetry />
              <RankingChip />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Eight ticks, one per chapter; the name travels along them like a runner. */
function Chapter() {
  const current = useStory((s) => s.current);
  const index = current ? CHAPTERS.findIndex((c) => c.id === current) : -1;
  const name = current ? content.story.chapters[current] : "";

  return (
    <div className="chapter" data-on={index >= 0} aria-hidden="true">
      {CHAPTERS.map((c, i) => (
        <Fragment key={c.id}>
          <i className="tick" data-passed={i <= index} />
          {i === index && name && (
            <span className="chapter-name" key={name}>
              {name}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

const STORY_END = BEAT_INDEX.handover + RELEASE_AT;

function Progress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(
    () =>
      story.onTime((time, s) => {
        const el = bar.current;
        if (!el) return;
        el.style.transform = `scaleX(${s.story})`;
        el.dataset.on = String(time >= 0 && time < STORY_END);
      }),
    [],
  );
  return <span className="progress" ref={bar} role="presentation" />;
}

/** "Photo: Jelle Jansegers" while that photographer's work is on screen. */
function Credit() {
  const el = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    let current: string | null = null;
    return credits.subscribe((name) => {
      const node = el.current;
      if (!node || name === current) return;
      current = name;
      gsap.killTweensOf(node);
      gsap.to(node, {
        y: -6,
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          node.textContent = name ? fill(content.story.credit, { name }) : "";
          if (name) gsap.fromTo(node, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
        },
      });
    });
  }, []);
  return <p className="credit" ref={el} />;
}
