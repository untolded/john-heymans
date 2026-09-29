"use client";

import Image from "next/image";
import { content } from "@/lib/content";
import { gsap } from "@/lib/story/gsap";
import { v } from "@/lib/story/beats";
import * as R from "@/lib/story/reveals";
import { PROMPT } from "@/lib/story/chat";
import { ChatAnswer } from "../set-pieces/ChatAnswer";
import { SendIcon } from "../icons";
import { useBeat, cues } from "./useBeat";
import { useStageSize, layoutBox } from "./stage";

const c = content.story.algorithm;

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** A moment in this beat, in viewport heights of scroll. */
const at = (vh: number) => v("algorithm", vh);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/**
 * The set piece. The dot the edge dropped becomes the running light under
 * ChatGPT in a Mac dock; the icon bounces and the window opens out of it.
 * The prompt types and is sent. The answer builds the way ChatGPT's does:
 * thinking, the code, then the recommendation, the thread scrolling up as it
 * grows. Everything stays inside the window. When the ranking chart arrives,
 * the window folds back into the dock.
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
      const typed = q(".chat-typed")[0];
      const placeholder = q(".chat-placeholder")[0];
      const send = q(".chat-send")[0];
      const dock = q(".dock")[0];
      const panel = q(".dock-panel")[0];
      const app = q(".dock-app")[0];
      const dot = q(".dock-dot")[0];
      const blocks = {
        you: q(".chat-you")[0],
        avatar: q(".chat-avatar")[0],
        think: q(".think")[0],
        code: q(".code")[0],
        rec: q(".rec")[0],
      };
      const steps = q(".think-steps li");
      const lines = q(".code-line");

      // Where the window opens from and folds back into: the icon in the dock.
      const icon = layoutBox(app)!;
      const win = layoutBox(chat)!;
      const dx = icon.x + icon.w / 2 - (win.x + win.w / 2);
      const dy = icon.y + icon.h / 2 - (win.y + win.h / 2);

      const hidden = Object.values(blocks);
      gsap.set(hidden, { autoAlpha: 0 });
      gsap.set([...steps, ...lines], { autoAlpha: 0 });
      gsap.set(chat, { x: dx, y: dy, scale: 0.05, autoAlpha: 0 });
      gsap.set(panel, { yPercent: 160 });
      gsap.set(dot, { autoAlpha: 1 });
      q("[data-state]").forEach((el) => (el.dataset.state = "live"));
      thread.style.transform = "";

      // The thread keeps its newest block in view, as the app does. Everything is laid out from the
      // start and only revealed, so this moves by transform and nothing on the page reflows.
      const order = [blocks.you, blocks.think, blocks.code, blocks.rec];
      let followed: HTMLElement | null = null;
      const follow = (el: HTMLElement | null, instant = false) => {
        if (el === followed) return;
        followed = el;
        // The thread is the offset parent of every block (see .chat-thread in the CSS); it sits below the view's padding.
        const bottom = el ? el.offsetTop + el.offsetHeight : 0;
        const y = Math.min(0, view.clientHeight - thread.offsetTop - bottom - 16);
        gsap.to(thread, { y, duration: instant ? 0 : 0.7, ease: "power3.out", overwrite: true });
      };
      const back = (el: HTMLElement) => follow(order[Math.max(0, order.indexOf(el) - 1)] ?? null);
      const show = (el: HTMLElement, opts: { y?: number } = {}) => gsap.fromTo(el, { autoAlpha: 0, y: opts.y ?? 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
      const state = (el: HTMLElement, s: "live" | "done") => void (el.dataset.state = s);

      const onCue = cues([
        {
          // Launching: the dock slides up, the icon bounces twice, the window zooms out of it.
          at: at(1),
          on: () => {
            const t = gsap.timeline();
            t.to(panel, { yPercent: 0, duration: 0.45, ease: "power3.out" });
            t.to(app, { y: -0.45 * icon.h, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 3, repeatDelay: 0.02 }, 0.35);
            t.to(chat, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.55, ease: "expo.out" }, 1.05);
            return t;
          },
          off: () => {
            gsap.set(panel, { yPercent: 160 });
            gsap.set(app, { y: 0 });
            gsap.set(chat, { x: dx, y: dy, scale: 0.05, autoAlpha: 0 });
          },
        },
        {
          at: at(18),
          on: () => {
            placeholder.style.opacity = "0";
            chat.dataset.typing = "true";
            return R.type(typed, PROMPT, { maxDuration: 2.2 });
          },
          off: () => {
            typed.textContent = "";
            placeholder.style.opacity = "1";
            chat.dataset.typing = "false";
          },
        },
        {
          at: at(38),
          on: () => {
            const t = gsap.timeline();
            t.to(send, { scale: 1.2, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 });
            t.call(() => {
              typed.textContent = "";
              placeholder.style.opacity = "1";
              chat.dataset.typing = "false";
            }, undefined, 0.14);
            t.add(show(blocks.you, { y: 40 }), 0.12);
            return t;
          },
          off: () => {
            gsap.set(blocks.you, { autoAlpha: 0 });
            typed.textContent = PROMPT;
            placeholder.style.opacity = "0";
            chat.dataset.typing = "true";
          },
        },
        {
          at: at(46),
          on: () => {
            gsap.set(blocks.avatar, { autoAlpha: 1 });
            follow(blocks.think);
            return show(blocks.think);
          },
          off: () => {
            gsap.set([blocks.avatar, blocks.think], { autoAlpha: 0 });
            back(blocks.think);
          },
        },
        ...steps.map((li, i) => ({ at: at(54 + i * 9), on: () => show(li, { y: 8 }), off: () => void gsap.set(li, { autoAlpha: 0 }) })),
        { at: at(76), on: () => state(blocks.think, "done"), off: () => state(blocks.think, "live") },
        {
          at: at(80),
          on: () => {
            follow(blocks.code);
            return show(blocks.code);
          },
          off: () => {
            gsap.set(blocks.code, { autoAlpha: 0 });
            back(blocks.code);
          },
        },
        // The code streams in with the scroll, a line at a time.
        ...lines.map((line, i) => ({ at: at(84 + i * (46 / lines.length)), on: () => void gsap.set(line, { autoAlpha: 1 }), off: () => void gsap.set(line, { autoAlpha: 0 }) })),
        {
          at: at(136),
          on: () => {
            follow(blocks.rec);
            return show(blocks.rec);
          },
          off: () => {
            gsap.set(blocks.rec, { autoAlpha: 0 });
            back(blocks.rec);
          },
        },
      ]);

      // Reached the chat part-way (a jump, a reload): place the thread without animating it.
      follow(null, true);

      return (b) => {
        onCue(b.progress);
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
                <div className="chat-you">
                  <p>{PROMPT}</p>
                </div>
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
              <p className="chat-input">
                {/* Invisible full prompt: the composer takes its final height up front, so typing never moves the layout. */}
                <span className="chat-ghost" aria-hidden="true">
                  {PROMPT}
                </span>
                <span className="chat-live">
                  <span className="chat-typed" />
                  <span className="chat-caret" />
                </span>
                <span className="chat-placeholder">{c.composer}</span>
              </p>
              <span className="chat-send">
                <SendIcon />
              </span>
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
