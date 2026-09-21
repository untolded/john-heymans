import { facts, show } from "@/lib/story/data";
import { fill, num } from "@/lib/story/format";
import { content } from "@/lib/content";

export const MAX_ALT = 2400;
const STEP = 400;

/** Landscape for the desktop stage and the static page; portrait so the climb runs up a phone screen. */
export const altLayout = (portrait = false) =>
  portrait ? { w: 600, h: 900, left: 24, right: 128, top: 40, bottom: 40 } : { w: 1000, h: 520, left: 40, right: 140, top: 40, bottom: 40 };

type Layout = ReturnType<typeof altLayout>;

export const altY = (m: number, L: Layout = altLayout()) => L.top + (1 - m / MAX_ALT) * (L.h - L.top - L.bottom);

/** Where the climb starts: the departure altitude once confirmed, sea level until then. */
export const startAltitude = () => show(facts.route.departure)?.altitude ?? 0;

/** The climb: the amber line leaving the flight and rising to 2,400 m. */
export function climbPath(L: Layout = altLayout()) {
  const x0 = L.left;
  const x1 = L.w - L.right;
  const y0 = altY(startAltitude(), L);
  const y1 = altY(MAX_ALT, L);
  const dx = x1 - x0;
  return `M${x0} ${y0}C${x0 + dx * 0.42} ${y0} ${x0 + dx * 0.5} ${y1} ${x1} ${y1}`;
}

/**
 * Altitude lines every 400 m, labelled at the right, and the climb drawn
 * across them. The animated beat draws the same elements in order.
 */
export function AltitudeSvg({ className, portrait = false }: { className?: string; portrait?: boolean }) {
  const L = altLayout(portrait);
  const levels = Array.from({ length: MAX_ALT / STEP + 1 }, (_, i) => i * STEP);
  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} className={`altitude ${className ?? ""}`} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g className="alt-levels">
        {levels.map((m) => (
          <g key={m} className="alt-level" data-m={m}>
            <line x1={L.left} x2={L.w - L.right} y1={altY(m, L)} y2={altY(m, L)} />
            <text x={L.w - L.right + 18} y={altY(m, L) + 6}>
              {fill(content.story.iten.altitude, { n: num(m) })}
            </text>
          </g>
        ))}
      </g>
      <path className="alt-climb" d={climbPath(L)} />
      <circle className="alt-top" cx={L.w - L.right} cy={altY(MAX_ALT, L)} r={6} />
    </svg>
  );
}
