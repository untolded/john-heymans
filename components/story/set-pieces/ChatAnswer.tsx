import { content } from "@/lib/content";
import { CODE, highlight } from "@/lib/story/chat";

const c = content.story.algorithm;

const CopyGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9.5 2.5h-5a2 2 0 0 0-2 2v5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * ChatGPT's answer: the code, whole. The film hides every line and writes
 * them in as the reader scrolls.
 */
export function ChatAnswer() {
  return (
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
            // The indent is passed on so a line that has to wrap hangs under its own code.
            <span className="code-line" key={i} style={{ "--ind": line.length - line.trimStart().length } as React.CSSProperties}>
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
  );
}
