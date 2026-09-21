import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { pagePhotographers } from "@/lib/story/photos";
import { Social } from "@/components/shared/Social";
import { EnquireButton } from "./practical/Actions";
import { ScrollPace } from "./ScrollPace";

const f = content.story.footer;
const e = content.story.enquiry;

/**
 * A footer that looks like one: the name across the full width, the email
 * large, the enquiry pill, socials with handles, every photographer, and the
 * scroll pace line for whoever made it all the way down.
 */
export function Footer({ filmIsStandIn }: { filmIsStandIn: boolean }) {
  const photographers = pagePhotographers(filmIsStandIn);
  return (
    <footer className="footer" data-ground="paper">
      <p className="footer-mark" aria-hidden="true">
        {f.wordmark}
      </p>
      <div className="footer-grid">
        <div className="footer-contact">
          <p className="footer-label">{f.contact}</p>
          <a className="footer-mail" href={`mailto:${e.email}`}>
            {e.email}
          </a>
          <EnquireButton from="footer" className="pill pill-amber">
            {content.story.frame.cta}
          </EnquireButton>
        </div>
        <Social variant="full" className="footer-social" />
      </div>
      <div className="footer-base">
        <p>{fill(f.credits, { names: photographers.join(", ") })}</p>
        <p>{fill(f.copyright, { year: new Date().getFullYear() })}</p>
        <a href="#top">{f.top}</a>
      </div>
      <ScrollPace />
    </footer>
  );
}
