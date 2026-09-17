"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { content } from "@/lib/content";
import { photo, photographers, type PhotoSlug } from "@/lib/photos";
import { Photo } from "@/components/shared/Photo";
import { BookingModal } from "@/components/shared/BookingModal";
import { FilmModal } from "@/components/shared/FilmModal";
import { useModals } from "@/components/shared/useModals";
import { MagneticButton } from "./MagneticButton";
import { Arms } from "./Arms";

const t = content;
const CHAPTERS: { theme: "dark" | "paper"; slug: PhotoSlug; alt: string }[] = [
  { theme: "paper", slug: "xc-autumn", alt: "John racing cross country through autumn woods" },
  { theme: "dark", slug: "watch", alt: "A running watch strapped to a wrist" },
  { theme: "paper", slug: "track-sit", alt: "John sitting on the track, lacing shoes" },
  { theme: "dark", slug: "crowd", alt: "The crowd at the Stade de France" },
];

function PlayIcon({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor" /></svg>;
}

export function ConceptB() {
  const root = useRef<HTMLDivElement>(null);
  const m = useModals();
  const hero = photo("final-run");
  // Always the same props on server and client; MotionConfig turns the gesture off for reduced motion.
  const tap = { scale: 0.97 };

  useGSAP(
    () => {
      const nav = root.current!.querySelector<HTMLElement>(".nav")!;
      // Nav inverts to match whichever section sits under it.
      gsap.utils.toArray<HTMLElement>("[data-theme]").forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 2.25rem",
          end: "bottom 2.25rem",
          onToggle: (self) => { if (self.isActive) nav.dataset.on = sec.dataset.theme; },
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Hero: photo settles, title lines rise, side controls arrive.
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.from(".hero-media", { scale: 1.08, duration: 1.8, ease: "power2.out" }, 0);
        intro.from(".hero-title span", { yPercent: 100, duration: 1, stagger: 0.09 }, 0.2);
        intro.from([".hero-sub", ".hero-side > *"], { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.7);
        gsap.to(".hero-media", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

        // Chapter titles rise line by line as each chapter arrives.
        gsap.utils.toArray<HTMLElement>(".chapter-title, .statement .display-l, .proof .display-xl, .keynote .display-xl, .about .display-xl, .enquire .display-xl").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 0.9, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
          });
        });
        // Chapter photographs slide up a little against the copy.
        gsap.utils.toArray<HTMLElement>(".chapter-img").forEach((img) => {
          gsap.fromTo(img, { yPercent: 8 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.set("[data-reveal]", { opacity: 0 });
        ScrollTrigger.batch("[data-reveal]", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, duration: 0.8, stagger: 0.08 }) });
      });
    },
    { scope: root },
  );

  return (
    <MotionConfig reducedMotion="user">
    <div ref={root}>
      <header className="nav" data-on="dark">
        <a href="#top" className="wordmark">John Heymans</a>
        <div className="nav-right">
          <a href="#keynote" className="hide-m">{t.nav.keynote}</a>
          <a href="#proof" className="hide-m">{t.nav.proof}</a>
          <button onClick={m.openFilm} className="hide-m">{t.nav.filmShort}</button>
          <button className="nav-cta" onClick={() => m.openBooking()}><span>{t.nav.enquireShort}</span></button>
        </div>
      </header>

      <main id="top">
        {/* Hero. The film is primary: it carries the same spine as the site and does the selling. */}
        <section className="hero" data-theme="dark" aria-labelledby="hero-title">
          <div className="hero-media">
            <Image src={hero.src} alt="John Heymans running the Olympic 5000m in Paris" fill sizes="100vw" priority />
          </div>
          <div className="hero-inner wrap">
            <div>
              <h1 id="hero-title" className="display display-hero hero-title">
                {t.hero.b.lines.map((l) => <span key={l}>{l}</span>)}
              </h1>
              <p className="lede hero-sub">{t.hero.b.sub}</p>
            </div>
            <div className="hero-side">
              <MagneticButton className="play" onClick={m.openFilm} aria-label={t.nav.film}>
                <span className="play-disc"><PlayIcon /></span>
                <span className="play-text">{t.nav.film}<small>Voice-over by a leading athletics commentator</small></span>
              </MagneticButton>
              <motion.button className="btn btn-line" onClick={() => m.openBooking()} whileTap={tap}>{t.nav.enquire}</motion.button>
              <span className="hero-credit">{hero.caption}. Photo {hero.credit}</span>
            </div>
          </div>
        </section>

        {/* Statement */}
        <section className="statement wrap" data-theme="dark" aria-labelledby="statement-title">
          <div className="statement-grid">
            <h2 id="statement-title" className="display display-l">{t.proposition.title}</h2>
            <div>{t.proposition.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}</div>
          </div>
          <ul className="numbers">
            {t.numbers.map((n) => (
              <li key={n.label} className="number" data-reveal>
                <p className="display">{n.value}{n.unit ? <small>{n.unit}</small> : null}</p>
                <p className="label">{n.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Chapters 01 to 04 alternate dark and paper. 05 is the bold element. */}
        <div id="story">
          {t.chapters.slice(0, 4).map((c, i) => (
            <section key={c.n} className="chapter" data-theme={CHAPTERS[i].theme} aria-labelledby={`ch-${c.n}`}>
              <div className="chapter-inner wrap">
                <div className="chapter-copy">
                  <p className="chapter-n" aria-hidden="true">{c.n}</p>
                  <p className="label chapter-place">{c.place}</p>
                  <h2 id={`ch-${c.n}`} className="display display-xl chapter-title">{c.title}</h2>
                  <p className="lede chapter-tease">{c.tease}</p>
                  <p className="chapter-hook label" data-reveal>{c.hook}</p>
                </div>
                <Photo slug={CHAPTERS[i].slug} alt={CHAPTERS[i].alt} sizes="(min-width: 992px) 45vw, 100vw" className="chapter-img" />
              </div>
            </section>
          ))}
          <Arms tease={t.chapters[4].tease} hook={t.chapters[4].hook} />
        </div>

        {/* Keynote on paper */}
        <section className="keynote wrap" id="keynote" data-theme="paper" aria-labelledby="keynote-title">
          <div className="keynote-grid">
            <div>
              <h2 id="keynote-title" className="display display-xl">{t.keynote.title}</h2>
              <dl className="facts">
                {t.keynote.facts.map((f) => <div key={f.label} className="fact" data-reveal><dt className="label">{f.label}</dt><dd><strong>{f.value}</strong></dd></div>)}
              </dl>
            </div>
            <div>
              <p className="lede" data-reveal>{t.keynote.intro}</p>
              <div className="contexts" style={{ marginTop: "2.5rem" }}>
                {t.keynote.contexts.map((c) => <div key={c.title} className="context" data-reveal><h3 className="display display-m">{c.title}</h3><p>{c.detail}</p></div>)}
              </div>
            </div>
          </div>
          <div className="recording">
            <Image src={photo("stage-wide").src} alt="John on stage at Supernova" fill sizes="100vw" />
            <div className="recording-copy">
              <p className="label" style={{ color: "var(--bone-dim)" }}>{t.keynote.supernova.title}</p>
              <p className="lede" style={{ marginTop: "0.5rem" }}>{t.keynote.supernova.note}</p>
            </div>
            <span className="photo-credit" style={{ position: "absolute", right: "0.75rem", bottom: "0.75rem", color: "#fff" }}>Photo {photo("stage-wide").credit}</span>
          </div>
        </section>

        {/* Proof */}
        <section className="proof wrap" id="proof" data-theme="dark" aria-labelledby="proof-title">
          <h2 id="proof-title" className="display display-xl">{t.proof.title}</h2>
          <ul className="clients">{t.proof.clients.map((c) => <li key={c} data-reveal>{c}</li>)}</ul>
          <p className="label clients-note" data-reveal>{t.proof.footnote}</p>
          <div className="quotes">
            {t.proof.quotes.map((q) => (
              <blockquote key={q.org} className="quote" data-reveal><p>{q.text}</p><footer><strong>{q.who}</strong><span>{q.org}</span></footer></blockquote>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="about wrap" id="about" data-theme="dark" aria-labelledby="about-title">
          <div className="about-grid">
            <Photo slug="stage-portrait-2" alt="John Heymans speaking" sizes="(min-width: 992px) 40vw, 100vw" className="about-img" />
            <div className="about-copy">
              <h2 id="about-title" className="display display-xl">{t.about.title}</h2>
              {t.about.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}
              <p className="marker" data-reveal>{t.about.signature}</p>
            </div>
          </div>
        </section>

        {/* Enquire. Yellow's second and last appearance. */}
        <section className="enquire wrap" id="enquire" data-theme="dark" aria-labelledby="enquire-title">
          <div className="enquire-grid">
            <div>
              <h2 id="enquire-title" className="display display-xl">{t.enquiry.title}</h2>
              <p className="lede" data-reveal style={{ marginTop: "1.5rem" }}>{t.enquiry.intro}</p>
            </div>
            <div className="enquire-actions">
              <motion.button className="btn btn-flag" onClick={() => m.openBooking()} whileTap={tap}>{t.enquiry.submit}</motion.button>
              <a className="enquire-mail" href={`mailto:${t.enquiry.email}`}>{t.enquiry.email}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer wrap" data-theme="dark">
        <p>{t.footer.copyright}. {t.footer.made}</p>
        <p>{t.footer.credits}: {photographers.join(", ")}</p>
        <p>Concept B. Made it. <Link href="/">All three concepts</Link></p>
      </footer>

      <BookingModal open={m.booking} onClose={m.closeBooking} prefill={m.prefill} />
      <FilmModal open={m.film} onClose={m.closeFilm} poster="final-run" />
    </div>
    </MotionConfig>
  );
}
