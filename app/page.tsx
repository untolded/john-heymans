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
  description: "The new direction for John's keynote website, and the three earlier concepts.",
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

const LEAD = {
  href: "/signal",
  name: "Signal",
  poster: "final-arms" as PhotoSlug,
  line: "One continuous story, from the film to the Olympic final, then everything an event buyer needs to book you.",
  notice: [
    "The film plays the moment the page opens. One button for sound.",
    "The story never breaks into sections. The screen holds and the story moves.",
    "You ask ChatGPT for the algorithm, on screen, and the schedule appears.",
    "Your federation, coach and rivals say no, then the ranking answers.",
    "The ground turns from night to paper for the keynote details and the booking.",
  ],
};

const PICKS = [
  ["Typography", "The typefaces and how big and heavy the headlines are."],
  ["Colour", "The night violet ground and the orange we spend on actions."],
  ["The five lessons", "The wording, the order, and which photo carries each one."],
  ["The opening", "Which film plays, how long it runs, and what the two lines say."],
  ["The algorithm", "How much of the method we show, once we have your real data."],
  ["Details", "Buttons, testimonials, client logos, footer."],
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
          <span>Design concepts, round 2, 20 September 2026</span>
        </div>

        <h1 className="brief-title">The new direction</h1>
        <p className="brief-lede">
          You said it read as separate sections rather than one story. So the page was rebuilt around your storyline: the film opens it, and from there one screen holds while the story moves through it, from Iten to the algorithm to the final.
        </p>
        <p className="brief-lede">
          Open it on a laptop, full screen, and scroll slowly. The three earlier concepts are still below for reference.
        </p>

        <section className="brief-section" aria-labelledby="lead-title">
          <h2 id="lead-title" className="brief-h2">Start here</h2>
          <ul className="cards cards-lead">
            <li style={{ display: "grid" }}>
              <Link href={LEAD.href} className="card card-lead">
                <div className="card-media">
                  <Image src={photo(LEAD.poster).src} alt="" fill sizes="(min-width: 900px) 60vw, 100vw" loading="eager" />
                  <span className="card-name">
                    <span className="card-letter">New direction</span>
                    <b>{LEAD.name}</b>
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-line">{LEAD.line}</p>
                  <ul className="card-notice" aria-label="What changed">
                    {LEAD.notice.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                  <span className="card-open">Open Signal<Arrow /></span>
                </div>
              </Link>
            </li>
          </ul>
        </section>

        <section className="brief-section" aria-labelledby="concepts-title">
          <h2 id="concepts-title" className="brief-h2">The three earlier concepts</h2>
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
              <strong>Watch before you scroll</strong>
              <p>Open Signal full screen and let the opening film run. Turn the sound on. Then scroll slowly, because most of what happens follows your scrolling.</p>
            </li>
            <li className="step">
              <strong>Click everything</strong>
              <p>Turn the sound on, open a testimonial clip, open your own story behind “Who is John”, and send yourself a test enquiry. Nothing is sent yet.</p>
            </li>
            <li className="step">
              <strong>Tell us if the wow is there</strong>
              <p>A few words or a screenshot per point is enough. What you dislike is just as useful.</p>
            </li>
          </ol>
        </section>

        <section className="brief-section" aria-labelledby="picks-title">
          <h2 id="picks-title" className="brief-h2">What we can still change</h2>
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
              <li>Does it read as one story now, rather than a set of sections?</li>
              <li>Is the ChatGPT moment the way you would tell it?</li>
              <li>Are the three lines from your federation, coach and rivals fair?</li>
              <li>Is the night violet and orange right for you?</li>
              <li>Anything still missing that a buyer needs before they enquire?</li>
            </ol>
          </div>
          <div>
            <h2 className="brief-h2">Not final yet</h2>
            <ul className="notes">
              <li><strong>The opening film</strong> is cut from your photos for now. Send the 60-second film, or a cut of the Supernova recording, and it drops straight in.</li>
              <li><strong>Iten</strong> is told with graphics, because there are no photos from Kenya in the library yet.</li>
              <li><strong>The testimonial clips</strong> need subtitles, since your audience speaks Dutch.</li>
              <li><strong>The text</strong> is a first draft in your voice. Mark anything you would not say yourself.</li>
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
