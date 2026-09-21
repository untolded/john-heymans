import { HANDWRITING } from "@/lib/story/handwriting";

/**
 * "HEY MOM" and "MADE IT", traced from the real writing on John's arms in
 * the licensed photo final-arms and registered over it in the photo's own
 * pixel coordinates. The static version draws both phrases in full.
 */
export function HandwritingSvg({ className }: { className?: string }) {
  const { image, phrases } = HANDWRITING;
  return (
    <svg viewBox={`0 0 ${image.width} ${image.height}`} className={`handwriting ${className ?? ""}`} aria-hidden="true">
      {phrases.map((p) => (
        <g key={p.id} className="hw-phrase" data-phrase={p.id}>
          {p.words.map((w) => (
            <g key={w.id} className="hw-word" data-word={w.id} transform={`matrix(${w.matrix.join(" ")})`}>
              {w.strokes.map((d, i) => (
                <path key={i} className="hw-stroke" d={d} style={{ strokeWidth: w.weight }} />
              ))}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
