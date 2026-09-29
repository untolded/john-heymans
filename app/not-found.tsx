import { pages } from "@/lib/content-pages";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { EnquireButton } from "@/components/story/practical/Actions";
import "./story.css";

const t = pages.notFound;

export const metadata: Metadata = { title: t.meta, robots: { index: false, follow: true } };

/** The climb, in a 100 x 100 box stretched over the screen: a steady rise with a little more pace at the start, as in the story's chart. */
const climb = (x0: number, y0: number, x1: number, y1: number) => {
  let d = "";
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const k = u + 0.1 * Math.sin(Math.PI * u);
    d += `${i ? "L" : "M"}${(x0 + (x1 - x0) * u).toFixed(2)} ${(y0 + (y1 - y0) * k).toFixed(2)}`;
  }
  return d;
};

/**
 * The 404, told as the story's ranking chart. A page that doesn't exist is
 * unranked, so "404" sits where "200+" sits in the story, in lavender, and
 * the climb draws itself from it to the top of the screen. The way up is the
 * home page. The line draws once; with reduced motion it is simply there.
 */
export default function NotFound() {
  return (
    <SiteShell ground="night" footer={false}>
      <section className="nf" aria-labelledby="nf-title">
        <svg className="nf-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g className="nf-guides">
            {[30, 52, 74].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} />
            ))}
          </g>
        </svg>
        {/* The line in the AI gradient, revealed left to right like the story's chart drawing itself. */}
        <svg className="nf-chart nf-draw" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="nf-ai" gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="95" y2="0">
              <stop offset="0" stopColor="#ff7a2f" />
              <stop offset="0.5" stopColor="#ee9aa6" />
              <stop offset="1" stopColor="#b9a8f5" />
            </linearGradient>
          </defs>
          <path className="nf-line nf-wide" d={climb(33, 86, 93, 16)} />
          <path className="nf-line nf-narrow" d={climb(52, 88, 94, 50)} />
        </svg>
        <span className="nf-dot nf-wide" style={{ left: "93%", top: "16%" }} aria-hidden="true" />
        <span className="nf-dot nf-narrow" style={{ left: "94%", top: "50%" }} aria-hidden="true" />
        <p className="nf-big" aria-hidden="true">
          {t.big}
        </p>
        <div className="nf-copy">
          <h1 id="nf-title" className="nf-title">
            <span className="hl">
              <span>{t.title}</span>
            </span>
          </h1>
          <p className="nf-body">{t.body}</p>
          <div className="nf-actions">
            <Link className="pill pill-amber" href="/">
              {t.home}
            </Link>
            <EnquireButton from="404" className="pill pill-ghost">
              {t.enquire}
            </EnquireButton>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
