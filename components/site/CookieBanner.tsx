"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { openCookieSettings, readConsent, saveConsent, SETTINGS_EVENT, type Consent } from "@/lib/consent";

const t = content.story.cookies;
/** Long enough for the page's first paint and the hero to settle before anything asks for attention. */
const DELAY = 1200;

/**
 * The cookie banner. Not a dialog: the page stays usable around it. It asks
 * once, with two answers of equal weight, and remembers the choice for six
 * months (lib/consent). "Cookie settings" in the footer brings it back, with
 * focus on the first answer. Rendered on the client only, so the server's
 * HTML never contains it and it cannot shift the page as it loads.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState("");
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = readConsent() ? 0 : window.setTimeout(() => setOpen(true), DELAY);
    const reopen = () => {
      setSaved("");
      setOpen(true);
      requestAnimationFrame(() => first.current?.focus());
    };
    window.addEventListener(SETTINGS_EVENT, reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(SETTINGS_EVENT, reopen);
    };
  }, []);

  const choose = (choice: Consent) => {
    saveConsent(choice);
    setSaved(t.saved[choice]);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <section className="cookie" role="region" aria-labelledby="cookie-title">
          <h2 id="cookie-title" className="cookie-title">
            {t.title}
          </h2>
          <p className="cookie-text">{t.text}</p>
          <div className="cookie-actions">
            <button ref={first} type="button" className="pill cookie-choice" onClick={() => choose("necessary")}>
              {t.necessary}
            </button>
            <button type="button" className="pill cookie-choice" onClick={() => choose("statistics")}>
              {t.allow}
            </button>
          </div>
          {/* A plain link: the router would add weight to every page for one rarely used link. */}
          <a className="cookie-policy" href="/cookies">
            {t.policy}
          </a>
        </section>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {saved}
      </p>
    </>
  );
}

/** The footer's "Cookie settings": opens the banner again. */
export function CookieSettings({ label }: { label: string }) {
  return (
    <button type="button" className="link footer-cookies" onClick={openCookieSettings}>
      {label}
    </button>
  );
}
