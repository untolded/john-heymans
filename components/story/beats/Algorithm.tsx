"use client";

import { content } from "@/lib/content";
import { facts, show } from "@/lib/story/data";
import { gsap } from "@/lib/story/gsap";
import * as R from "@/lib/story/reveals";
import { GRID, GRID_V } from "@/lib/story/layouts";
import { SeasonGridSvg } from "../set-pieces/SeasonGrid";
import { SendIcon } from "../icons";
import { useBeat, cues } from "./useBeat";
import { useStageSize, boxOf } from "./stage";

const c = content.story.algorithm;
const PROMPT = show(facts.algorithm.prompt) ?? c.prompt;
const REPLY = show(facts.algorithm.reply) ?? c.reply;
const MEETS = facts.races.candidates.value ?? [];
// Real meet names only once the race data is confirmed; until then every field is masked.
const NAMED = !!show(facts.races.candidates) && !facts.races.candidates.placeholder;
const NOISE = "01<>/[]=+";

/** Deterministic field widths for a masked row, so the log looks like data without being any. */
function maskWidths(i: number) {
  let s = (i + 7) * 7919;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return [10, 14 + Math.floor(r() * 14), 3, 2 + Math.floor(r() * 2), 4 + Math.floor(r() * 2)];
}

const noise = (text: string) =>
  text
    .split("")
    .map((ch) => (ch === " " ? " " : NOISE[Math.floor(Math.random() * NOISE.length)]))
    .join("");

/**
 * The set piece. A chat window opens around the caret; the prompt types and
 * is sent; the reply streams in. Then every character scrambles into data,
 * the window dissolves, and the calendar of candidate meets streams past a
 * scanning bar. The rows collapse into the season: rejected meets dim, the
 * chosen ones flare amber in date order, and the amber line joins them.
 */
