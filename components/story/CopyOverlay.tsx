"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { SCRIPT, type CopyEntry, type Slot } from "@/lib/story/script";
import { at, BEAT_INDEX } from "@/lib/story/beats";
import { story } from "@/lib/story/store";
import { gsap } from "@/lib/story/gsap";
import * as R from "@/lib/story/reveals";
import { Text } from "./Text";

const c = content.story;
const SLOTS: Slot[] = ["centre", "under", "copy", "lesson"];
const DEFAULT_HOLD = 700;

type Live = {
  /** The entry the story says should be showing. */
  target: string | null;
  /** The entry actually on screen, possibly on its way out. */
  visible: string | null;
  seq: gsap.core.Timeline | null;
  reveal: gsap.core.Timeline | null;
  reverts: (() => void)[];
  words: HTMLElement[] | null;
  wordsOn: number;
  shownAt: number;
  tShown: number;
};

function Entry({ e }: { e: CopyEntry }) {
  return (
    <div className={`entry k-${e.kind}`} data-entry={e.id}>
      <p className="e-text">
        <Text text={e.text(c)} />
      </p>
      {e.sub && <p className="e-sub">{e.sub(c)}</p>}
      {e.meta && <p className="e-meta">{e.meta(c)}</p>}
    </div>
  );
}

/**
 * Story copy, swapped rather than scrubbed. Per slot it finds the one entry
 * whose window contains the current story time, lets the outgoing entry
 * leave (250ms), then reveals the next. A fast scroll kills the exit and
 * reveals at once; minHold stops flicker when the visitor hovers around a
 * threshold. Hidden from assistive technology: the static story carries the
 * same text in order.
 */
