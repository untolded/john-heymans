import { content } from "@/lib/content";
import { STEPS, CODE, highlight } from "@/lib/story/chat";

const c = content.story.algorithm;

const CopyGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9.5 2.5h-5a2 2 0 0 0-2 2v5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * ChatGPT's answer, whole: thinking, the code, the recommendation.
 * Rendered finished (data-state="done"); the film sets everything back to
 * "live" and hidden, then reveals it.
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
    </>
  );
}
