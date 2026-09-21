"use client";

import { useEffect } from "react";
import { BEATS, BEAT_INDEX, RELEASE_AT } from "@/lib/story/beats";
import { driver } from "@/lib/story/driver";
import { scroller } from "@/lib/story/scroll";
import { story } from "@/lib/story/store";
import { audio } from "@/lib/story/audio";
import { track } from "@/lib/story/analytics";

const last = BEATS[BEATS.length - 1];

/**
 * The spacers that give the story its length, and the function that turns
 * the scroll position into story state every frame. A tail after the last
 * beat lets the stage hold until the handover reaches its release point.
 */
export function Driver({ touch, ready }: { touch: boolean; ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    const root = document.querySelector<HTMLElement>(".story-root");
    const ground = document.querySelector<HTMLElement>(".story-ground");
    const stage = document.querySelector<HTMLElement>(".stage");
    const spacers = Array.from(document.querySelectorAll<HTMLElement>("[data-spacer]"));
    if (!stage || spacers.length !== BEATS.length) return;

    let width = window.innerWidth;
    const measure = () => {
      driver.measure(spacers, stage.clientHeight);
      driver.update(scroller.y(), ground, root);
    };
    const onResize = () => {
      // Phones resize the viewport as the address bar moves; only a width change re-measures.
      if (touch && window.innerWidth === width) return;
      width = window.innerWidth;
      measure();
    };

    measure();
    void document.fonts.ready.then(measure);
    window.addEventListener("load", measure);
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);

    // Log where people get to, once per beat per visit.
    const reached = new Set<string>();
    const offTime = story.onTime((t, s) => {
      audio.tick(t);
      if (s.current && !reached.has(s.current)) {
        reached.add(s.current);
        track("beat_reached", { beat: s.current });
      }
    });

    const offFrame = scroller.onFrame(() => driver.update(scroller.y(), ground, root));

    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __story: unknown }).__story = {
        seek: (beat: keyof typeof BEAT_INDEX, progress = 0) => scroller.to(driver.yAt(BEAT_INDEX[beat] + progress), { immediate: true }),
        state: () => story.get(),
      };
    }

    return () => {
      offFrame();
      offTime();
      ro.disconnect();
      window.removeEventListener("load", measure);
      window.removeEventListener("resize", onResize);
      driver.clear();
    };
  }, [touch, ready]);

  const tail = `calc(100svh - ${(touch ? last.length.touch : last.length.desktop) * (1 - RELEASE_AT)}vh)`;

  return (
    <div className="spacers" aria-hidden="true">
      {BEATS.map((b) => (
        <div key={b.id} data-spacer={b.id} style={{ height: `${touch ? b.length.touch : b.length.desktop}vh` }} />
      ))}
      <div className="spacer-tail" style={{ height: tail }} />
    </div>
  );
}
