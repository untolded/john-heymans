"use client";

import Image from "next/image";
import { photo } from "@/lib/photos";
import { gsap } from "@/lib/story/gsap";
import * as R from "@/lib/story/reveals";
import { credits } from "@/lib/story/credits";
import { useLoadGate } from "@/lib/story/media";
import { HANDWRITING, pose, extent, type Word } from "@/lib/story/handwriting";
import { PhotoLayer, reportCredits } from "../media/PhotoLayer";
import { useBeat, cues } from "./useBeat";
import { useStageSize, boxOf, entryEl } from "./stage";

const ARMS = photo("final-arms");
const IW = HANDWRITING.image.width;
const IH = HANDWRITING.image.height;
// The box around both inscriptions, and the focus points of the two framings.
const WRITING = { x0: 700, y0: 300, x1: 1600, y1: 620 };
const TIGHT_FOCUS: [number, number] = [1150, 460];
const WIDE_FOCUS: [number, number] = [IW / 2, IH / 2];
const WORDS: Word[] = HANDWRITING.phrases.flatMap((p) => p.words);

type Frame = { s: number; x: number; y: number };

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const inOut = gsap.parseEase("power2.inOut");

/** The photo at scale s with a focus point centred, kept covering the stage where it can. */
function place(W: number, H: number, s: number, [fx, fy]: [number, number]): Frame {
  const iw = IW * s;
  const ih = IH * s;
  const x = iw >= W ? Math.min(0, Math.max(W - iw, W / 2 - fx * s)) : (W - iw) / 2;
  const y = ih >= H ? Math.min(0, Math.max(H - ih, H / 2 - fy * s)) : (H - ih) / 2;
  return { s, x, y };
}

/**
 * The final. The heat where he made it, the race itself, then the arms: the
 * frame starts tight on the writing and widens to his face while the amber
 * line writes "HEY MOM" and "MADE IT" over the real ink. The photo dims, the
 * two phrases lift off his arms, straighten and take the centre, then settle
 * above "Dare to dream big.", and the start line from the opener draws under
 * it, closing the loop.
 */
