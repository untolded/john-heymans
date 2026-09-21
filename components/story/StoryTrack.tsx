"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { content } from "@/lib/content";
import { BEAT_INDEX, RELEASE_AT } from "@/lib/story/beats";
import { story } from "@/lib/story/store";
import { scroller } from "@/lib/story/scroll";
import { track } from "@/lib/story/analytics";
import { useStoryPage } from "./StoryRoot";

const Cinema = dynamic(() => import("./Cinema"), { ssr: false });
const STORY_END = BEAT_INDEX.handover + RELEASE_AT;

/**
 * Holds the story. The static sections are server-rendered children and stay
 * in the DOM in every mode: in cinema they are visually hidden but still read
 * by assistive technology, while the stage plays the same story on screen.
 */
export function StoryTrack({ children }: { children: React.ReactNode }) {
  const { mode, cinema } = useStoryPage();
  return (
    <div className="story-track" id="story">
      <SkipStory />
      {cinema && <Cinema key={mode} touch={mode === "cinema-touch"} />}
      <div className="story-static">{children}</div>
    </div>
  );
}

/** "Skip the story": the first control after the hero, always there during the film. */
function SkipStory() {
  const button = useRef<HTMLButtonElement>(null);
  const { ready } = useStoryPage();

  useEffect(() => {
    if (!ready) return;
    return story.onTime((t) => {
      if (button.current) button.current.dataset.on = String(t >= 0 && t < STORY_END);
    });
  }, [ready]);

  return (
    <button
      ref={button}
      type="button"
      className="skip-story"
      data-on="false"
      onClick={() => {
        const target = document.getElementById("keynote");
        if (!target) return;
        track("story_skipped", { beat: story.get().current ?? "hero" });
        scroller.toElement(target, { offset: 1 });
      }}
    >
      <span>{content.story.frame.skip}</span>
      <span className="skip-icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1.5v10M2.5 7.5 7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
