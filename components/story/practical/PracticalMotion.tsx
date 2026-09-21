"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/story/gsap";
import * as R from "@/lib/story/reveals";
import { useStoryPage } from "../StoryRoot";

/**
 * Motion calms down after the story: only rise and ink reveals, each played
 * once when its element reaches 80 percent of the viewport, nothing scrubbed.
 * The audience scale draws its line as it enters. Static mode skips all of
 * it, so every element is simply there.
 */
export function PracticalMotion() {
  const { cinema, ready } = useStoryPage();

  useEffect(() => {
    if (!cinema || !ready) return;
    const root = document.querySelector<HTMLElement>(".practical");
    if (!root) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.set(el, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          // Element-level rises: splitting into line masks re-lays the text out and nudges the page.
          onEnter: () => (el.dataset.reveal === "ink" ? R.ink(el) : R.rise(el, { small: true })),
        });
      });
      const scale = root.querySelector(".scale-svg");
      if (scale) {
        gsap.from(scale.querySelectorAll("line, path"), {
          drawSVG: "0%",
          duration: 1.4,
          ease: "power2.inOut",
          stagger: 0.08,
          clearProps: "strokeDasharray,strokeDashoffset",
          scrollTrigger: { trigger: scale, start: "top 80%", once: true },
        });
      }
    }, root);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [cinema, ready]);

  return null;
}
