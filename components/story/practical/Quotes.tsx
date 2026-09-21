"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { useStoryPage } from "../StoryRoot";
import { PauseIcon, PlayIcon } from "../icons";

const quotes = content.proof.quotes;
const p = content.story.practical;
const EVERY_MS = 9000;

/**
 * The two written testimonials, one at a time with a slow crossfade. The
 * rotation stops while pointed at or focused, has a visible pause, and does
 * not run at all in the static layout, where both quotes simply stack.
 */
export function Quotes() {
  const { cinema } = useStoryPage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const holding = useRef(false);

  useEffect(() => {
    if (!cinema || paused) return;
    const id = window.setInterval(() => {
      if (!holding.current) setIndex((i) => (i + 1) % quotes.length);
    }, EVERY_MS);
    return () => window.clearInterval(id);
  }, [cinema, paused]);

  return (
    <div
      className="quotes"
      data-rotating={cinema}
      onPointerEnter={() => {
        holding.current = true;
      }}
      onPointerLeave={() => {
        holding.current = false;
      }}
      onFocus={() => {
        holding.current = true;
      }}
      onBlur={() => {
        holding.current = false;
      }}
    >
      <h3 className="sr-only">{p.quotesTitle}</h3>
      <div className="quotes-stage">
        {quotes.map((q, i) => (
          <figure className="quote" key={q.org} data-on={!cinema || i === index} aria-hidden={cinema && i !== index}>
            <blockquote className="quote-text">
              <p>{q.text}</p>
            </blockquote>
            <figcaption className="quote-by">
              <Image className="quote-portrait" src={q.portrait} alt="" width={64} height={64} />
              <span className="quote-who">
                <span>{q.who}</span>
                <span>{q.org}</span>
              </span>
              <Image className="quote-logo" src={q.logo} alt={q.org} width={120} height={40} style={{ height: "1.75rem", width: "auto" }} />
            </figcaption>
          </figure>
        ))}
      </div>
      {cinema && (
        <div className="quotes-controls">
          {quotes.map((q, i) => (
            <button key={q.org} type="button" className="dot" aria-label={fill(p.quoteShow, { n: i + 1 })} aria-current={i === index} onClick={() => setIndex(i)} />
          ))}
          <button type="button" className="round-btn" onClick={() => setPaused((v) => !v)} aria-label={paused ? p.quotePlay : p.quotePause}>
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>
      )}
    </div>
  );
}
