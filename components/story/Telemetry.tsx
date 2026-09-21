"use client";

import { useEffect, useRef } from "react";
import { TELEMETRY, telemetryPending } from "@/lib/story/telemetry";
import { local, type BeatId } from "@/lib/story/beats";
import { story } from "@/lib/story/store";
import { gsap } from "@/lib/story/gsap";
import { SHOW_PENDING } from "@/lib/story/data";
import { content } from "@/lib/content";

const MAX = 4;

/**
 * The algorithm thinking out loud. Up to four lines, newest at the bottom;
 * a line types on with a scramble when its threshold is crossed, older lines
 * fade back, and the log clears when the chapter changes. Scrolling back
 * removes lines past their threshold. Built imperatively: it updates every
 * frame and must never cause a React render.
 */
export function Telemetry() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = host.current!;
    const nodes = new Map<string, HTMLElement>();
    let chapter: BeatId | null = null;
    let dueKey = "";

    const clear = () => {
      nodes.forEach((n) => {
        gsap.killTweensOf(n);
        n.remove();
      });
      nodes.clear();
      dueKey = "";
    };

    return story.onTime((t, s) => {
      if (s.current !== chapter) {
        clear();
        chapter = s.current;
      }
      if (!chapter) return;
      const p = local(t, chapter);
      const due = TELEMETRY.filter((e) => e.beat === chapter && p >= e.at && e.text() != null);
      const key = due.map((e) => e.id).join(",");
      if (key === dueKey) return;
      const before = new Set(dueKey.split(","));
      dueKey = key;

      const visible = due.slice(-MAX);
      const keep = new Set(visible.map((e) => e.id));
      nodes.forEach((n, id) => {
        if (!keep.has(id)) {
          gsap.killTweensOf(n);
          n.remove();
          nodes.delete(id);
        }
      });

      visible.forEach((e, i) => {
        let n = nodes.get(e.id);
        const text = e.text()!;
        if (!n) {
          n = document.createElement("p");
          n.className = "tl-line";
          if (SHOW_PENDING && telemetryPending(e.id)) n.dataset.marker = content.story.dev.pending;
          nodes.set(e.id, n);
          if (before.has(e.id)) n.textContent = text;
          else gsap.to(n, { duration: 0.4, ease: "none", scrambleText: { text, chars: "01<>/[]=+", speed: 1 } });
        }
        if (!n.isConnected) box.appendChild(n);
        const age = visible.length - 1 - i;
        n.dataset.age = String(age);
        n.style.transform = `translateY(${-age * 100}%)`;
      });
    });
  }, []);

  return <div className="telemetry" ref={host} />;
}
