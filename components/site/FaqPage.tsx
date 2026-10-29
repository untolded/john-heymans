import Link from "next/link";
import { pages } from "@/lib/content-pages";
import { fill } from "@/lib/story/format";
import { inline } from "@/lib/seo";
import { faqGroups, faqJsonLd } from "@/lib/faq";

const f = pages.faq;

/**
 * The FAQ, written for search engines and AI assistants more than for
 * visitors, so it stays plain: the legal pages' reading column, every
 * question a heading and every answer visible in the HTML (nothing behind a
 * disclosure), and the same questions and answers as an FAQPage in JSON-LD.
 */
export function FaqPage() {
  const groups = faqGroups();
  return (
    <article className="legal faq" aria-labelledby="faq-title">
      <header className="legal-head">
        <h1 id="faq-title" className="legal-title">
          <span className="hl">
            <span>{f.title}</span>
          </span>
        </h1>
        <p className="legal-date">{fill(f.updated, { date: f.date })}</p>
        <p className="legal-lead">{f.lead}</p>
      </header>
      {groups.map((g) => (
        <section className="legal-section" key={g.heading} aria-label={g.heading}>
          <h2>{g.heading}</h2>
          {g.items.map((item) => (
            <div className="faq-item" key={item.q}>
              <h3>{item.q}</h3>
              {item.a.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ))}
        </section>
      ))}
      <nav className="legal-more" aria-label={f.back}>
        <Link href="/">{f.back}</Link>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: inline(faqJsonLd(groups)) }} />
    </article>
  );
}
