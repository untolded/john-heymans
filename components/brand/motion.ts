/**
 * Motion values shared by the guide page and its demos. Plain data, not a
 * client module, so the server component can read it too. The same values are
 * in public/brand/motion/motion-tokens.json for anyone working outside this
 * codebase.
 */
export const EASES = [
  { name: "Out", css: "cubic-bezier(0.215, 0.61, 0.355, 1)", gsap: "power3.out", p: [0.215, 0.61, 0.355, 1], use: "Anything arriving. The default." },
  { name: "In", css: "cubic-bezier(0.55, 0.085, 0.68, 0.53)", gsap: "power2.in", p: [0.55, 0.085, 0.68, 0.53], use: "Anything leaving." },
  { name: "In-out", css: "cubic-bezier(0.65, 0, 0.35, 1)", gsap: "power3.inOut", p: [0.65, 0, 0.35, 1], use: "One gesture that moves and settles." },
  { name: "Linear", css: "linear", gsap: "none", p: [0, 0, 1, 1], use: "Anything the scroll is scrubbing. The hand is the ease." },
] as const;
