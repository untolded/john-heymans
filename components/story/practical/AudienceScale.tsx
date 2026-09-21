import { content } from "@/lib/content";

const p = content.story.practical;
const MIN = 6;
const MAX = 1600;

/** Position on a logarithmic scale of people in the room, in percent. */
const x = (people: number) => (Math.log(people / MIN) / Math.log(MAX / MIN)) * 100;

/**
 * Where it works, as a drawn scale: one amber line from a dinner table of
 * eight to a hall of a thousand, logarithmic so every setting gets room, with
 * a leader from each mark down to its column.
 */
export function AudienceScale() {
  const n = p.scale.length;
  return (
    <div className="scale">
      <svg className="scale-svg" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true">
        <line className="scale-rule" x1="0" x2="1000" y1="14" y2="14" />
        {p.scale.map((s, i) => {
          const at = x(s.at) * 10;
          const col = (i / n) * 1000 + 2;
          return (
            <g key={s.title}>
              <line className="scale-tick" x1={at} x2={at} y1="4" y2="24" />
              <path className="scale-leader" d={`M${at} 24 L${at} 40 L${col} 78 L${col} 90`} />
            </g>
          );
        })}
      </svg>
      <p className="scale-axis" aria-hidden="true">
        {p.scaleAxis}
      </p>
      <ol className="scale-marks">
        {p.scale.map((s) => (
          <li key={s.title} style={{ "--at": `${x(s.at)}%` } as React.CSSProperties} data-reveal="rise">
            <p className="sm-size">{s.size}</p>
            <p className="sm-title">{s.title}</p>
            <p className="sm-detail">{s.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
