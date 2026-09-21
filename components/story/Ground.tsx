"use client";

import { GROUNDS } from "@/lib/story/beats";

/**
 * One fixed element behind everything, with a gradient layer per theme.
 * The driver writes each layer's opacity into a CSS variable, so a change of
 * ground is a crossfade on the compositor and the page reads as one space.
 */
export default function Ground() {
  return (
    <div className="story-ground" aria-hidden="true">
      {GROUNDS.map((g) => (
        <div key={g} className={`gl gl-${g}`} />
      ))}
      <div className="grain" />
    </div>
  );
}
