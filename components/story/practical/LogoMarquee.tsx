"use client";

import { useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { useStoryPage } from "../StoryRoot";
import { PauseIcon, PlayIcon } from "../icons";

const p = content.story.practical;
type Logo = (typeof p.logos)[number];

/** The gap between logos in a running row, in rem (.logos in story.css). */
const GAP = 5.5;
/** Speed of both rows, in rem per second: the pace of the single row this replaced. */
const PACE = 3.4;

/** A logo's drawn width in rem, from its height on the page and its aspect ratio. */
const widthOf = (l: Logo) => (l.rem * l.w) / l.h + GAP;

/**
 * Two rows of the same visual weight: each logo goes to the row that is
 * shorter so far, then each row keeps the order of the list.
 */
function split(logos: readonly Logo[]): [Logo[], Logo[]] {
  const row = new Map<Logo, number>();
  const width = [0, 0];
  [...logos]
    .sort((a, b) => widthOf(b) - widthOf(a))
    .forEach((l) => {
      const r = width[0] <= width[1] ? 0 : 1;
      row.set(l, r);
      width[r] += widthOf(l);
    });
  return [logos.filter((l) => row.get(l) === 0), logos.filter((l) => row.get(l) === 1)];
}

const ROWS = split(p.logos);

function Logos({ list, copy }: { list: readonly Logo[]; copy?: boolean }) {
  return (
    <ul className="logos" aria-hidden={copy || undefined}>
      {list.map((l) => (
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
 * One running row. Each half of the track holds the row twice, so a half is
 * wider than any screen and the loop (translate by half) never shows a gap.
 * The duration follows the row's length, so both rows run at one pace.
 */
function Row({ list, reverse }: { list: Logo[]; reverse?: boolean }) {
  const half = 2 * list.reduce((sum, l) => sum + widthOf(l), 0);
  return (
    <div className="marquee" data-reverse={reverse || undefined}>
      <div className="marquee-track" style={{ animationDuration: `${Math.round(half / PACE)}s` }}>
        <Logos list={list} />
        <Logos list={list} copy />
        <Logos list={list} copy />
        <Logos list={list} copy />
      </div>
    </div>
  );
}

/**
 * Everyone who booked the keynote, as two slow, endless rows running in
 * opposite directions: a results ticker rather than a logo wall. Both stop
 * when either is pointed at or focused, and the round button stops both for
 * good. With reduced motion it is a still, wrapping list.
 */
export function LogoMarquee() {
  const { cinema } = useStoryPage();
  const [paused, setPaused] = useState(false);

  if (!cinema) {
    return (
      <div className="marquee is-still">
        <Logos list={p.logos} />
      </div>
    );
  }

  return (
    <div className="marquee-wrap">
      <div className="marquee-rows" data-paused={paused}>
        <Row list={ROWS[0]} />
        <Row list={ROWS[1]} reverse />
      </div>
      <button type="button" className="round-btn marquee-pause" onClick={() => setPaused((v) => !v)} aria-label={paused ? p.logosPlay : p.logosPause}>
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  );
}
