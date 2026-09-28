import { content } from "@/lib/content";
import { STEPS, AGENTS, AGENTS_HEAD, AGENTS_DONE, CODE, LANES, MONTHS, highlight } from "@/lib/story/chat";

const c = content.story.algorithm;

const Spinner = () => (
  <svg className="ag-spin" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.6" />
    <path d="M8 1.8a6.2 6.2 0 0 1 6.2 6.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Check = () => (
  <svg className="ag-check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7" fill="currentColor" fillOpacity="0.16" />
    <path d="m5 8.2 2 2 4-4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9.5 2.5h-5a2 2 0 0 0-2 2v5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Two lanes across one year: everyone else's season, and the one the model recommended. */
export function SeasonCompare() {
  return (
    <div className="cal">
      <div className="cal-months" aria-hidden="true">
        {MONTHS.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
      {LANES.map((lane) => (
        <div className="cal-row" key={lane.id} data-lane={lane.id}>
          <p className="cal-label">
            <span className="cal-name">{lane.label}</span>
            <span className="cal-note">{lane.note}</span>
          </p>
          <div className="cal-lane" aria-hidden="true">
            {lane.dots.map((x, i) => (
              <span className="cal-dot" key={i} style={{ left: `${x}%` }} />
            ))}
          </div>
        </div>
      ))}
      <p className="sr-only">{c.calendar.summary}</p>
    </div>
  );
}

/**
 * ChatGPT's answer, whole: thinking, the agents, the code, the
 * recommendation and its calendar. Rendered finished (data-state="done");
 * the film sets everything back to "live" and hidden, then reveals it.
 */
export function ChatAnswer() {
  return (
    <>
      <div className="think" data-block="think" data-state="done">
        <p className="think-head">
          <span className="swap">
            <span className="think-live" aria-hidden="true">
              {c.thinking}
            </span>
            <span className="think-done">{c.thought}</span>
          </span>
        </p>
        <ol className="think-steps">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="agents" data-block="agents">
        <p className="agents-head" data-state="done">
          <span className="swap">
            <span className="agents-live" aria-hidden="true">
              {AGENTS_HEAD}
            </span>
            <span className="agents-done">{AGENTS_DONE}</span>
          </span>
        </p>
        <ul className="agents-list">
          {AGENTS.map((a) => (
            <li className="agent" key={a.name} data-state="done">
              <span className="ag-state">
                <Spinner />
                <Check />
              </span>
              <span className="ag-name">{a.name}</span>
              <span className="swap ag-text">
                <span className="ag-task" aria-hidden="true">
                  {a.task}
                </span>
                <span className="ag-done">{a.done}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="code" data-block="code">
        <p className="code-bar" aria-hidden="true">
          <span>{c.codeLang}</span>
          <span className="code-copy">
            <CopyGlyph />
            {c.copy}
          </span>
        </p>
        <pre>
          <code>
            {CODE.map((line, i) => (
              <span className="code-line" key={i}>
                {highlight(line).map((tok, j) =>
                  tok.k ? (
                    <span className={`c-${tok.k}`} key={j}>
                      {tok.t}
                    </span>
                  ) : (
                    tok.t
                  ),
                )}
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      </div>

      <p className="rec" data-block="rec">
        <strong>{c.recommendationLead}</strong> {c.recommendation}
      </p>

      <div className="cal-card" data-block="cal">
        <SeasonCompare />
      </div>
    </>
  );
}
