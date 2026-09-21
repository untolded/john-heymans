import { GRID, GRID_V, gridDots, seasonPath, monthStarts } from "@/lib/story/layouts";
import { facts, show, SHOW_PENDING } from "@/lib/story/data";
import { content } from "@/lib/content";

const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });

/**
 * The qualifying window as a calendar, one dot per candidate meet, the
 * chosen ones in amber and joined in date order. Months run across on wide
 * screens and down on phones. Month names only appear once the window's dates
 * may be shown.
 */
export function SeasonGridSvg({ className, fill = false, vertical = false }: { className?: string; fill?: boolean; vertical?: boolean }) {
  const dots = gridDots(vertical);
  const months = show(facts.ranking.window) ? monthStarts() : null;
  const placeholder = SHOW_PENDING && facts.races.candidates.placeholder;
  const W = vertical ? GRID_V.w : GRID.w;
  const H = vertical ? GRID_V.h : GRID.h;
  const n = GRID.cols;
  const cellW = (GRID.w - GRID.padX * 2) / n;
  const cellH = (GRID_V.h - GRID_V.padY * 2) / n;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`season-grid ${className ?? ""}`} aria-hidden="true" preserveAspectRatio={fill ? "xMidYMid slice" : "xMidYMid meet"}>
      <g className="sg-cols">
        {Array.from({ length: n + 1 }, (_, i) =>
          vertical ? (
            <line key={i} x1={GRID_V.padLeft - 12} x2={GRID_V.w - GRID_V.padRight + 12} y1={GRID_V.padY + cellH * i} y2={GRID_V.padY + cellH * i} />
          ) : (
            <line key={i} x1={GRID.padX + cellW * i} x2={GRID.padX + cellW * i} y1={GRID.padTop - 16} y2={GRID.h - GRID.padBottom + 16} />
          ),
        )}
      </g>
      {months && (
        <g className="sg-months">
          {months.map((m, i) =>
            vertical ? (
              <text key={i} x={GRID_V.padLeft - 30} y={GRID_V.padY + cellH * (i + 0.5) + 5} textAnchor="end">
                {month.format(m).toUpperCase()}
              </text>
            ) : (
              <text key={i} x={GRID.padX + cellW * (i + 0.5)} y={GRID.padTop - 28} textAnchor="middle">
                {month.format(m).toUpperCase()}
              </text>
            ),
          )}
        </g>
      )}
      <path className="sg-path" d={seasonPath(dots)} />
      <g className="sg-dots">
        {dots.map((d) => (
          <circle key={d.id} className="sg-dot" data-chosen={d.chosen} data-order={d.order} data-month={d.month} cx={d.x} cy={d.y} r={8} />
        ))}
      </g>
      {placeholder && (
        <g className="dev-mark">
          <rect x={W - 250} y={4} width={246} height={30} rx={4} />
          <text x={W - 127} y={24} textAnchor="middle">
            {content.story.dev.placeholder.toUpperCase()} DATA
          </text>
        </g>
      )}
    </svg>
  );
}
