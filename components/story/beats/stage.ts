"use client";

import { useEffect, useState } from "react";

export type Size = { w: number; h: number; touch: boolean };

/** The stage's size. Beats rebuild their timelines when it changes. */
export function useStageSize(): Size {
  const [size, setSize] = useState<Size>({ w: 0, h: 0, touch: false });
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(".stage");
    if (!stage) return;
    const read = () => {
      const w = Math.round(stage.clientWidth);
      const h = Math.round(stage.clientHeight);
      const touch = stage.dataset.touch === "true";
      setSize((s) => (s.w === w && s.h === h && s.touch === touch ? s : { w, h, touch }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);
  return size;
}

export type Box = { x: number; y: number; w: number; h: number };

/** An element's box in stage coordinates. */
export function boxOf(el: Element | null): Box | null {
  const stage = document.querySelector(".stage");
  if (!el || !stage) return null;
  const s = stage.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
}

/** A copy entry's element in the overlay. */
export const entryEl = (id: string, part = ".e-text") => document.querySelector<HTMLElement>(`[data-entry="${id}"] ${part}`);
