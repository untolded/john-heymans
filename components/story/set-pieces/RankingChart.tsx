import { CHART, chartPoints, chartPath, chartY, quotaY, rankGuides } from "@/lib/story/layouts";
import { SERIES } from "@/lib/story/ranking";
import { facts, show, SHOW_PENDING } from "@/lib/story/data";
import { content } from "@/lib/content";

const month = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });

/**
 * World ranking across the qualifying window: time across, position up the
 * side with better higher, the Olympic quota as a dashed line. Axis numbers
 * and dates only appear when the ranking data may be shown.
 */
export function RankingChartSvg({ className, drawn }: { className?: string; drawn?: number }) {
  const pts = chartPoints();
  const labels = show(facts.ranking.series) != null;
  const qy = quotaY();
  const f = drawn ?? pts.length - 1;
  const placeholder = SHOW_PENDING && facts.ranking.series.placeholder;
  const ticks = labels ? SERIES.filter((_, i) => i % 6 === 0) : [];

  return (
    <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className={`ranking-chart ${className ?? ""}`} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g className="rc-guides">
        {rankGuides().map((r) => (
          <g key={r}>
            <line x1={CHART.padL} x2={CHART.w - CHART.padR} y1={chartY(r)} y2={chartY(r)} />
            {labels && (
              <text x={CHART.w - CHART.padR + 14} y={chartY(r) + 5}>
                {r}
              </text>
            )}
          </g>
        ))}
      </g>
      {labels && (
        <g className="rc-axis">
          {ticks.map((p) => {
            const i = SERIES.indexOf(p);
            return (
              <text key={p.date} x={pts[i].x} y={CHART.h - 8} textAnchor="middle">
                {month.format(new Date(p.date)).toUpperCase()}
              </text>
            );
          })}
        </g>
      )}
      {qy != null && <line className="rc-quota" x1={CHART.padL} x2={CHART.w - CHART.padR} y1={qy} y2={qy} />}
      <path className="rc-line" d={chartPath(f, pts)} />
      {placeholder && (
        <g className="dev-mark">
          <rect x={CHART.padL + 4} y={4} width={246} height={30} rx={4} />
          <text x={CHART.padL + 127} y={24} textAnchor="middle">
            {content.story.dev.placeholder.toUpperCase()} DATA
          </text>
        </g>
      )}
    </svg>
  );
}
