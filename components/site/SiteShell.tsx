import Link from "next/link";
import { content } from "@/lib/content";
import { pages } from "@/lib/content-pages";
import { fontVariables } from "@/components/story/fonts";
import { Social } from "@/components/shared/Social";
import { Footer } from "@/components/story/Footer";
import { EnquireButton } from "@/components/story/practical/Actions";
import { CookieBanner } from "./CookieBanner";

const l = pages.legal;
const f = content.story.frame;

/**
 * The frame for the pages around the story: the legal pages (paper) and the
 * 404 (night). The same wordmark, socials and availability pill as the story's
 * frame, in the same type, without the film's machinery. The legal pages end
 * on the site's footer, without the pace board; the 404 is one screen.
 */
export function SiteShell({ ground, footer = true, children }: { ground: "paper" | "night"; footer?: boolean; children: React.ReactNode }) {
  return (
    <div className={`story-root site ${fontVariables}`} data-ground={ground} data-type="board">
      <a className="skip-link" href="#main">
        {l.skip}
      </a>
      <header className="site-top">
        <Link className="wordmark" href="/" aria-label={l.home}>
          {content.brand.name}
        </Link>
        <div className="site-actions">
          <Social />
          <EnquireButton from="site" className="pill pill-amber frame-cta">
            <span className="cta-long">{f.cta}</span>
            <span className="cta-short">{f.ctaShort}</span>
          </EnquireButton>
        </div>
      </header>
      <main id="main">{children}</main>
      {footer && <Footer filmIsStandIn={false} pace={false} />}
      <CookieBanner />
    </div>
  );
}
