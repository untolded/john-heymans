import Link from "next/link";
import type { Metadata } from "next";
import { liveKit } from "@/components/story/fonts";
import "../review.css";

export const metadata: Metadata = {
  title: "Archive. Earlier designs for John Heymans",
  description: "Every design round before the approved page. Kept for reference, not live.",
};

// Internal index, so the wording lives here rather than in lib/content.
const ROUNDS = [
  {
    href: "/archive/signal",
    name: "Signal",
    when: "Rounds 4 and 5",
    line: "The first attempt at one continuous story instead of sections. The film opens it, the screen holds and the story moves through it. The approved page grew out of this one.",
  },
  {
    href: "/archive/concept-b",
    name: "Made it",
    when: "Concept B, rounds 1 to 3",
    line: "Loud and warm. Full-colour photography edge to edge, heavy capitals, Belgian yellow. The only one of the first three that survived review.",
  },
  {
    href: "/archive/concept-a",
    name: "Velocity",
    when: "Concept A, rounds 1 to 3",
    line: "Fast and technical. Blue-black, motion-blurred race photographs, tall condensed type, a race clock in the menu bar.",
  },
  {
    href: "/archive/concept-c",
    name: "Stadium",
    when: "Concept C, rounds 1 to 3",
    line: "Dramatic and graphic. Black-and-white photography, one red line through the page, the last lap counted down from 400 m.",
  },
  {
    href: "/archive/type",
    name: "Three typefaces",
    when: "22 September 2026",
    line: "The typeface review. Scoreboard was chosen and is the live setting; Ink trap and Readout are still here, running.",
  },
  {
    href: "/archive/brief",
    name: "The round 2 review",
    when: "20 September 2026",
    line: "The page the three concepts were sent out on, with what to look for in each.",
  },
];

export default function Archive() {
  return (
    <main className={`review ${liveKit.className}`}>
      <div className="review-inner">
        <header className="review-top">
          <p className="review-meta">
            <strong>John Heymans</strong>, archive
          </p>
          <p className="review-meta">Not live, not indexed</p>
        </header>

        <h1 className="review-title">Archive</h1>
        <p className="review-lede">
          Every design round before the one John approved. They are kept here because the thinking in them still gets
          referred to, and because a decision is easier to defend next to what it replaced.
        </p>
        <p className="review-lede">
          None of these is the site. The live page is at <Link href="/">johnheymans.com</Link>.
        </p>

        <ul className="arch-list">
          {ROUNDS.map((r) => (
            <li className="arch-item" key={r.href}>
              <p className="arch-name">
                {r.name}
                <span className="arch-when">{r.when}</span>
              </p>
              <p className="arch-line">{r.line}</p>
              <Link className="arch-open" href={r.href}>
                Open
              </Link>
            </li>
          ))}
        </ul>

        <section className="review-close">
          <h2 className="review-h2">Why they were replaced</h2>
          <p className="review-note">
            John reviewed the first three himself and said the structure was right but none of them had the wow. His test
            was whether someone paying a premium fee would be impressed on sight. That verdict set the rules the approved
            page is built on: the film opens the site, the story never breaks into sections, the five lessons are
            explicit, the AI is visible, and there is half as much text.
          </p>
        </section>
      </div>
    </main>
  );
}
