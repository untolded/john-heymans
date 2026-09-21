"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin, useGSAP);
  gsap.defaults({ ease: "power2.out", duration: 0.8 });
  registered = true;
}

/** Media condition used by every concept so reduced motion is handled in one place. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 992px)";

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin, useGSAP };
