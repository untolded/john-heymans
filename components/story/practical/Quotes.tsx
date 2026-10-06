import Image from "next/image";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";

const p = content.story.practical;

type Quote = {
  text: string;
  name: string | null;
  who: string;
  org: string;
  href: string | null;
  portrait: string | null;
  /** A wordmark says the name itself; a mark is set beside the name in type. */
  logo: { src: string; w: number; h: number; wordmark: boolean };
};
const QUOTES: readonly Quote[] = p.quotes;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

/**
 * "You stand *head and shoulders above them*." with the starred phrases set
 * in bold. Screen readers get the sentence as written.
 */
function Marked({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <strong key={i} className="quote-hl">
        {part.slice(1, -1)}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Every logo in the same box: a wordmark fills its width, a symbol sits at
 * one shared height with the organisation's name beside it, so a square
 * mark and a long wordmark carry the same weight.
 */
function Logo({ q }: { q: Quote }) {
  const { src, w, h, wordmark } = q.logo;
  if (wordmark) {
    return (
      <span className="quote-logo is-wordmark">
        <Image src={src} alt={q.org} width={w} height={h} unoptimized />
      </span>
    );
  }
  return (
    <span className="quote-logo">
      <Image src={src} alt="" width={w} height={h} unoptimized style={{ aspectRatio: `${w} / ${h}` }} />
      <span className="quote-org">{q.org}</span>
    </span>
  );
}

/** What organisers wrote, two by two and still: read, not watched. Named where the writer is named. */
export function Quotes() {
  return (
    <div className="quotes">
      <h3 className="sr-only">{p.quotesTitle}</h3>
      <div className="quotes-grid">
        {QUOTES.map((q) => (
          <figure className="quote" key={q.org} data-reveal="fade">
            <blockquote className="quote-text">
              <p>
                <Marked text={q.text} />
              </p>
            </blockquote>
            <figcaption className="quote-by">
              {q.portrait ? (
                <Image className="quote-portrait" src={q.portrait} alt="" width={64} height={64} />
              ) : (
                <span className="quote-portrait quote-initials" aria-hidden="true">
                  {initials(q.name ?? q.org)}
                </span>
              )}
              <span className="quote-who">
                {q.name &&
                  (q.href ? (
                    <a href={q.href} target="_blank" rel="noopener noreferrer" aria-label={fill(p.quoteProfile, { name: q.name })}>
                      {q.name}
                    </a>
                  ) : (
                    <span>{q.name}</span>
                  ))}
                <span>{q.who}</span>
              </span>
              <Logo q={q} />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
