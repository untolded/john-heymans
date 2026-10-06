import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { pagePhotographers } from "@/lib/story/photos";
import { Social } from "@/components/shared/Social";
import { LEGAL } from "@/lib/seo";
import { CookieSettings } from "@/components/site/CookieBanner";
import { EnquireButton } from "./practical/Actions";

const f = content.story.footer;
const e = content.story.enquiry;

/**
 * A footer that looks like one: the name across the full width, the one
 * action that matters as the biggest button on the page, the email large,
 * socials with handles, every photographer, and the legal links. The way
 * back up is the round button in the corner (BackToTop).
 */
export function Footer({ filmIsStandIn }: { filmIsStandIn: boolean }) {
  const photographers = pagePhotographers(filmIsStandIn);
  return (
    <footer className="footer" data-ground="paper">
      <p className="footer-mark" aria-hidden="true" data-reveal="rise">
        {f.wordmark}
      </p>
      <div className="footer-grid">
        <div className="footer-contact" data-reveal="fade">
          <p className="footer-label">{f.contact}</p>
          <EnquireButton from="footer" className="pill pill-amber pill-xl">
            {f.cta}
          </EnquireButton>
          <a className="footer-mail" href={`mailto:${e.email}`}>
            {e.email}
          </a>
        </div>
        <Social variant="full" className="footer-social" />
      </div>
      <div className="footer-base">
        <p>{fill(f.credits, { names: photographers.join(", ") })}</p>
        <p>{fill(f.copyright, { year: new Date().getFullYear() })}</p>
        <nav className="footer-legal" aria-label={f.legal.label}>
          {LEGAL.map(({ path, key }) => (
            <a key={path} href={path}>
              {f.legal[key]}
            </a>
          ))}
          <CookieSettings label={f.legal.settings} />
        </nav>
      </div>
    </footer>
  );
}
