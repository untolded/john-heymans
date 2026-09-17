import Image from "next/image";

type Q = { text: string; who: string; org: string; portrait: string; logo: string };

/**
 * One testimonial: the quote, then the person with their portrait and their
 * organisation's logo. Portraits are small source files, so they are shown
 * small and never upscaled beyond their native size.
 */
export function Quote({ q, className }: { q: Q; className?: string }) {
  return (
    <blockquote className={`quote ${className ?? ""}`} data-reveal>
      <p>{q.text}</p>
      <footer className="quote-by">
        <Image className="quote-portrait" src={q.portrait} alt={`${q.who}, ${q.org}`} width={56} height={56} unoptimized />
        <span className="quote-who">
          <strong>{q.who}</strong>
          <span>{q.org}</span>
        </span>
        <Image className="quote-logo" src={q.logo} alt="" width={120} height={40} style={{ width: "auto", height: "auto" }} unoptimized />
      </footer>
    </blockquote>
  );
}
