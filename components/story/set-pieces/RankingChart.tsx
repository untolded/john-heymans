import { CHART, chartPoints, chartPath, chartY, quotaY, rankGuides } from "@/lib/story/layouts";
import { MILESTONES } from "@/lib/story/ranking";
import { facts, show, SHOW_PENDING } from "@/lib/story/data";
import { content } from "@/lib/content";

const copy = content.story.ranking;

/**
 * World ranking across the two years: time across, position up the side with
 * better higher, the Olympic quota as a dashed line. Only the two ends are
 * named: outside the top 200, and the 31st place that qualified John. They
 * only appear when the ranking may be shown.
 */
export function RankingChartSvg({ className }: { className?: string }) {
  const pts = chartPoints();
  const labels = show(facts.ranking.series) != null;
  const qy = quotaY();
  const placeholder = SHOW_PENDING && facts.ranking.series.placeholder;
  const first = pts[0];
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className={`ranking-chart ${className ?? ""}`} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g className="rc-guides">
        {rankGuides().map((r) => (
          <line key={r} x1={CHART.padL} x2={CHART.w - CHART.padR} y1={chartY(r)} y2={chartY(r)} />
        ))}
      </g>
      {qy != null && <line className="rc-quota" x1={CHART.padL} x2={CHART.w - CHART.padR} y1={qy} y2={qy} />}
      <path className="rc-line" d={chartPath(pts.length - 1, pts)} />
      {labels && first && last && (
        <>
          <circle className="rc-start-dot" cx={first.x} cy={first.y} r={6} />
          <circle className="rc-end-dot" cx={last.x} cy={last.y} r={9} />
          <text className="rc-big-svg rc-start-svg" x={first.x - 20} y={first.y + 22} textAnchor="end">
            {copy.startValue}
          </text>
          <text className="rc-big-svg rc-end-svg" x={last.x + 22} y={last.y + 22}>
            {MILESTONES[MILESTONES.length - 1]?.label}
          </text>
          <text className="rc-end-note-svg" x={last.x + 24} y={last.y + 50}>
            {copy.endNote}
          </text>
        </>
      )}
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
