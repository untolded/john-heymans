"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK, DESKTOP } from "@/lib/gsap";
import { content } from "@/lib/content";
import { Photo } from "@/components/shared/Photo";
import type { PhotoSlug } from "@/lib/photos";

const s = content.signal.story;

/** Eight beats. One sticky stage. The media never leaves the screen. */
const BEATS: { id: string; photo: PhotoSlug; alt: string; focus?: string }[] = [
  { id: "opener", photo: "lavender-race", alt: "John racing the Olympic 5000m heats in Paris" },
  { id: "kenya", photo: "xc-run", alt: "John running alone on a grass course" },
  { id: "edge", photo: "kit-portrait", alt: "John in the Belgian kit on an indoor track" },
  { id: "chat", photo: "watch", alt: "A running watch showing a track session", focus: "50% 50%" },
  { id: "doubt", photo: "race-orange", alt: "John racing at the European Indoor Championships" },
  { id: "setback", photo: "track-lying", alt: "John flat on the track after a session" },
  { id: "village", photo: "track-laugh", alt: "John laughing at the side of the track" },
  { id: "final", photo: "final-arms", alt: "John after the Olympic 5000m final, hands on his head" },
];

export function Story() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = (sel: string) => root.current!.querySelector<HTMLElement>(sel)!;
      const all = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, root.current);

      // Types a string as the scroll runs through it, so the prompt is written
      // by the visitor's own scrolling rather than on a timer.
      const typeInto = (tl: gsap.core.Timeline, target: HTMLElement, text: string, at: number, dur: number) => {
        const o = { i: 0 };
        tl.to(o, {
          i: text.length,
          duration: dur,
          ease: "none",
          onUpdate: () => { target.textContent = text.slice(0, Math.round(o.i)); },
        }, at);
      };

      const mm = gsap.matchMedia();

      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        root.current!.classList.add("is-cinema");
        const beats = all(".beat");
        const n = beats.length;
        const w = 1 / n;
        const at = (i: number, offset = 0) => i * w + offset * w;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        });

        // Every beat cross-fades into the next one. Nothing ever ends.
        beats.forEach((beat, i) => {
          const media = beat.querySelector(".beat-media");
          const copy = beat.querySelectorAll<HTMLElement>(".beat-copy > *");
          gsap.set(beat, { opacity: i === 0 ? 1 : 0 });
          gsap.set(media, { scale: 1.06 });

          if (i > 0) tl.fromTo(beat, { opacity: 0 }, { opacity: 1, duration: w * 0.22 }, at(i, -0.12));
          if (i < n - 1) tl.to(beat, { opacity: 0, duration: w * 0.18 }, at(i + 1, -0.14));
          tl.fromTo(media, { scale: 1.1 }, { scale: 1, duration: w * 1.1 }, at(i, -0.1));
          tl.fromTo(copy, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: w * 0.3, stagger: w * 0.06 }, at(i, -0.02));
          if (i < n - 1) tl.to(copy, { opacity: 0, y: -18, duration: w * 0.16 }, at(i + 1, -0.16));
        });

        // 1. Opener: the sentence arrives word by word, like a title card.
        SplitText.create(".opener-title", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit: (self) => tl.from(self.lines, { yPercent: 120, duration: w * 0.5, stagger: w * 0.08 }, at(0, 0.04)),
        });

        // 2. Kenya: the flight draws, the altitude climbs, the metres count up.
        tl.fromTo(".flight-path", { drawSVG: "0%" }, { drawSVG: "100%", duration: w * 0.55 }, at(1, 0.05));
        tl.to(".flight-plane", {
          duration: w * 0.55,
          motionPath: { path: ".flight-path", align: ".flight-path", alignOrigin: [0.5, 0.5], autoRotate: true },
        }, at(1, 0.05));
        tl.fromTo(".alt-line", { drawSVG: "0%" }, { drawSVG: "100%", duration: w * 0.45 }, at(1, 0.3));
        tl.fromTo(".alt-fill", { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: w * 0.45, transformOrigin: "bottom" }, at(1, 0.3));
        const metres = { v: 76 };
        tl.to(metres, {
          v: 2400, duration: w * 0.45,
          onUpdate: () => { el(".alt-readout").textContent = `${Math.round(metres.v).toLocaleString("en-GB")} m`; },
        }, at(1, 0.3));

        // 4. The chat: the prompt is typed, the answer streams, the schedule lands.
        typeInto(tl, el(".chat-prompt-text"), s.chat.prompt, at(3, 0.06), w * 0.3);
        tl.to(".chat-caret", { opacity: 0, duration: w * 0.05 }, at(3, 0.36));
        tl.fromTo(".chat-reply p", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: w * 0.08, stagger: w * 0.05 }, at(3, 0.34));
        all(".chat-compute span").forEach((line, i) => {
          tl.fromTo(line, { opacity: 0 }, { opacity: 1, duration: w * 0.03 }, at(3, 0.5 + i * 0.04));
          tl.to(line, { scrambleText: { text: line.dataset.text ?? "", chars: "01", speed: 0.6, revealDelay: 0 }, duration: w * 0.08 }, at(3, 0.5 + i * 0.04));
        });
        tl.fromTo(".chat-output", { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: w * 0.18 }, at(3, 0.7));
        tl.fromTo(".chat-caption", { opacity: 0 }, { opacity: 1, duration: w * 0.08 }, at(3, 0.86));

        // 5. Doubt: three messages arrive, then the record answers them.
        all(".doubt-msg").forEach((msg, i) => {
          tl.fromTo(msg, { opacity: 0, x: i % 2 ? 40 : -40, rotate: i % 2 ? 1.5 : -1.5 }, { opacity: 1, x: 0, duration: w * 0.1 }, at(4, 0.08 + i * 0.08));
        });
        tl.to(".doubt-msg", { opacity: 0, filter: "blur(6px)", duration: w * 0.1, stagger: w * 0.03 }, at(4, 0.46));
        tl.fromTo(".doubt-answer", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: w * 0.12 }, at(4, 0.48));
        all(".flash").forEach((f, i) => {
          tl.fromTo(f, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: w * 0.1 }, at(4, 0.62 + i * 0.08));
        });

        // 6. Setbacks: what stays on the list lights up.
        all(".control").forEach((c, i) => {
          tl.fromTo(c, { opacity: 0.25, borderColor: "rgba(185,168,245,0.2)" }, { opacity: 1, borderColor: "#ff7a2f", duration: w * 0.1 }, at(5, 0.45 + i * 0.1));
        });
        tl.fromTo(".setback-outcome", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: w * 0.12 }, at(5, 0.78));

        // 8. The final: the two words are written across his arms, then the close.
        all(".marker-word").forEach((word, i) => {
          tl.fromTo(word, { clipPath: "inset(-0.4em 100% -0.4em -0.4em)" }, { clipPath: "inset(-0.4em -0.4em -0.4em -0.4em)", duration: w * 0.16 }, at(7, 0.18 + i * 0.2));
        });
        tl.fromTo(".final-close", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: w * 0.16 }, at(7, 0.66));

        return () => root.current!.classList.remove("is-cinema");
      });

      // Phones and anyone who asked for less motion: the same beats, stacked and
      // readable, each one arriving as it enters the screen.
      mm.add(`(max-width: 991px), not all and ${MOTION_OK}`, () => {
        all(".beat").forEach((beat) => {
          gsap.fromTo(beat.querySelectorAll(".beat-copy > *"), { opacity: 0, y: 18 }, {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power2.out",
            scrollTrigger: { trigger: beat, start: "top 75%", once: true },
          });
        });
        // Everything the timeline would have revealed is simply already there.
        all(".chat-prompt-text").forEach((el) => { el.textContent = s.chat.prompt; });
        gsap.set(".chat-caret", { opacity: 0 });
        gsap.set(".marker-word", { clipPath: "inset(-0.4em -0.4em -0.4em -0.4em)" });
        gsap.set(".control", { borderColor: "#ff7a2f" });
        const readout = root.current!.querySelector<HTMLElement>(".alt-readout");
        if (readout) readout.textContent = "2,400 m";
      });
    },
    { scope: root },
  );

  return (
    <div className="story" ref={root} id="story">
      <div className="stage">
        {/* 1. They all said it couldn't be done */}
        <section className="beat beat-opener" aria-labelledby="beat-opener">
          <div className="beat-media"><Photo slug={BEATS[0].photo} alt={BEATS[0].alt} sizes="100vw" credit="corner" /></div>
          <div className="beat-copy wrap">
            <h2 id="beat-opener" className="display d-xl opener-title">{s.opener.title}</h2>
            <p className="lede">{s.opener.sub}</p>
          </div>
        </section>

        {/* 2. Iten, Kenya */}
        <section className="beat beat-kenya" aria-labelledby="beat-kenya">
          <div className="beat-media"><Photo slug={BEATS[1].photo} alt={BEATS[1].alt} sizes="100vw" credit="corner" /></div>
          <div className="scene scene-kenya" aria-hidden="true">
            <svg className="flight" viewBox="0 0 900 260" fill="none">
              <path className="flight-path" d="M60 210 C 260 40, 640 40, 840 150" stroke="var(--lavender)" strokeWidth="2" strokeDasharray="6 8" />
              <g className="flight-plane">
                <path d="M0 -8 L10 6 L0 2 L-10 6 Z" fill="var(--amber)" />
              </g>
              <circle cx="60" cy="210" r="5" fill="var(--lavender)" />
              <circle cx="840" cy="150" r="5" fill="var(--amber)" />
            </svg>
            <div className="alt">
              <svg viewBox="0 0 420 140" fill="none" preserveAspectRatio="none">
                <path className="alt-fill" d="M0 140 L0 120 C 110 118, 210 70, 420 18 L420 140 Z" fill="url(#altGrad)" />
                <path className="alt-line" d="M0 120 C 110 118, 210 70, 420 18" stroke="var(--amber)" strokeWidth="2.5" />
                <defs>
                  <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ff7a2f" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#ff7a2f" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="alt-ends">
                <span>{s.kenya.from.place} <b>{s.kenya.from.alt}</b></span>
                <span>{s.kenya.to.place} <b className="alt-readout">76 m</b></span>
              </div>
            </div>
          </div>
          <div className="beat-copy wrap">
            <h2 id="beat-kenya" className="display d-l">{s.kenya.title}</h2>
            <p className="lede">{s.kenya.line}</p>
            <p className="note">{s.kenya.note}</p>
          </div>
        </section>

        {/* 3. I needed an edge */}
        <section className="beat beat-edge" aria-labelledby="beat-edge">
          <div className="beat-media"><Photo slug={BEATS[2].photo} alt={BEATS[2].alt} sizes="100vw" credit="corner" /></div>
          <div className="beat-copy wrap">
            <h2 id="beat-edge" className="display d-xl">{s.edge.title}</h2>
            <p className="lede">{s.edge.line}</p>
          </div>
        </section>

        {/* 4. ChatGPT */}
        <section className="beat beat-chat" aria-labelledby="beat-chat">
          <div className="beat-media"><Photo slug={BEATS[3].photo} alt={BEATS[3].alt} sizes="100vw" credit="corner" /></div>
          <div className="beat-copy wrap">
            <h2 id="beat-chat" className="display d-l">{s.chat.title}</h2>
            <div className="chat">
              <div className="chat-head">
                <span className="chat-dot" aria-hidden="true" />
                {s.chat.app}
              </div>
              <p className="chat-prompt"><span className="chat-prompt-text" /><span className="chat-caret" aria-hidden="true" /></p>
              <div className="chat-reply">
                {s.chat.reply.map((r) => <p key={r}>{r}</p>)}
              </div>
              <div className="chat-compute" aria-hidden="true">
                {s.chat.compute.map((c) => <span key={c} data-text={c}>{c}</span>)}
              </div>
              <div className="chat-output">
                <p className="chat-output-title">{s.chat.outputTitle}</p>
                <ul>{s.chat.output.map((o) => <li key={o}>{o}</li>)}</ul>
              </div>
            </div>
            <p className="note chat-caption">{s.chat.caption}</p>
          </div>
        </section>

        {/* 5. Nobody agreed, then the ranking answered */}
        <section className="beat beat-doubt" aria-labelledby="beat-doubt">
          <div className="beat-media"><Photo slug={BEATS[4].photo} alt={BEATS[4].alt} sizes="100vw" credit="corner" /></div>
          <div className="beat-copy wrap">
            <h2 id="beat-doubt" className="sr-only">What everyone said, and what happened</h2>
            <ul className="doubt">
              {s.doubt.messages.map((m) => (
                <li className="doubt-msg" key={m.who}>
                  <span className="doubt-who">{m.who}</span>
                  <span className="doubt-text">{m.text}</span>
                </li>
              ))}
            </ul>
            <p className="display d-xl doubt-answer">{s.doubt.answer}</p>
            <ul className="flashes">
              {s.doubt.flashes.map((f) => <li className="flash" key={f}>{f}</li>)}
            </ul>
          </div>
        </section>

        {/* 6. Setbacks and the short list */}
        <section className="beat beat-setback" aria-labelledby="beat-setback">
          <div className="beat-media"><Photo slug={BEATS[5].photo} alt={BEATS[5].alt} sizes="100vw" credit="corner" /></div>
          <div className="beat-copy wrap">
            <h2 id="beat-setback" className="display d-l">{s.setback.title}</h2>
            <p className="lede">{s.setback.line}</p>
            <p className="note">{s.setback.note}</p>
            <ul className="controls">
              {s.setback.controllables.map((c) => <li className="control" key={c}>{c}</li>)}
            </ul>
            <p className="display d-m setback-outcome">{s.setback.outcome}</p>
          </div>
        </section>

        {/* 7. The village */}
        <section className="beat beat-village" aria-labelledby="beat-village">
          <div className="beat-media"><Photo slug={BEATS[6].photo} alt={BEATS[6].alt} sizes="100vw" credit="corner" /></div>
          <div className="beat-copy wrap">
            <h2 id="beat-village" className="display d-l">{s.village.title}</h2>
            <p className="lede">{s.village.line}</p>
          </div>
        </section>

        {/* 8. The final */}
        <section className="beat beat-final" aria-labelledby="beat-final">
          <div className="beat-media"><Photo slug={BEATS[7].photo} alt={BEATS[7].alt} sizes="100vw" credit="corner" /></div>
          <div className="marker-words" aria-hidden="true">
            {s.final.marker.map((word) => <span className="marker-word" key={word}>{word}</span>)}
          </div>
          <div className="beat-copy wrap">
            <h2 id="beat-final" className="display d-l">{s.final.title}</h2>
            <p className="lede">{s.final.line}</p>
            <div className="final-close">
              <p className="display d-xl">{s.final.close}</p>
              <p className="note">{s.final.closeNote}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
