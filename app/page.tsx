import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Archivo, Big_Shoulders, Bricolage_Grotesque, Geist } from "next/font/google";
import { photo, type PhotoSlug } from "@/lib/photos";
import "./brief.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
// Each card previews its concept's own typeface.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const shoulders = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-shoulders", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-brico", display: "swap" });

export const metadata: Metadata = {
  title: "Website concepts for John Heymans",
  description: "Three design concepts for John's new keynote website, and how to review them.",
};

// Internal review page, not site copy, so the text lives here rather than in lib/content.ts.
const CONCEPTS: {
  id: "a" | "b" | "c";
  name: string;
  poster: PhotoSlug;
  line: string;
  notice: string[];
  swatches: string[];
}[] = [
  {
    id: "a",
    name: "Velocity",
    poster: "final-pan",
    line: "Fast and technical. Blue-black, motion-blurred race photos, tall condensed type, Paris-track lavender.",
    notice: [
      "The race clock in the menu bar. It runs to your 13:03.46 as you scroll.",
      "The story scrolls sideways, with your ranking line drawn across it.",
      "Moving rows of client logos.",
    ],
    swatches: ["#0b0a12", "#a895dd", "#f1efff"],
  },
  {
    id: "b",
    name: "Made it",
    poster: "heats-pack",
    line: "Loud and warm. Full-colour photos edge to edge, heavy capitals, Belgian yellow everywhere it matters.",
    notice: [
      "The film is the main button in the opening screen.",
      "Chapters switch between dark and light as you scroll.",
      "Chapter five writes “Hey mom” and “Made it” across your final photo.",
    ],
    swatches: ["#0c0b0a", "#f2c230", "#ede7da"],
  },
  {
    id: "c",
    name: "Stadium",
    poster: "pan-indoor",
    line: "Dramatic and graphic. Black-and-white photos, one red line, bold modern type.",
    notice: [
      "The red finish line that runs through the page.",
      "The last lap: five photos, a countdown from 400 m, and colour only when you cross the line.",
      "Photos that turn to colour when you point at them.",
    ],
    swatches: ["#050505", "#e4322b", "#f4f2ee"],
  },
];

const PICKS = [
  ["Typography", "The typefaces and how big and heavy the headlines are."],
  ["Colour", "The background and the one accent colour."],
  ["Photography", "Colour or black and white, full-bleed or framed."],
  ["Opening screen", "The headline, and whether the film or the booking button leads."],
  ["The story", "How the five parts unfold as you scroll."],
  ["Details", "Menu, buttons, testimonials, client logos, footer."],
];

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 9h11M10 4.5L14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Brief() {
  return (
    <main className={`brief ${geist.variable} ${archivo.variable} ${shoulders.variable} ${bricolage.variable}`}>
      <div className="brief-inner">
        <div className="brief-top">
          <span><strong>John Heymans</strong>, new website</span>
          <span>Design concepts, round 1, 17 September 2026</span>
        </div>

        <h1 className="brief-title">Three directions for your new website</h1>
        <p className="brief-lede">
          Before we build the final site, we need to agree on its look and feel. Below are three complete versions of the one-page site. They tell the same story with the same photos and text, in three very different styles.
        </p>
        <p className="brief-lede">
          You don’t have to choose one. Pick the parts you like from each, and we will combine them into one final design.
        </p>

        <section className="brief-section" aria-labelledby="concepts-title">
          <h2 id="concepts-title" className="brief-h2">Open the three concepts</h2>
          <ul className="cards">
            {CONCEPTS.map((c) => {
              const p = photo(c.poster);
              return (
                <li key={c.id} style={{ display: "grid" }}>
                  <Link href={`/concept-${c.id}`} className={`card card-${c.id}`}>
                    <div className="card-media">
                      <Image src={p.src} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" loading="eager" />
                      <span className="card-name">
                        <span className="card-letter">Concept {c.id.toUpperCase()}</span>
                        <b>{c.name}</b>
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="card-swatches" aria-hidden="true">
                        {c.swatches.map((s) => <span key={s} style={{ background: s }} />)}
                      </div>
                      <p className="card-line">{c.line}</p>
                      <ul className="card-notice" aria-label="What to look out for">
                        {c.notice.map((n) => <li key={n}>{n}</li>)}
                      </ul>
                      <span className="card-open">Open concept {c.id.toUpperCase()}<Arrow /></span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="brief-section" aria-labelledby="how-title">
          <h2 id="how-title" className="brief-h2">How to review</h2>
          <ol className="steps">
            <li className="step">
              <strong>Use a laptop first</strong>
              <p>Open each concept full screen and scroll slowly. Most of the animation follows your scrolling. Then have a quick look on your phone.</p>
            </li>
            <li className="step">
              <strong>Click everything</strong>
              <p>Try the booking form and the film button. The form doesn’t send anything yet, so test it freely.</p>
            </li>
            <li className="step">
              <strong>Note what you like, per concept</strong>
              <p>A few words or a screenshot per point is enough. What you dislike is just as useful.</p>
            </li>
          </ol>
        </section>

        <section className="brief-section" aria-labelledby="picks-title">
          <h2 id="picks-title" className="brief-h2">What you can mix and match</h2>
          <ul className="picks">
            {PICKS.map(([k, v]) => (
              <li key={k} className="pick"><strong>{k}</strong><span>{v}</span></li>
            ))}
          </ul>
        </section>

        <section className="brief-section two-col">
          <div>
            <h2 className="brief-h2">Questions for you</h2>
            <ol className="qs">
              <li>Which opening screen gets your story across best in five seconds?</li>
              <li>Should the film or the booking button come first?</li>
              <li>Which colour feels most like you?</li>
              <li>Is there anything that feels too much, or not like you?</li>
              <li>Does the text sound like you? Mark anything you wouldn’t say yourself.</li>
            </ol>
          </div>
          <div>
            <h2 className="brief-h2">Not final yet</h2>
            <ul className="notes">
              <li><strong>The film.</strong> The player shows a still until the 60-second film is ready.</li>
              <li><strong>The ranking line and distances</strong> are illustrations until we add your real ranking data.</li>
              <li><strong>Testimonials</strong> are shortened from the full versions on your current site.</li>
              <li><strong>The text</strong> is a first draft. Look at the style first; we will fine-tune the wording afterwards.</li>
            </ul>
          </div>
        </section>

        <div className="brief-foot">
          <span>Reply with your picks and answers, and we will turn them into one design.</span>
          <span>
            <span style={{ display: "inline-flex", gap: "1rem" }}><Link href="/concept-a">Concept A</Link><Link href="/concept-b">Concept B</Link><Link href="/concept-c">Concept C</Link></span>
          </span>
        </div>
      </div>
    </main>
  );
}
