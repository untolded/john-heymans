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
import { Social } from "@/components/shared/Social";
import { Logos } from "@/components/shared/Logos";
import { Quote } from "@/components/shared/Quote";
import { LastLap } from "./LastLap";

const t = content;
const PART_THUMBS: PhotoSlug[] = ["xc-run", "watch-wrist", "track-sit", "budapest-portrait", "final-help"];

function PlayIcon() {
  return <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z" fill="currentColor" /></svg>;
}

export function ConceptC() {
  const root = useRef<HTMLDivElement>(null);
  const m = useModals();
  const hero = photo("pan-indoor");
  const tap = { scale: 0.97 };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.from(".hero-media", { scale: 1.1, duration: 2.2, ease: "power2.out" }, 0);
        intro.fromTo(".hero-line", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power4.inOut" }, 0.2);
        intro.from(".hero-title span", { yPercent: 100, duration: 1, stagger: 0.1 }, 0.5);
        intro.from([".hero-sub", ".hero-side > *"], { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 1);
        gsap.to(".hero-media", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

        // Every section title stands on a red line that draws in first.
        gsap.utils.toArray<HTMLElement>(".title-line .line").forEach((line) => {
          gsap.from(line, { scaleX: 0, duration: 1, ease: "power4.inOut", scrollTrigger: { trigger: line, start: "top 85%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".title-line .display").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
          });
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
      <header className="nav">
        <a href="#top" className="wordmark">{t.brand.name}</a>
        <div className="nav-right">
          <a href="#story" className="hide-m">{t.nav.story}</a>
          <a href="#keynote" className="hide-m">{t.nav.keynote}</a>
          <a href="#proof" className="hide-m">{t.nav.proof}</a>
          <button onClick={m.openFilm} className="hide-m">{t.nav.filmShort}</button>
          <Social className="hide-m" />
          <button className="nav-cta" onClick={() => m.openBooking()}>{t.nav.enquireShort}</button>
        </div>
      </header>

      <main id="top">
        {/* Hero. Enquiry and film side by side; the red line is the finish line, and it comes back at the end. */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media">
            <Image src={hero.src} alt="John Heymans racing indoors, the field blurred around him" fill sizes="100vw" priority />
          </div>
          <span className="hero-line" aria-hidden="true" />
          <div className="hero-inner wrap">
            <div>
              <h1 id="hero-title" className="display display-hero hero-title">
                <span>Everyone with</span><span>experience</span><span>said no.</span>
              </h1>
              <p className="lede hero-sub">{t.hero.c.sub}</p>
            </div>
            <div className="hero-side">
              <motion.button className="btn btn-red" onClick={() => m.openBooking()} whileTap={tap}>{t.nav.enquire}</motion.button>
              <motion.button className="btn btn-line" onClick={m.openFilm} whileTap={tap}><PlayIcon />{t.nav.film}</motion.button>
              <span className="hero-credit">{hero.caption}. Photo {hero.credit}</span>
            </div>
          </div>
        </section>

        <section className="wrap section-pad" aria-labelledby="statement-title">
          <div className="statement-grid">
            <div className="title-line"><span className="line" /><h2 id="statement-title" className="display display-l">{t.proposition.title}</h2></div>
            <div>{t.proposition.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}</div>
          </div>
          <ul className="numbers">
            {t.numbers.map((n) => (
              <li key={n.label} className="number" data-reveal>
                <p className="numeral">{n.value}{n.unit ? <small>{n.unit}</small> : null}</p>
                <p className="label">{n.label}</p>
              </li>
            ))}
          </ul>
        </section>

        <LastLap />

        <section className="wrap section-pad" id="keynote" aria-labelledby="keynote-title">
          <div className="keynote-grid">
            <div>
              <div className="title-line"><span className="line" /><h2 id="keynote-title" className="display display-xl">{t.keynote.title}</h2></div>
              <dl className="facts">
                {t.keynote.facts.map((f) => <div key={f.label} className="fact" data-reveal><dt className="label">{f.label}</dt><dd>{f.value}</dd></div>)}
              </dl>
            </div>
            <div>
              <p className="lede" data-reveal>{t.keynote.intro}</p>
              <ol className="parts" style={{ marginTop: "2rem" }}>
                {t.chapters.map((c, i) => (
                  <li key={c.n} className="part">
                    <span className="part-n">{c.n}</span>
                    <div>
                      <h3 className="part-title">{c.title}</h3>
                      <p className="part-place">{c.place}</p>
                      <p className="part-tease">{c.hook}</p>
                    </div>
                    <Photo slug={PART_THUMBS[i]} alt="" sizes="10rem" className="part-thumb" credit="hidden" />
                  </li>
                ))}
              </ol>
              <div className="contexts">
                {t.keynote.contexts.map((c) => <div key={c.title} className="context" data-reveal><strong>{c.title}</strong><p>{c.detail}</p></div>)}
              </div>
            </div>
          </div>
          <div className="recording">
            <Image src={photo("stage-wide").src} alt="John on stage at Supernova" fill sizes="100vw" />
            <div className="recording-copy">
              <p className="lede">{t.keynote.supernova.title}. {t.keynote.supernova.note}</p>
            </div>
            <span className="photo-credit" style={{ position: "absolute", right: "0.75rem", bottom: "0.75rem", color: "#fff" }}>Photo {photo("stage-wide").credit}</span>
          </div>
        </section>

        <section className="wrap section-pad" id="proof" aria-labelledby="proof-title">
          <div className="title-line"><span className="line" /><h2 id="proof-title" className="display display-xl">{t.proof.title}</h2></div>
          <Logos />
          <p className="label clients-note" data-reveal>{t.proof.footnote}</p>
          <div className="quotes">
            {t.proof.quotes.map((q) => <Quote key={q.org} q={q} />)}
          </div>
        </section>

        <section className="wrap section-pad" id="about" aria-labelledby="about-title">
          <div className="about-grid">
            <Photo slug="stage-portrait-2" alt="John Heymans speaking" sizes="(min-width: 992px) 40vw, 100vw" className="about-img bw" />
            <div className="about-copy">
              <div className="title-line"><span className="line" /><h2 id="about-title" className="display display-xl">{t.about.title}</h2></div>
              {t.about.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}
              <p className="signature" data-reveal>{t.about.signature}</p>
            </div>
          </div>
        </section>

        <section className="wrap section-pad enquire" id="enquire" aria-labelledby="enquire-title">
          <div className="enquire-grid">
            <div>
              <h2 id="enquire-title" className="display display-xl">{t.enquiry.title}</h2>
              <p className="lede" data-reveal style={{ marginTop: "1.5rem" }}>{t.enquiry.intro}</p>
            </div>
            <div className="enquire-actions">
              <motion.button className="btn btn-red" onClick={() => m.openBooking()} whileTap={tap}>{t.enquiry.submit}</motion.button>
              <a className="enquire-mail" href={`mailto:${t.enquiry.email}`}>{t.enquiry.email}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <div className="footer-top">
          <p className="footer-mark" aria-hidden="true">John<br />Heymans</p>
          <div className="footer-links">
            <a href={`mailto:${t.enquiry.email}`}>{t.enquiry.email}</a>
            <Social variant="full" />
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t.footer.copyright} {new Date().getFullYear()}</span>
          <span>{t.footer.credits}: {photographers.join(", ")}</span>
          <span>Concept C. <Link href="/concept-a">A</Link> <Link href="/concept-b">B</Link></span>
        </div>
      </footer>

      <BookingModal open={m.booking} onClose={m.closeBooking} prefill={m.prefill} />
      <FilmModal open={m.film} onClose={m.closeFilm} poster="stage-wide" />
    </div>
    </MotionConfig>
  );
}
