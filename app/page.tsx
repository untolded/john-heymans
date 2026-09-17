import Link from "next/link";
import { Archivo } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap" });

const concepts = [
  { href: "/concept-a", letter: "A", name: "Ranking", line: "An instrument panel. Paper ground, Paris lavender, one typeface with a width axis. The bold element is the world-ranking climb, drawn by scroll." },
  { href: "/concept-b", letter: "B", name: "Made it", line: "The film, extended. Warm black, full-bleed photography, condensed capitals, Belgian yellow spent twice. The bold element is the writing on his arms." },
  { href: "/concept-c", letter: "C", name: "The log", line: "A long read in his own voice. Stone paper, one serif, cobalt ink. The bold element is the two years as a horizontal training log." },
];

export default function Index() {
  return (
    <main className={archivo.className} style={{ minHeight: "100vh", background: "#f3f2ee", color: "#101014", padding: "clamp(1.5rem, 5vw, 4rem)" }}>
      <p style={{ fontSize: "0.9375rem", color: "#6b6a66" }}>John Heymans. Three landing-page concepts for review, September 2026.</p>
      <h1 style={{ fontVariationSettings: '"wdth" 75', fontWeight: 700, fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.92, letterSpacing: "-0.03em", margin: "1rem 0 3rem", maxWidth: "20ch" }}>
        Same story, same proof, three ways of telling it.
      </h1>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "1px", background: "#cfcdc6", border: "1px solid #cfcdc6" }}>
        {concepts.map((c) => (
          <li key={c.href} style={{ background: "#f3f2ee" }}>
            <Link href={c.href} style={{ display: "grid", gridTemplateColumns: "3rem 1fr", gap: "1.5rem", padding: "1.75rem 1.5rem", color: "inherit", textDecoration: "none" }}>
              <span style={{ fontVariationSettings: '"wdth" 72', fontWeight: 800, fontSize: "2.5rem", lineHeight: 1 }}>{c.letter}</span>
              <span>
                <strong style={{ display: "block", fontVariationSettings: '"wdth" 80', fontSize: "1.5rem", lineHeight: 1.1, marginBottom: "0.5rem" }}>{c.name}</strong>
                <span style={{ display: "block", maxWidth: "48rem", lineHeight: 1.5 }}>{c.line}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <p style={{ marginTop: "2rem", fontSize: "0.9375rem", color: "#6b6a66", maxWidth: "48rem", lineHeight: 1.5 }}>
        The design plan behind each concept, and what was changed after checking it against the brief, is in docs/concepts.md.
      </p>
    </main>
  );
}
