import Link from "next/link";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import type { TypeKit } from "@/components/story/typeKit";
import { liveKit } from "@/components/story/fonts";
import { trapKit } from "@/components/archive/type/trap";
import { readoutKit } from "@/components/archive/type/readout";
import "./kits.css";
import "../../review.css";

export const metadata: Metadata = {
  title: "Three typefaces for John Heymans. Scoreboard chosen",
  description: "The typeface review of 22 September 2026, kept as the record of the decision.",
  robots: { index: false, follow: false },
};

// A review page, not site copy, so its own wording lives here. The specimens
// are real page copy, pulled from lib/content, so nothing is set in words the
// page will never carry.
const s = content.story;
const SPEC = {
  anchor: s.final.arms,
  title: s.lessons[0].title,
  line: s.lessons[0].line,
  sentence: s.iten.line,
  figures: [
    { value: content.brand.pb, label: "5000 m" },
    { value: "2,400 m", label: "Iten" },
    { value: "11th", label: "Paris" },
  ],
  readout: s.telemetry.record,
};

const KITS: (TypeKit & { href: string; chosen?: true })[] = [
  { ...liveKit, href: "/", chosen: true },
  { ...trapKit, href: "/archive/type/trap" },
  { ...readoutKit, href: "/archive/type/readout" },
];

// Settled with John. These do not change again.
const PALETTE = [
  { hex: "#070613", name: "Night", role: "The ground the story runs on" },
  { hex: "#151038", name: "Deep", role: "Where the ground lifts, from Iten upward" },
  { hex: "#3a2c91", name: "Violet", role: "Altitude, the stadium, the light behind him" },
  { hex: "#b9a8f5", name: "Lavender", role: "The machine voice: readouts, charts, labels" },
  { hex: "#ff7a2f", name: "Amber", role: "The one accent. Every action, every line drawn" },
  { hex: "#f3f1ea", name: "Paper", role: "The sheet that rises for the keynote details" },
];
const PALETTE_SUPPORT = [
  { hex: "#141019", name: "Ink", role: "Text on paper" },
  { hex: "#a8400d", name: "Amber deep", role: "The accent on paper, where it needs the contrast" },
];

function Specimen({ kit }: { kit: TypeKit & { href: string; chosen?: true } }) {
  return (
    <section className="kit" aria-labelledby={`kit-${kit.id}`} data-chosen={kit.chosen ? "true" : undefined}>
      <div className="kit-head">
        <h2 className="kit-name" id={`kit-${kit.id}`}>
          {kit.name}
          {kit.chosen ? <span className="kit-chosen">Chosen</span> : null}
        </h2>
        <p className="kit-faces">
          {kit.faces.display} <span>display</span> {kit.faces.text} <span>reading</span> {kit.faces.mono} <span>readouts</span>
        </p>
      </div>

      <div className={`spec ${kit.className}`} data-type={kit.id}>
        <p className="spec-anchor">{SPEC.anchor}</p>
        <p className="spec-title">{SPEC.title}</p>
        <p className="spec-line">{SPEC.line}</p>
        <dl className="spec-figures">
          {SPEC.figures.map((f) => (
            <div key={f.label}>
              <dt>{f.value}</dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
        <p className="spec-body">{SPEC.sentence}</p>
        <p className="spec-readout">{SPEC.readout}</p>
      </div>

      <div className="kit-foot">
        <p className="kit-claim">{kit.claim}</p>
        <ul className="kit-notes">
          {kit.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <Link className="kit-open" href={kit.href}>
          {kit.chosen ? "See the live page" : `See the whole page in ${kit.name}`}
        </Link>
      </div>
    </section>
  );
}

export default function TypeReview() {
  return (
    <main className={`review ${liveKit.className}`}>
      <div className="review-inner">
        <header className="review-top">
          <p className="review-meta">
            <strong>John Heymans</strong>, typefaces
          </p>
          <p className="review-meta">22 September 2026</p>
        </header>

        <h1 className="review-title">Three typefaces</h1>
        <p className="review-lede">
          The review of 22 September 2026, kept as the record of the decision. The page was set three ways with nothing
          else moved: same story, same photographs, same order, same colours.
        </p>
        <p className="review-lede">
          John chose <strong>Scoreboard</strong>. It is the live setting now, and the brand guide is built on it. The
          other two are still here, running, in case the question comes back.
        </p>

        <section className="palette" aria-labelledby="palette-title">
          <h2 className="review-h2" id="palette-title">
            The colours, settled
          </h2>
          <p className="review-note">Fixed on 22 September 2026, and unchanged by the typeface decision.</p>
          <ul className="swatches">
            {PALETTE.map((c) => (
              <li key={c.hex}>
                <span className="swatch" style={{ background: c.hex }} aria-hidden="true" />
                <b>{c.name}</b>
                <code>{c.hex}</code>
                <span className="swatch-role">{c.role}</span>
              </li>
            ))}
          </ul>
          <ul className="swatches swatches-support">
            {PALETTE_SUPPORT.map((c) => (
              <li key={c.hex}>
                <span className="swatch" style={{ background: c.hex }} aria-hidden="true" />
                <b>{c.name}</b>
                <code>{c.hex}</code>
                <span className="swatch-role">{c.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="kits">
          {KITS.map((kit) => (
            <Specimen key={kit.id} kit={kit} />
          ))}
        </div>

        <section className="review-close">
          <h2 className="review-h2">Why Scoreboard</h2>
          <p className="review-note">
            It is the only one of the three that is athletic without being decorative. It holds more words on a line than
            the other two, which matters on a page whose headlines are sentences. And the figures carry it: 13:03.46 and
            2,400 m read as a results screen rather than as text, which is the one place the page can be loud without
            saying anything.
          </p>
          <p className="review-note">
            The live page is at <Link href="/">johnheymans.com</Link>. How to use it is in the brand guide.
          </p>
        </section>
      </div>
    </main>
  );
}