export function CopyOverlay() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current!;
    const byId = new Map(SCRIPT.map((e) => [e.id, e]));
    const node = (id: string) => host.querySelector<HTMLElement>(`[data-entry="${CSS.escape(id)}"]`)!;
    const fresh = (): Live => ({ target: null, visible: null, seq: null, reveal: null, reverts: [], words: null, wordsOn: 0, shownAt: 0, tShown: 0 });
    const live: Record<Slot, Live> = { centre: fresh(), under: fresh(), copy: fresh(), lesson: fresh() };
    let lastT = story.get().t;
    let timer = 0;
    let started = false;

    SCRIPT.forEach((e) => R.reset(node(e.id)));

    const hide = (l: Live, id: string) => {
      l.reveal?.kill();
      l.reveal = null;
      l.reverts.forEach((fn) => fn());
      l.reverts = [];
      l.words = null;
      l.wordsOn = 0;
      R.reset(node(id));
      if (l.visible === id) l.visible = null;
    };

    const stepWords = (e: CopyEntry, l: Live, t: number) => {
      if (!e.steps || !l.words) return;
      // Unclamped: a title may begin before its beat, while the stage slides in.
      const p = t - BEAT_INDEX[e.beat];
      let count = e.steps.filter((s) => p >= s).length;
      if (count >= e.steps.length) count = l.words.length;
      if (count > l.wordsOn) R.wordsIn(l.words.slice(l.wordsOn, count));
      else if (count < l.wordsOn) R.wordsOut(l.words.slice(count, l.wordsOn));
      l.wordsOn = count;
    };

    const reveal = (l: Live, id: string, t: number) => {
      const e = byId.get(id)!;
      const el = node(id);
      l.visible = id;
      l.shownAt = performance.now();
      l.tShown = t;
      gsap.set(el, { autoAlpha: 1, clearProps: "transform,filter" });

      const text = el.querySelector<HTMLElement>(".e-text")!;
      const sub = el.querySelector<HTMLElement>(".e-sub");
      const meta = el.querySelector<HTMLElement>(".e-meta");
      const tl = gsap.timeline();

      if (e.reveal === "words") {
        const w = R.words(text, { stagger: e.steps ? 0 : 0.11 });
        l.words = w.words;
        l.wordsOn = e.steps ? 0 : w.words.length;
        l.reverts.push(w.revert);
        tl.add(w.tl, 0);
        if (e.steps) stepWords(e, l, t);
      } else {
        const r = e.reveal === "ink" ? R.ink(text) : R.rise(text);
        l.reverts.push(r.revert);
        tl.add(r.tl, 0);
      }
      if (sub) {
        const r = R.rise(sub);
        l.reverts.push(r.revert);
        tl.add(r.tl, e.reveal === "ink" ? 0.5 : 0.2);
      }
      if (meta) tl.add(R.rise(meta, { small: true }).tl, e.reveal === "ink" ? 0.8 : 0.35);
      l.reveal = tl;
    };

    const swap = (slot: Slot, next: string | null, t: number) => {
      const l = live[slot];
      l.target = next;
      const busy = l.seq != null;
      l.seq?.kill();
      l.seq = null;

      const prev = l.visible;
      if (prev && prev === next && busy) {
        // Came back to the entry that was on its way out: bring it back whole.
        hide(l, prev);
        reveal(l, next, t);
        return;
      }
      if (prev && prev !== next) {
        if (busy) {
          // Scrolling fast: no exit, straight to the new entry.
          hide(l, prev);
          if (next) reveal(l, next, t);
          return;
        }
        const tween = R.exit(node(prev), byId.get(prev)!.exit ?? "rise");
        l.seq = gsap.timeline({
          onComplete: () => {
            l.seq = null;
            hide(l, prev);
            if (l.target) reveal(l, l.target, lastT);
          },
        });
        if (tween) l.seq.add(tween);
        return;
      }
      if (!prev && next) reveal(l, next, t);
    };

    const evaluate = (t: number) => {
      lastT = t;
      let waitFor = 0;
      for (const slot of SLOTS) {
        const l = live[slot];
        const next = SCRIPT.find((e) => e.slot === slot && t >= at(e.from) && t < at(e.to))?.id ?? null;
        if (next === l.target) {
          if (next && next === l.visible) stepWords(byId.get(next)!, l, t);
          continue;
        }
        // A small move back and forth around a threshold must not flicker.
        const current = l.visible ? byId.get(l.visible)! : null;
        const held = performance.now() - l.shownAt;
        const hold = current?.minHold ?? DEFAULT_HOLD;
        if (current && l.target === l.visible && held < hold && Math.abs(t - l.tShown) < 0.03) {
          waitFor = Math.max(waitFor, hold - held);
          continue;
        }
        swap(slot, next, t);
      }
      // Text never sits on a busy image: scrims behind the copy, and busy set pieces step back behind titles.
      host.dataset.lesson = String(live.lesson.target != null);
      host.dataset.copy = String(live.copy.target != null);
      const centre = live.centre.target ? byId.get(live.centre.target) : null;
      host.dataset.centre = String(!!centre && centre.kind !== "record");
      window.clearTimeout(timer);
      if (waitFor) timer = window.setTimeout(() => evaluate(lastT), waitFor + 16);
    };

    let off: (() => void) | null = null;
    void document.fonts.ready.then(() => {
      if (started) return;
      started = true;
      off = story.onTime((t) => evaluate(t));
    });

    return () => {
      started = true;
      off?.();
      window.clearTimeout(timer);
      SLOTS.forEach((s) => {
        live[s].seq?.kill();
        if (live[s].visible) hide(live[s], live[s].visible!);
      });
    };
  }, []);

  return (
    <div className="copy-overlay" ref={root} data-lesson="false" data-copy="false" data-centre="false">
      <div className="copy-scrim" />
      <div className="lesson-scrim" />
      {SLOTS.map((slot) => (
        <div className={`slot slot-${slot}`} key={slot}>
          {SCRIPT.filter((e) => e.slot === slot).map((e) => (
            <Entry key={e.id} e={e} />
          ))}
        </div>
      ))}
    </div>
  );
}
