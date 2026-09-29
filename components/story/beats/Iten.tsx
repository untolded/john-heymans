"use client";

import { useEffect, useState } from "react";
import { geoInterpolate } from "d3-geo";
import { content } from "@/lib/content";
import { facts, show, mark } from "@/lib/story/data";
import { gsap } from "@/lib/story/gsap";
import { v } from "@/lib/story/beats";
import { useLoadGate } from "@/lib/story/media";
import { Globe } from "../set-pieces/Globe";
import { VideoLayer, playWhile } from "../media/VideoLayer";
import { useBeat } from "./useBeat";
import { useStageSize } from "./stage";

type LonLat = [number, number];

const c = content.story;
const route = facts.route;
const departure = show(route.departure);
const ORIGIN: LonLat = departure ? [departure.lon, departure.lat] : [route.origin.value.lon, route.origin.value.lat];
const ITEN: LonLat = [route.iten.value.lon, route.iten.value.lat];
const along = geoInterpolate(ORIGIN, ITEN);

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
/** A moment in this beat, in viewport heights of scroll. */
const at = (vh: number) => v("iten", vh);
// The flight: Brussels is marked once the title has gone, the globe turns, the arc draws; Iten is
// marked when it lands, and both marks stay until the dive.
const PINS = at(42);
const TURN = [at(42), at(100)] as const;
const ARC = [at(46), at(94)] as const;
const DIVE = [at(104), at(126)] as const;
const inOut = gsap.parseEase("power2.inOut");

/**
 * Iten, in three movements. The globe appears behind the chapter's title.
 * Then the flight: Brussels marked with a dot, a great circle drawn across
 * the globe as it turns from Belgium to Kenya, Iten marked where it lands.
 * The globe dives into western Kenya and lands, still diving, in the pack
 * running at the camera on the red road, for the second line.
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
    ({ tl, q }) => {
      if (!size.w) return;
      const canvas = q("canvas.globe")[0] as unknown as HTMLCanvasElement;
      const mediaOut = q(".iten-media-out")[0];
      const pack = q(".vd-pack")[0];
      const globe = points ? new Globe(canvas, points, { touch: size.touch }) : null;
      globe?.resize(size.w, size.h);

      const set = q(".iten-set")[0];
      const plane = q(".plane")[0];
      const fromLabel = q(".lbl-from")[0];
      const toLabel = q(".lbl-to")[0];

      const R = size.touch ? Math.min(size.w * 0.46, size.h * 0.3) : Math.min(size.w, size.h) * 0.42;
      const cx = size.w / 2;
      const cy = size.touch ? size.h * 0.42 : size.h * 0.53;

      tl.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: at(8) }, 0);
      // The dive does not stop at the globe: the pack on the red road takes over, still falling towards it.
      tl.to(canvas, { opacity: 0, duration: at(10) }, at(122));
      tl.fromTo(pack, { opacity: 0 }, { opacity: 1, duration: at(10), ease: "power1.out" }, at(114));
      tl.fromTo(q(".vd-pack .pl-inner"), { scale: 1.4 }, { scale: 1, duration: at(50), ease: "power2.out" }, at(114));
      // Darkens the dust at the top while the line sits there.
      tl.fromTo(q(".vd-scrim"), { opacity: 0 }, { opacity: 1, duration: at(8) }, at(124));

      return (b) => {
        const p = b.progress;

        if (globe && p < at(134)) {
          const turn = inOut(seg(p, ...TURN));
          const arc = seg(p, ...ARC);
          const dive = 1 + 5 * inOut(seg(p, ...DIVE));
          const centre = along(turn) as LonLat;
          globe.draw({ centre, r: R * dive, cx, cy, from: ORIGIN, to: ITEN, arc, dots: 1 - seg(p, at(112), DIVE[1]) });

          if (arc > 0 && arc < 1) {
            const h = globe.head(ORIGIN, ITEN, arc);
            gsap.set(plane, { x: h.x, y: h.y, rotation: h.angle, autoAlpha: 1 });
          } else gsap.set(plane, { autoAlpha: 0 });

          // Both marks go together, as the dive starts.
          const marked = p >= PINS && p < DIVE[0];
          const [fx, fy, fv] = globe.project(ORIGIN);
          if (fromLabel) {
            gsap.set(fromLabel, { x: fx, y: fy });
            fromLabel.dataset.on = String(marked && fv);
          }
          const [tx, ty, tv] = globe.project(ITEN);
          gsap.set(toLabel, { x: tx, y: ty });
          toLabel.dataset.on = String(marked && tv && arc >= 0.98);
        } else {
          // A fast scroll can jump straight past the flight: nothing of it may linger.
          gsap.set(plane, { autoAlpha: 0 });
          [fromLabel, toLabel].forEach((el) => el && (el.dataset.on = "false"));
        }

        // Leaving: the pack fades as the edge's first line arrives.
        const h = b.hide;
        set.style.opacity = String(h < 0.6 ? 1 - 0.7 * (h / 0.6) : 0.3 * (1 - (h - 0.6) / 0.4));
        const out = h < 0.2 ? 1 - h / 0.2 : 0;
        mediaOut.style.opacity = String(out);
        playWhile(pack, (b.active ? 1 : 0) * out * Number(gsap.getProperty(pack, "opacity")), "pack@iten");
      };
    },
    [size.w, size.h, size.touch, points],
  );

  return (
    <div className="beat" ref={scope} data-beat="iten">
      <div className="L iten-media-out">
        <VideoLayer name="pack" beat="iten" className="vd-pack" />
        <div className="L L-media vd-scrim" />
      </div>
      <div className="L L-set iten-set">
        <div className="L globe-wrap">
          <canvas className="globe" />
        </div>
        <span className="plane" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17 9 7.5 3.2v4L2 6.5 1 3.8H0l.6 5.2L0 14.2h1l1-2.7 5.5-.7v4L17 9Z" fill="currentColor" />
          </svg>
        </span>
        {departure && (
          <span className="map-label lbl-from" data-on="false" data-marker={mark(route.departure) ? c.dev.pending : undefined}>
            {c.iten.origin}
          </span>
        )}
        <span className="map-label lbl-to" data-on="false">
          {c.iten.destination}
        </span>
      </div>
    </div>
  );
}
