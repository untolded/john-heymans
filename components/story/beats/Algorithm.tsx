"use client";

import Image from "next/image";
import { content } from "@/lib/content";
import { gsap } from "@/lib/story/gsap";
import { v } from "@/lib/story/beats";
import * as R from "@/lib/story/reveals";
import { ChatAnswer } from "../set-pieces/ChatAnswer";
import { SendIcon } from "../icons";
import { useBeat, cues } from "./useBeat";
import { useStageSize, layoutBox } from "./stage";

const c = content.story.algorithm;

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** A moment in this beat, in viewport heights of scroll. */
const at = (vh: number) => v("algorithm", vh);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
/** The answer appears once the window is open; its lines are written across this stretch of scroll. */
const CODE_IN = at(12);
const LINES = [at(14), at(58)] as const;

/**
 * The set piece. The title rises over the stage, then the dot the edge
 * dropped becomes the running light under ChatGPT in a Mac dock; the icon
 * bounces and the window opens out of it. No prompt and no thinking: the
 * answer is the code, written fast as the reader scrolls, the thread
 * scrolling up as it grows. Everything stays inside the window. When the
 * ranking chart arrives, the title fades and the window folds back into the
 * dock.
 */
export function Algorithm() {
  const size = useStageSize();

  const scope = useBeat(
    "algorithm",
    ({ q }) => {
      if (!size.w) return;
      const chat = q(".chat")[0];
      const shell = q(".chat-min")[0];
      const view = q(".chat-view")[0];
      const thread = q(".chat-thread")[0];
      const dock = q(".dock")[0];
      const panel = q(".dock-panel")[0];
      const app = q(".dock-app")[0];
      const dot = q(".dock-dot")[0];
      const head = q(".algo-head")[0];
      const title = q(".algo-title")[0];
      const avatar = q(".chat-avatar")[0];
      const code = q(".code")[0];
      const lines = q(".code-line");

      // Where the window opens from and folds back into: the icon in the dock.
      const icon = layoutBox(app)!;
      const win = layoutBox(chat)!;
      const dx = icon.x + icon.w / 2 - (win.x + win.w / 2);
      const dy = icon.y + icon.h / 2 - (win.y + win.h / 2);

      gsap.set([avatar, code, ...lines], { autoAlpha: 0 });
      gsap.set(chat, { x: dx, y: dy, scale: 0.05, autoAlpha: 0 });
      gsap.set(panel, { yPercent: 160 });
      gsap.set(dot, { autoAlpha: 1 });
      R.reset(title);
      let titleRevert: (() => void) | null = null;
      thread.style.transform = "";

      // The thread keeps the newest line in view. Everything is laid out from the start and only
      // revealed, so this moves by transform and nothing on the page reflows. The thread is the offset
      // parent of every line (see .chat-thread in the CSS); it sits below the view's padding.
      // Measured when it moves, so a late web font never leaves it stale.
      let followed = Number.NaN;
      const follow = (i: number, instant = false) => {
        if (i === followed) return;
        followed = i;
        const line = lines[i];
        const y = line ? Math.min(0, view.clientHeight - thread.offsetTop - 20 - (line.offsetTop + line.offsetHeight)) : 0;
        gsap.to(thread, { y, duration: instant ? 0 : 0.35, ease: "power2.out", overwrite: true });
      };

      const onCue = cues([
        {
          // The heading first, like every title in the story: its lines rise inside a mask.
          at: at(1),
          on: () => {
            const r = R.rise(title);
            titleRevert = r.revert;
            return r.tl;
          },
          off: () => {
            titleRevert?.();
            titleRevert = null;
            R.reset(title);
          },
        },
        {
          // Launching: the dock slides up, the icon bounces twice, the window zooms out of it.
          at: at(4),
          on: () => {
            const t = gsap.timeline();
            t.to(panel, { yPercent: 0, duration: 0.4, ease: "power3.out" });
            t.to(app, { y: -0.45 * icon.h, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 3, repeatDelay: 0.02 }, 0.3);
            t.to(chat, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "expo.out" }, 0.9);
            return t;
          },
          off: () => {
            gsap.set(panel, { yPercent: 160 });
            gsap.set(app, { y: 0 });
            gsap.set(chat, { x: dx, y: dy, scale: 0.05, autoAlpha: 0 });
          },
        },
        {
          at: CODE_IN,
          on: () => gsap.fromTo([avatar, code], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }),
          off: () => void gsap.set([avatar, code], { autoAlpha: 0 }),
        },
        // The code is written as the reader scrolls, a line at a time, and the window keeps the newest
        // line in view, as ChatGPT does while it answers.
        ...lines.map((line, i) => ({
          at: LINES[0] + (i * (LINES[1] - LINES[0])) / lines.length,
          on: () => {
            gsap.set(line, { autoAlpha: 1 });
            follow(i);
          },
          off: () => {
            gsap.set(line, { autoAlpha: 0 });
            follow(i - 1);
          },
        })),
      ]);

      // Reached the chat part-way (a jump, a reload): place the thread without animating it.
      follow(-1, true);

      return (b) => {
        onCue(b.progress);
        // The heading steps away first as the chart arrives.
        head.style.opacity = String(1 - seg(b.hide, 0, 0.12));
        // Folding away as the chart arrives: into the icon, then the dock slides down.
        const m = seg(b.hide, 0.02, 0.18);
        gsap.set(shell, { x: dx * m, y: dy * m, scale: 1 - 0.95 * m, autoAlpha: 1 - seg(m, 0.55, 1) });
        const away = seg(b.hide, 0.2, 0.3);
        gsap.set(dock, { yPercent: 160 * away, autoAlpha: 1 - away });
        // The running light belongs to the dock from the first frame, so the edge's dot lands on it.
        dot.style.opacity = b.progress > 0 || b.hide > 0 ? "1" : "0";
      };
    },
    [size.w, size.h, size.touch],
  );

  return (
    <div className="beat" ref={scope} data-beat="algorithm">
      <div className="L L-set algo-set">
        <div className="algo-stack">
          <div className="algo-head">
            <p className="display algo-title">{c.title}</p>
          </div>
          <div className="chat-min">
            <div className="chat">
              <div className="chat-bg" />
              <div className="chat-bar">
                <span className="traffic" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <p className="chat-title">
                  <Image className="chat-logo" src="/story/brand/chatgpt-white.png" alt="" width={18} height={18} unoptimized />
                  <span>{c.app}</span>
                </p>
              </div>
              <div className="chat-view">
                <div className="chat-thread">
                  <div className="chat-ai">
                    <span className="chat-avatar">
                      <Image src="/story/brand/chatgpt-white.png" alt="" width={18} height={18} unoptimized />
                    </span>
                    <div className="chat-ai-body">
                      <ChatAnswer />
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-composer">
                <p className="chat-input">{c.composer}</p>
                <span className="chat-send">
                  <SendIcon />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dock">
          <div className="dock-panel">
            <span className="dock-app">
              <Image src="/story/brand/chatgpt-black.png" alt="" width={40} height={40} unoptimized />
            </span>
          </div>
          <span className="dock-dot" />
        </div>
      </div>
    </div>
  );
}
