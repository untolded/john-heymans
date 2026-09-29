"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/story/gsap";
import * as R from "@/lib/story/reveals";
import { useStoryPage } from "../StoryRoot";

/** Everything after the story: the practical part, the bio and the footer. */
const SECTIONS = ".practical, .bio, .footer";

/**
 * Motion after the story, in the story's own vocabulary, each played once as
 * its element reaches 80 percent of the viewport, nothing scrubbed except the
 * photographs:
 *
 *   data-reveal="rise"  headings: lines rise inside a mask, as the story's title cards do
 *   data-reveal="ink"   lesson titles: written left to right with the amber nib
 *   data-reveal="fade"  supporting text and figures: 12px up, a short stagger per group
 *   data-draw="x|y"     thin lines drawn like lane markings (CSS reads --draw)
 *   data-push           a photograph that settles from 1.1 to 1 as it passes
 *
 * Static mode skips all of it, so every element is simply there.
 */
export function PracticalMotion() {
  const { cinema, ready } = useStoryPage();

  useEffect(() => {
    if (!cinema || !ready) return;
    const roots = gsap.utils.toArray<HTMLElement>(SECTIONS);
    if (!roots.length) return;
    const all = <T extends HTMLElement>(sel: string) => roots.flatMap((r) => Array.from(r.querySelectorAll<T>(sel)));
    const revealed: (() => void)[] = [];

    const ctx = gsap.context(() => {
      all("[data-reveal='rise'], [data-reveal='ink']").forEach((el) => {
        gsap.set(el, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: () => revealed.push((el.dataset.reveal === "ink" ? R.ink(el) : R.rise(el)).revert),
        });
      });

      const fades = all("[data-reveal='fade']");
      gsap.set(fades, { autoAlpha: 0, y: 12 });
      ScrollTrigger.batch(fades, {
        // Late enough to be seen, early enough for the bio's figures, which sit at the foot of a full screen.
        start: "top 95%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });

      // Across first, then the lanes down.
      all("[data-draw]").forEach((el) => {
        const down = el.dataset.draw === "y";
        gsap.fromTo(
          el,
          { "--draw": 0 },
          { "--draw": 1, duration: down ? 0.9 : 1.3, delay: down ? 0.45 : 0, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 95%", once: true } },
        );
      });

      all("[data-push]").forEach((el) => {
        gsap.fromTo(el, { scale: 1.1 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      const scale = document.querySelector(".practical .scale-svg");
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
    });
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      revealed.forEach((revert) => revert());
      ctx.revert();
    };
  }, [cinema, ready]);

  return null;
}