export function Final() {
  const size = useStageSize();
  const gate = useLoadGate("final");

  const scope = useBeat(
    "final",
    ({ tl, q, root }) => {
      if (!size.w) return;
      const W = size.w;
      const H = size.h;
      const media = q(".final-media")[0];
      const heats = q(".ph-heats")[0];
      const pan = q(".ph-pan")[0];
      const frameEl = q(".arms-frame")[0];
      const ink = q(".arms-ink")[0];
      const inkLayer = q(".final-ink")[0];
      const dim = q(".final-dim")[0];
      const closeLine = q(".closeline")[0];

      // Framings: tight on the writing, then the whole photo. Phones keep one framing that shows both arms.
      const sCover = Math.max(W / IW, H / IH);
      const tight = size.touch
        ? place(W, H, Math.min(sCover, (0.94 * W) / (WRITING.x1 - WRITING.x0)), [(WRITING.x0 + WRITING.x1) / 2, (WRITING.y0 + WRITING.y1) / 2])
        : place(W, H, Math.max(sCover, (0.84 * W) / (WRITING.x1 - WRITING.x0)), TIGHT_FOCUS);
      const wide = size.touch ? tight : place(W, H, sCover, WIDE_FOCUS);
      const frameAt = (p: number): Frame => {
        if (size.touch) return tight;
        const u = inOut(seg(p, 0.3, 0.54));
        const s = tight.s * Math.pow(wide.s / tight.s, u);
        return place(W, H, s, [TIGHT_FOCUS[0] + (WIDE_FOCUS[0] - TIGHT_FOCUS[0]) * u, TIGHT_FOCUS[1] + (WIDE_FOCUS[1] - TIGHT_FOCUS[1]) * u]);
      };
      const applyFrame = (f: Frame) => {
        const t = `translate(${f.x}px, ${f.y}px) scale(${f.s})`;
        frameEl.style.transform = t;
        ink.style.transform = t;
      };

      // Where the phrases go, in the photo's coordinates (the ink layer carries the photo's transform).
      const layout = (cap: number, line1: number, line2: number) => {
        const out = new Map<string, { x: number; y: number; rotation: number; scale: number }>();
        HANDWRITING.phrases.forEach((ph, i) => {
          const lineY = i === 0 ? line1 : line2;
          const parts = ph.words.map((w) => {
            const [lo, hi] = extent(w);
            const k = cap / (w.cap[1] - w.cap[0]);
            return { w, lo, k, width: (hi - lo) * k };
          });
          const gap = cap * 0.42;
          let x = W / 2 - (parts.reduce((a, p) => a + p.width, 0) + gap * (parts.length - 1)) / 2;
          for (const p of parts) {
            const sx = x - p.k * p.lo;
            const sy = lineY - p.k * ((p.w.cap[0] + p.w.cap[1]) / 2);
            out.set(p.w.id, { x: (sx - wide.x) / wide.s, y: (sy - wide.y) / wide.s, rotation: 0, scale: p.k / wide.s });
            x += p.width + gap;
          }
        });
        return out;
      };
      const capBig = Math.min(H * 0.12, W / 9.5);
      const big = layout(capBig, H / 2 - capBig * 0.95, H / 2 + capBig * 0.95);
      const capSmall = capBig * 0.4;
      const settled = layout(capSmall, H * 0.16, H * 0.16 + capSmall * 1.85);

      // The photographs.
      tl.fromTo(heats, { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0);
      tl.fromTo(q(".ph-heats .pl-inner"), { scale: 1.08 }, { scale: 1, duration: 0.2 }, 0);
      tl.fromTo(pan, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.16);
      tl.fromTo(q(".ph-pan .pl-inner"), { scale: 1.08 }, { scale: 1, duration: 0.18 }, 0.16);
      tl.to(heats, { opacity: 0, duration: 0.01 }, 0.2);
      tl.fromTo([frameEl, ink], { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.29);
      tl.to(pan, { opacity: 0, duration: 0.01 }, 0.32);
      tl.fromTo(dim, { opacity: 0 }, { opacity: 0.62, duration: 0.06 }, 0.54);
      tl.to(frameEl, { opacity: 0.45, duration: 0.06 }, 0.54);

      // The words: registered on the arms, then centred and upright, then settled above the close.
      WORDS.forEach((w) => {
        const g = ink.querySelector<SVGGElement>(`[data-word="${w.id}"]`);
        if (!g) return;
        const state = pose(w);
        const draw = () => g.setAttribute("transform", `translate(${state.x} ${state.y}) rotate(${state.rotation}) scale(${state.scale})`);
        draw();
        tl.to(state, { ...big.get(w.id)!, duration: 0.08, ease: "power2.inOut", onUpdate: draw }, 0.54);
        tl.to(state, { ...settled.get(w.id)!, duration: 0.08, ease: "power2.inOut", onUpdate: draw }, 0.62);
      });

      // The start line from the opener, under the close.
      const last = boxOf(entryEl("final.close", ".tl:last-child") ?? entryEl("final.close"));
      if (last) gsap.set(closeLine, { x: last.x, y: last.y + last.h + Math.max(8, H * 0.012), width: last.w, scaleX: 0 });
      tl.to(closeLine, { scaleX: 1, duration: 0.06, ease: "power2.inOut" }, 0.76);

      // Writing: each phrase at its own speed, finished at once if the visitor is already past it.
      let p = 0;
      const strokes = (id: string) => Array.from(ink.querySelectorAll<SVGPathElement>(`[data-phrase="${id}"] .hw-stroke`));
      gsap.set(ink.querySelectorAll(".hw-stroke"), { drawSVG: "0%" });
      const write = (id: string, at: number) => ({
        at,
        on: () => {
          const t = R.scribble(strokes(id), { duration: 1.6 });
          if (p > at + 0.16) t.progress(1);
          return t;
        },
        off: () => void gsap.set(strokes(id), { drawSVG: "0%" }),
      });
      const onCue = cues([write("hey-mom", 0.34), write("made-it", 0.44)]);

      return (b) => {
        p = b.progress;
        applyFrame(frameAt(p));
        onCue(p);
        // Leaving for the handover: everything fades with the stadium.
        const out = b.hide < 0.25 ? 1 - b.hide / 0.25 : 0;
        media.style.opacity = String(out);
        inkLayer.style.opacity = String(out);
        reportCredits(root, b.active && out > 0.3);
        credits.report("final-arms@final", ARMS.credit, b.active && out > 0.3 && p > 0.3 && p < 0.58 ? 1 : 0);
      };
    },
    [size.w, size.h, size.touch],
  );

  return (
    <div className="beat" ref={scope} data-beat="final">
      <div className="L L-media final-media">
        <PhotoLayer slug="heats-pack" beat="final" focus="70% 38%" focusMobile="76% 38%" className="ph-heats" />
        <PhotoLayer slug="final-pan" beat="final" focus="50% 55%" focusMobile="46% 55%" className="ph-pan" />
        <div className="arms-frame" style={{ width: IW, height: IH }}>
          {gate.load && <Image src={ARMS.src} alt="" fill sizes="2400px" fetchPriority={gate.priority} />}
        </div>
      </div>
      <div className="L L-dim final-dim" />
      <div className="L L-line final-ink">
        <div className="arms-ink" style={{ width: IW, height: IH }}>
          <svg viewBox={`0 0 ${IW} ${IH}`} className="handwriting" aria-hidden="true">
            {HANDWRITING.phrases.map((ph) => (
              <g key={ph.id} data-phrase={ph.id}>
                {ph.words.map((w) => (
                  <g key={w.id} data-word={w.id}>
                    {w.strokes.map((d, i) => (
                      <path key={i} className="hw-stroke" d={d} style={{ strokeWidth: w.weight }} />
                    ))}
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </div>
        <span className="closeline" />
      </div>
    </div>
  );
}