export function Algorithm() {
  const size = useStageSize();

  const scope = useBeat(
    "algorithm",
    ({ tl, q }) => {
      if (!size.w) return;
      const set = q(".algo-set")[0];
      const chat = q(".chat")[0];
      const bg = q(".chat-bg")[0];
      const typed = q(".chat-typed")[0];
      const placeholder = q(".chat-placeholder")[0];
      const you = q(".chat-you")[0];
      const ai = q(".chat-ai")[0];
      const send = q(".chat-send")[0];
      const caret = q(".algo-caret")[0];
      const log = q(".data-log")[0];
      const scan = q(".scan")[0];
      const season = q(".season")[0];
      const svg = season.querySelector("svg")!;
      const dots = q(".season .sg-dot");
      const path = q(".season .sg-path")[0];
      const scrambles = q("[data-scramble]");
      const originals = scrambles.map((el) => el.innerHTML);

      // Movement A: the window opens around the caret the edge left at the centre.
      const W = chat.offsetWidth;
      const H = chat.offsetHeight;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const caretH = Math.round((size.touch ? 2.6 : 6) * rem * 0.8);
      const input = boxOf(q(".chat-input")[0])!;
      gsap.set(chat, { clipPath: `inset(${(H - caretH) / 2}px ${(W - 2) / 2}px ${(H - caretH) / 2}px ${(W - 2) / 2}px round 2px)` });
      tl.to(chat, { clipPath: "inset(0px 0px 0px 0px round 20px)", duration: 0.08, ease: "power3.inOut" }, 0);
      gsap.set(caret, { x: size.w / 2 - 1, y: size.h / 2 - caretH / 2, width: 2, height: caretH, autoAlpha: 1 });
      tl.to(caret, { x: input.x, y: input.y + (input.h - 22) / 2, height: 22, duration: 0.07, ease: "power2.inOut" }, 0.004);
      tl.set(caret, { autoAlpha: 0 }, 0.077);
      tl.set(q(".chat-caret"), { autoAlpha: 1 }, 0.077);

      gsap.set([you, ai], { autoAlpha: 0 });
      const reply = () => q(".chat-ai .w");
      gsap.set(reply(), { opacity: 0 });

      // Movement B: the log streams up past the scanning bar.
      const rowH = log.firstElementChild ? (log.firstElementChild as HTMLElement).offsetHeight : 20;
      const logH = log.scrollHeight;
      const logTop = boxOf(log)!.y;
      const yStart = size.h - logTop + 20;
      const yEnd = -logH + size.h * 0.35 - logTop;
      tl.to(chat, { autoAlpha: 0, y: -size.h * 0.04, duration: 0.05, ease: "power1.in" }, 0.39);
      tl.fromTo(log, { autoAlpha: 0, y: yStart }, { autoAlpha: 1, y: yEnd, duration: 0.24, ease: "none" }, 0.37);
      tl.to(log, { autoAlpha: 0, duration: 0.04 }, 0.6);

      // Movement C: every row collapses into its week in the calendar.
      const g = boxOf(svg)!;
      const vbW = size.touch ? GRID_V.w : GRID.w;
      const vbH = size.touch ? GRID_V.h : GRID.h;
      const scale = Math.min(g.w / vbW, g.h / vbH);
      const ox = g.x + (g.w - vbW * scale) / 2;
      const oy = g.y + (g.h - vbH * scale) / 2;
      const logX = boxOf(log)!.x + rem * 2;
      const yAt60 = yStart + (yEnd - yStart) * ((0.6 - 0.37) / 0.24);
      tl.fromTo(season, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.015 }, 0.595);
      dots.forEach((dot, i) => {
        const fromX = (logX - ox) / scale;
        const fromY = (logTop + yAt60 + i * rowH + rowH / 2 - oy) / scale;
        const cx = Number(dot.getAttribute("cx"));
        const cy = Number(dot.getAttribute("cy"));
        tl.fromTo(dot, { attr: { cx: fromX, cy: fromY }, opacity: 0 }, { attr: { cx, cy }, opacity: 1, duration: 0.09, ease: "power3.out" }, 0.6 + (i / dots.length) * 0.03);
      });
      tl.fromTo(q(".season .sg-cols line"), { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: 0.002 }, 0.64);

      const rejected = dots.filter((d) => d.dataset.chosen !== "true");
      const chosen = dots.filter((d) => d.dataset.chosen === "true").sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
      gsap.set(dots, { fill: "#B9A8F5", fillOpacity: 0.55 });
      tl.to(rejected, { fillOpacity: 0.15, duration: 0.04 }, 0.72);
      chosen.forEach((dot, k) => {
        const at = 0.73 + (k / Math.max(1, chosen.length)) * 0.11;
        tl.to(dot, { fill: "#FF7A2F", fillOpacity: 1, duration: 0.012 }, at);
        tl.fromTo(dot, { attr: { r: 8 } }, { attr: { r: 15 }, duration: 0.008, ease: "power2.out", yoyo: true, repeat: 1 }, at);
      });
      tl.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.1, ease: "power1.inOut" }, 0.85);

      const onCue = cues([
        {
          at: 0.08,
          on: () => {
            placeholder.style.opacity = "0";
            return R.type(typed, PROMPT);
          },
          off: () => {
            typed.textContent = "";
            placeholder.style.opacity = "1";
          },
        },
        {
          at: 0.2,
          on: () => {
            const t = gsap.timeline();
            t.to(send, { scale: 1.2, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 });
            t.call(() => {
              typed.textContent = "";
              placeholder.style.opacity = "1";
            }, undefined, 0.14);
            t.fromTo(you, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.12);
            return t;
          },
          off: () => {
            gsap.set(you, { autoAlpha: 0 });
            typed.textContent = PROMPT;
            placeholder.style.opacity = "0";
          },
        },
        {
          at: 0.23,
          on: () => {
            gsap.set(ai, { autoAlpha: 1 });
            return gsap.to(reply(), { opacity: 1, duration: 0.06, stagger: 0.032, ease: "none" });
          },
          off: () => {
            gsap.set(ai, { autoAlpha: 0 });
            gsap.set(reply(), { opacity: 0 });
          },
        },
        {
          at: 0.35,
          on: () => {
            chat.classList.add("is-data");
            const t = gsap.timeline();
            scrambles.forEach((el) => t.to(el, { duration: 0.8, ease: "none", scrambleText: { text: noise(el.textContent ?? ""), chars: NOISE, speed: 0.8 } }, 0));
            t.to(bg, { opacity: 0, duration: 0.6, ease: "power1.out" }, 0.15);
            return t;
          },
          off: () => {
            chat.classList.remove("is-data");
            scrambles.forEach((el, i) => {
              gsap.killTweensOf(el);
              el.innerHTML = originals[i];
            });
            gsap.set(bg, { opacity: 1 });
          },
        },
      ]);

      return (b) => {
        onCue(b.progress);
        scan.dataset.on = String(b.progress > 0.38 && b.progress < 0.6);
        // Behind the doubters the season dims to 30 percent, then leaves.
        const h = b.hide;
        set.style.opacity = String(h < 0.25 ? 1 - 0.7 * (h / 0.25) : h > 0.85 ? 0.3 * (1 - (h - 0.85) / 0.15) : 0.3);
      };
    },
    [size.w, size.h, size.touch],
  );

  return (
    <div className="beat" ref={scope} data-beat="algorithm">
      <div className="L L-set algo-set">
        <div className="chat">
          <div className="chat-bg" />
          <p className="chat-title" data-scramble>
            {c.app}
          </p>
          <div className="chat-thread">
            <div className="chat-you">
              <p data-scramble>{PROMPT}</p>
            </div>
            <div className="chat-ai">
              <span className="chat-avatar" />
              <div className="chat-ai-text">
                {REPLY.map((line) => (
                  <p key={line} data-scramble>
                    {line.split(" ").map((w, i) => (
                      <span className="w" key={i}>
                        {w}{" "}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="chat-composer">
            <p className="chat-input">
              <span className="chat-typed" />
              <span className="chat-caret" />
              <span className="chat-placeholder">{c.composer}</span>
            </p>
            <span className="chat-send">
              <SendIcon />
            </span>
          </div>
        </div>

        <div className="data-log">
          {MEETS.map((m, i) =>
            NAMED ? (
              <p className="log-row" key={m.id}>
                <span>{m.date}</span>
                <span>{m.name}</span>
                <span>{m.country}</span>
                <span>{m.category}</span>
              </p>
            ) : (
              <p className="log-row" key={m.id}>
                {maskWidths(i).map((w, k) => (
                  <span className="bar" key={k} style={{ width: `${w}ch` }} />
                ))}
              </p>
            ),
          )}
        </div>
        <div className="scan" data-on="false" />

        <div className="season">
          <SeasonGridSvg vertical={size.touch} />
        </div>
      </div>
      <div className="L L-line">
        <span className="caret-el algo-caret" />
      </div>
    </div>
  );
}
