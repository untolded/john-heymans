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
  logo: { src: string; w: number; h: number };
};
const QUOTES: readonly Quote[] = p.quotes;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

/** What organisers wrote, two by two and still: read, not watched. Named where the writer is named. */
export function Quotes() {
  return (
    <div className="quotes">
      <h3 className="sr-only">{p.quotesTitle}</h3>
      <div className="quotes-grid">
        {QUOTES.map((q) => (
          <figure className="quote" key={q.org}>
            <blockquote className="quote-text">
              <p>{q.text}</p>
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
                <span>{q.org}</span>
              </span>
              <Image className="quote-logo" src={q.logo.src} alt={q.org} width={q.logo.w} height={q.logo.h} style={{ height: "1.75rem", width: "auto" }} />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
