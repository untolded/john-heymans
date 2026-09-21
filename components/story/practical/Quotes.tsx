import Image from "next/image";
import { content } from "@/lib/content";

const quotes = content.proof.quotes;
const p = content.story.practical;

/** The two written testimonials, side by side and still: read, not watched. */
export function Quotes() {
  return (
    <div className="quotes">
      <h3 className="sr-only">{p.quotesTitle}</h3>
      <div className="quotes-grid">
        {quotes.map((q) => (
          <figure className="quote" key={q.org}>
            <blockquote className="quote-text">
              <p>{q.text}</p>
            </blockquote>
            <figcaption className="quote-by">
              <Image className="quote-portrait" src={q.portrait} alt="" width={64} height={64} />
              <span className="quote-who">
                <span>{q.who}</span>
                <span>{q.org}</span>
              </span>
              <Image className="quote-logo" src={q.logo} alt={q.org} width={120} height={40} style={{ height: "1.75rem", width: "auto" }} />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
