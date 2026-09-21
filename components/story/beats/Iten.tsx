"use client";

import { useEffect, useState } from "react";
import { geoInterpolate } from "d3-geo";
import { content } from "@/lib/content";
import { facts, show, mark } from "@/lib/story/data";
import { gsap } from "@/lib/story/gsap";
import { useLoadGate } from "@/lib/story/media";
import { fill, num } from "@/lib/story/format";
import { Globe } from "../set-pieces/Globe";
import { PhotoLayer, reportCredits } from "../media/PhotoLayer";
import { AltitudeSvg, MAX_ALT, altLayout, startAltitude } from "../set-pieces/AltitudeProfile";
import { useBeat } from "./useBeat";
import { useStageSize, boxOf, entryEl } from "./stage";

type LonLat = [number, number];

const c = content.story;
const route = facts.route;
const departure = show(route.departure);
const ORIGIN: LonLat = departure ? [departure.lon, departure.lat] : [route.origin.value.lon, route.origin.value.lat];
const ITEN: LonLat = [route.iten.value.lon, route.iten.value.lat];
const along = geoInterpolate(ORIGIN, ITEN);

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const inOut = gsap.parseEase("power2.inOut");

/**
 * Iten, in three movements. The start line sweeps in from the left and
 * becomes the flight: a great circle drawn across a dotted globe that turns
 * from Belgium to Kenya. The globe dives into western Kenya and gives way to
 * the climb: altitude lines, the amber line rising to 2,400 m, a counter
 * keeping step. At the top, John on the red road in Iten, for the line and
 * lesson 1.
 */
