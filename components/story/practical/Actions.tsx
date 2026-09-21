"use client";

import { SCRIPT } from "@/lib/story/script";
import { at } from "@/lib/story/beats";
import { driver } from "@/lib/story/driver";
import { scroller } from "@/lib/story/scroll";
import { useStoryPage } from "../StoryRoot";

/** "Check availability" wherever it appears: opens the enquiry. */
export function EnquireButton({ from, className, children }: { from: string; className?: string; children: React.ReactNode }) {
  const { openEnquiry } = useStoryPage();
  return (
    <a
      href="#enquiry"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openEnquiry(from);
      }}
    >
      {children}
    </a>
  );
}

/** A filmstrip frame: back to that chapter's lesson card in the story. */
export function LessonLink({ n, className, label, children }: { n: number; className?: string; label: string; children: React.ReactNode }) {
  const { ready } = useStoryPage();
  return (
    <a
      href={`#lesson-${n}`}
      className={className}
      aria-label={label}
      onClick={(e) => {
        if (!ready || !driver.ready()) return;
        const card = SCRIPT.find((s) => s.lesson === n && (s.slot === "lesson" || s.slot === "under"));
        if (!card) return;
        e.preventDefault();
        scroller.to(driver.yAt(at(card.from) + 0.03), { duration: 1.6 });
      }}
    >
      {children}
    </a>
  );
}
