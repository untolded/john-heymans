import Image from "next/image";
import { content } from "@/lib/content";

/**
 * Client logos, served from public/logos as the originals. Themes render
 * them monochrome with a CSS filter so brand colours never fight the page.
 */
export function Logos({ className }: { className?: string }) {
  return (
    <ul className={`logos ${className ?? ""}`}>
      {content.proof.logos.map((l) => (
        <li key={l.slug} className="logo">
          <Image src={`/logos/${l.slug}.svg`} alt={l.name} width={160} height={60} unoptimized />
        </li>
      ))}
    </ul>
  );
}