export function Iten() {
  const size = useStageSize();
  const gate = useLoadGate("iten");
  const [points, setPoints] = useState<number[] | null>(null);

  useEffect(() => {
    if (!gate.load || points) return;
    let alive = true;
    fetch("/story/data/land-points.json")
      .then((r) => r.json())
      .then((d: number[]) => alive && setPoints(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [gate.load, points]);

  const scope = useBeat(
    "iten",
    ({ tl, q, root }) => {
      if (!size.w) return;
      const canvas = q("canvas.globe")[0] as unknown as HTMLCanvasElement;
      const photo = q(".ph-iten")[0];
      const photoOut = q(".iten-photo-out")[0];
      const globe = points ? new Globe(canvas, points, { touch: size.touch }) : null;
      globe?.resize(size.w, size.h);

      const set = q(".iten-set")[0];
      const plane = q(".plane")[0];
      const fromLabel = q(".lbl-from")[0];
      const toLabel = q(".lbl-to")[0];
      const sweep = q(".sweep path")[0];
      const alt = q(".alt-wrap")[0];
      const counter = q(".counter")[0];
      const climb = q(".alt-climb")[0] as unknown as SVGPathElement;
      const L = altLayout(size.touch);

      const R = size.touch ? Math.min(size.w * 0.46, size.h * 0.3) : Math.min(size.w, size.h) * 0.42;
      const cx = size.w / 2;
      const cy = size.touch ? size.h * 0.36 : size.h * 0.53;

      // The start line picks up where the opener left it, under DONE at the left edge.
      const done = boxOf(entryEl("opener.title", ".tl:last-child"));
      const y0 = done ? done.y + done.h + Math.max(8, size.h * 0.014) : size.h * 0.7;
      sweep.setAttribute("d", `M0 ${y0} C${cx * 0.45} ${y0} ${cx * 0.75} ${cy} ${cx} ${cy}`);

      tl.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 0.07 }, 0);
      tl.fromTo(sweep, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.07, ease: "power1.inOut" }, 0);
      tl.to(sweep, { opacity: 0, duration: 0.04 }, 0.08);
      tl.to(canvas, { opacity: 0, duration: 0.07 }, 0.42);

      tl.fromTo(alt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.43);
      tl.fromTo(q(".alt-level line"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.05, stagger: 0.005, ease: "power2.out" }, 0.44);
      tl.fromTo(q(".alt-level text"), { opacity: 0 }, { opacity: 1, duration: 0.03, stagger: 0.005 }, 0.47);
      tl.fromTo(counter, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.03, ease: "power2.out" }, 0.48);
      tl.fromTo(climb, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.12, ease: "none" }, 0.5);
      tl.fromTo(q(".alt-top"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.02, ease: "back.out(3)" }, 0.62);
      // At the top of the climb: the place itself, and the man in it.
      tl.fromTo(photo, { opacity: 0 }, { opacity: 1, duration: 0.06, ease: "power1.out" }, 0.65);
      tl.fromTo(q(".ph-iten .pl-inner"), { scale: 1.08 }, { scale: 1, duration: 0.35, ease: "none" }, 0.65);
      tl.to(alt, { autoAlpha: 0, duration: 0.04 }, 0.67);

      const total = climb.getTotalLength();
      const start = startAltitude();
      let lastM = -1;

      return (b) => {
        const p = b.progress;

        if (globe && p < 0.5) {
          const turn = inOut(seg(p, 0.05, 0.4));
          const arc = seg(p, 0.08, 0.36);
          const dive = 1 + 5 * inOut(seg(p, 0.4, 0.49));
          const centre = along(turn) as LonLat;
          globe.draw({ centre, r: R * dive, cx, cy, from: ORIGIN, to: ITEN, arc, dots: 1 - seg(p, 0.44, 0.49) });

          if (arc > 0 && arc < 1) {
            const h = globe.head(ORIGIN, ITEN, arc);
            gsap.set(plane, { x: h.x, y: h.y, rotation: h.angle, autoAlpha: 1 });
          } else gsap.set(plane, { autoAlpha: 0 });

          const [fx, fy, fv] = globe.project(ORIGIN);
          gsap.set(fromLabel, { x: fx, y: fy, autoAlpha: fv && p > 0.05 && p < 0.34 ? 1 : 0 });
          const [tx, ty, tv] = globe.project(ITEN);
          gsap.set(toLabel, { x: tx, y: ty, autoAlpha: tv && arc >= 0.98 && p < 0.43 ? 1 : 0 });
        } else {
          // A fast scroll can jump straight past the flight: nothing of it may linger.
          gsap.set([plane, fromLabel, toLabel].filter(Boolean), { autoAlpha: 0 });
        }

        // The counter reads the altitude at the head of the climb.
        const drawn = seg(p, 0.5, 0.62);
        const pt = climb.getPointAtLength(total * drawn);
        const m = drawn <= 0 ? start : drawn >= 1 ? MAX_ALT : Math.round(((1 - (pt.y - L.top) / (L.h - L.top - L.bottom)) * MAX_ALT) / 10) * 10;
        if (m !== lastM) {
          counter.textContent = fill(c.iten.altitude, { n: num(Math.max(start, m)) });
          lastM = m;
        }

        // Leaving: the last frame holds under the violet dim, then fades; the photo goes with the lesson card.
        const h = b.hide;
        set.style.opacity = String(h < 0.6 ? 1 - 0.7 * (h / 0.6) : 0.3 * (1 - (h - 0.6) / 0.4));
        const out = h < 0.2 ? 1 - h / 0.2 : 0;
        photoOut.style.opacity = String(out);
        reportCredits(root, b.active && out > 0.3);
      };
    },
    [size.w, size.h, size.touch, points],
  );

  return (
    <div className="beat" ref={scope} data-beat="iten">
      <div className="L iten-photo-out">
        <PhotoLayer slug="iten" beat="iten" focus="50% 30%" className="ph-iten" />
      </div>
      <div className="L L-set iten-set">
        <canvas className="globe" />
        <svg className="L sweep" aria-hidden="true">
          <path />
        </svg>
        <span className="plane" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17 9 7.5 3.2v4L2 6.5 1 3.8H0l.6 5.2L0 14.2h1l1-2.7 5.5-.7v4L17 9Z" fill="currentColor" />
          </svg>
        </span>
        {departure && (
          <span className="map-label lbl-from" data-marker={mark(route.departure) ? c.dev.pending : undefined}>
            {departure.city}
          </span>
        )}
        <span className="map-label lbl-to">{c.iten.destination}</span>
        <div className="alt-wrap">
          <p className="counter" aria-hidden="true">
            {fill(c.iten.altitude, { n: num(startAltitude()) })}
          </p>
          <AltitudeSvg className="alt-svg" portrait={size.touch} />
        </div>
      </div>
    </div>
  );
}
