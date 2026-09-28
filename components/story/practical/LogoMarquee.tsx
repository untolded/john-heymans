"use client";

import { useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { useStoryPage } from "../StoryRoot";
import { PauseIcon, PlayIcon } from "../icons";

const p = content.story.practical;

function Logos({ copy }: { copy?: boolean }) {
  return (
    <ul className="logos" aria-hidden={copy || undefined}>
      {p.logos.map((l) => (
        <li key={l.file} className={"caption" in l ? "has-caption" : undefined}>
          <Image src={`/logos/${l.file}`} alt={copy ? "" : l.name} width={l.w} height={l.h} unoptimized style={{ height: `${l.rem}rem`, width: "auto" }} />
          {"caption" in l && (
            <span className="logo-caption" aria-hidden="true">
              {l.caption}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Everyone who booked the keynote, as one slow, endless row: a results
 * ticker rather than a logo wall. It stops when pointed at or focused, and
 * the round button stops it for good. With reduced motion it is a still,
 * wrapping row.
 */
export function LogoMarquee() {
  const { cinema } = useStoryPage();
  const [paused, setPaused] = useState(false);

  if (!cinema) {
    return (
      <div className="marquee is-still">
        <Logos />
      </div>
    );
  }

  return (
    <div className="marquee-wrap">
      <div className="marquee" data-paused={paused}>
        <div className="marquee-track">
          <Logos />
          <Logos copy />
        </div>
      </div>
      <button type="button" className="round-btn marquee-pause" onClick={() => setPaused((v) => !v)} aria-label={paused ? p.logosPlay : p.logosPause}>
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  );
}
