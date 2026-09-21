import { splitMark, lines } from "@/lib/story/format";

/** A line with its marked word wrapped, so the amber line can underline it. */
function Marked({ text }: { text: string }) {
  const m = splitMark(text);
  if (!m) return <>{text}</>;
  return (
    <>
      {m.before}
      <span className="mark">{m.mark}</span>
      {m.after}
    </>
  );
}

/**
 * Story copy as the content wrote it: title-card lines break at the vertical
 * bars (each line a block with a trailing space, so it still reads as one
 * sentence), and a word in asterisks is marked.
 */
export function Text({ text }: { text: string }) {
  const parts = lines(text);
  if (parts.length === 1) return <Marked text={text} />;
  return (
    <>
      {parts.map((line, i) => (
        <span className="tl" key={i}>
          <Marked text={line} />
          {i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
