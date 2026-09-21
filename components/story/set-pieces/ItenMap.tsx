import { geoOrthographic, geoInterpolate } from "d3-geo";
import land from "@/public/story/data/land-points.json";
import { facts, show } from "@/lib/story/data";
import { content } from "@/lib/content";

const W = 800;
const H = 640;

/**
 * The flight as a still: land as dots on an orthographic view between
 * Europe and East Africa, the great-circle route in amber, Iten labelled.
 * The departure city is only named once it is confirmed.
 */
export function ItenMapSvg({ className, labels = true }: { className?: string; labels?: boolean }) {
  const origin = facts.route.origin.value;
  const iten = facts.route.iten.value;
  const departure = show(facts.route.departure);
  const from: [number, number] = departure ? [departure.lon, departure.lat] : [origin.lon, origin.lat];
  const to: [number, number] = [iten.lon, iten.lat];

  const projection = geoOrthographic()
    .rotate([-(from[0] + to[0]) / 2, -(from[1] + to[1]) / 2])
    .clipAngle(90)
    .fitExtent(
      [
        [140, 90],
        [W - 140, H - 90],
      ],
      { type: "MultiPoint", coordinates: [from, to] },
    );

  const points = land as number[];
  let dots = "";
  for (let i = 0; i < points.length; i += 2) {
    const p = projection([points[i], points[i + 1]]);
    if (!p || p[0] < -4 || p[0] > W + 4 || p[1] < -4 || p[1] > H + 4) continue;
    dots += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}h0`;
  }

  const interpolate = geoInterpolate(from, to);
  const route = Array.from({ length: 49 }, (_, i) => projection(interpolate(i / 48))!)
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join("");
  const a = projection(from)!;
  const b = projection(to)!;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`iten-map ${className ?? ""}`} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <path className="im-land" d={dots} />
      <path className="im-route" d={route} />
      <circle className="im-end" cx={a[0]} cy={a[1]} r={5} />
      <circle className="im-end im-iten" cx={b[0]} cy={b[1]} r={6} />
      {labels && departure && (
        <text className="im-label" x={a[0] + 14} y={a[1] + 5}>
          {departure.city}
        </text>
      )}
      {labels && (
        <text className="im-label" x={b[0] + 16} y={b[1] + 5}>
          {content.story.iten.destination}
        </text>
      )}
    </svg>
  );
}
