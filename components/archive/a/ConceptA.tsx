"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import { motion, MotionConfig } from "framer-motion";
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { content } from "@/lib/content";
import { photo, photographers } from "@/lib/photos";
import { Photo } from "@/components/shared/Photo";
import { BookingModal } from "@/components/shared/BookingModal";
import { FilmModal } from "@/components/shared/FilmModal";
import { useModals } from "@/components/shared/useModals";
import { Social } from "@/components/shared/Social";
import { Logos } from "@/components/shared/Logos";
import { Quote } from "@/components/shared/Quote";
import { Odometer } from "./Odometer";
import { RaceClock } from "./RaceClock";
import { ClimbStrip } from "./ClimbStrip";

const t = content;

function PlayIcon() {
  return <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z" fill="currentColor" /></svg>;
}

export function ConceptA() {
  const root = useRef<HTMLDivElement>(null);
  const m = useModals();
  const hero = photo("final-pan");
  const tap = { scale: 0.97 };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Hero: the blur keeps moving, the title rises, numerals count.
        gsap.to(".hero-media img", { xPercent: -3, scale: 1.06, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.from(".hero-title span", { yPercent: 100, duration: 1, stagger: 0.09 }, 0.1);
        intro.from([".hero-sub", ".hero-actions", ".hero-split > *"], { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.6);
        gsap.utils.toArray<HTMLElement>("[data-odometer]").forEach((el) => {
          const target = Number(el.dataset.odometer);
          const o = { v: 0 };
          gsap.to(o, { v: target, duration: 1.4, ease: "power2.out", snap: { v: 1 }, onUpdate: () => (el.textContent = String(Math.round(o.v))), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });

        gsap.utils.toArray<HTMLElement>(".lane-rule").forEach((rule) => {
          gsap.from(rule, { scaleX: 0, ease: "none", scrollTrigger: { trigger: rule, start: "top 92%", end: "top 58%", scrub: 0.4 } });
        });
        gsap.utils.toArray<HTMLElement>(".display-xl, .display-l").forEach((el) => {
          if (el.closest(".hero") || el.closest(".strip-head")) return;
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 0.9, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
          });
        });
        gsap.set("[data-reveal]", { opacity: 0 });
        ScrollTrigger.batch("[data-reveal]", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, duration: 0.8, stagger: 0.08 }) });

        // Logo marquees, two rows in opposite directions, paused on hover.
        gsap.utils.toArray<HTMLElement>(".marquee-track").forEach((track, i) => {
          const tween = gsap.to(track, { xPercent: i % 2 ? 0 : -50, duration: 40, ease: "none", repeat: -1 });
          if (i % 2) gsap.set(track, { xPercent: -50 });
          track.addEventListener("pointerenter", () => tween.pause());
          track.addEventListener("pointerleave", () => tween.play());
        });
      });
    },
    { scope: root },
  );

  return (
    <MotionConfig reducedMotion="user">
    <div ref={root}>
      <header className="nav">
        <a href="#top" className="wordmark">John Heymans</a>
        <div className="nav-mid">
          <nav className="nav-links" aria-label="Sections">
            <a href="#story">{t.nav.story}</a>
            <a href="#keynote">{t.nav.keynote}</a>
            <a href="#proof">{t.nav.proof}</a>
          </nav>
          <RaceClock />
        </div>
        <div className="nav-right">
          <Social />
          <motion.button className="btn btn-accent btn-sm" onClick={() => m.openBooking()} whileTap={tap}>{t.nav.enquireShort}</motion.button>
        </div>
        <span className="nav-progress" aria-hidden="true" />
      </header>

      <main id="top">
        {/* Hero. Enquiry primary: the buyer comparing speakers needs the price path fast. */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media">
            <Image src={hero.src} alt="The Olympic 5000m field at full speed, motion blurred on the lavender Paris track" fill sizes="100vw" priority />
          </div>
          <div className="hero-inner wrap">
            <div>
              <h1 id="hero-title" className="display display-hero hero-title">
                <span>Two years from</span><span>deciding to try to</span><span>the Olympic final.</span>
              </h1>
              <p className="lede hero-sub">{t.hero.a.sub}</p>
              <div className="hero-actions">
                <motion.button className="btn btn-accent" onClick={() => m.openBooking()} whileTap={tap}>{t.nav.enquire}</motion.button>
                <motion.button className="btn btn-ghost" onClick={m.openFilm} whileTap={tap}><PlayIcon />{t.nav.film}</motion.button>
              </div>
            </div>
            <div className="hero-split">
              <p className="numeral">{t.brand.pb}</p>
              <p className="label">{t.brand.pbLabel}. Scroll to run it.</p>
              <p className="hero-credit">{hero.caption}. Photo {hero.credit}</p>
            </div>
          </div>
        </section>

        <section className="wrap section-pad" aria-labelledby="statement-title">
          <div className="statement-grid">
            <h2 id="statement-title" className="display display-xl">{t.proposition.title}</h2>
            <div>{t.proposition.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}</div>
          </div>
          <ul className="splits">
            {t.numbers.map((n) => (
              <li key={n.label} className="split">
                <Odometer value={n.value} unit={n.unit} />
                <p className="label">{n.label}</p>
              </li>
            ))}
          </ul>
        </section>

        <ClimbStrip />

        <section className="wrap section-pad" id="keynote" aria-labelledby="keynote-title">
          <div className="keynote-grid">
            <div>
              <h2 id="keynote-title" className="display display-xl">{t.keynote.title}</h2>
              <dl className="facts">
                {t.keynote.facts.map((f) => <div key={f.label} className="fact" data-reveal><dt className="label">{f.label}</dt><dd>{f.value}</dd></div>)}
              </dl>
            </div>
            <div>
              <p className="lede" data-reveal>{t.keynote.intro}</p>
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

        <div className="wrap"><div className="lane-rule" /></div>

        <section className="section-pad" id="proof" aria-labelledby="proof-title">
          <div className="wrap"><h2 id="proof-title" className="display display-xl">{t.proof.title}</h2></div>
          <div className="marquee"><div className="marquee-track"><Logos /><Logos /></div></div>
          <div className="marquee"><div className="marquee-track"><Logos /><Logos /></div></div>
          <div className="wrap">
            <p className="label clients-note" data-reveal>{t.proof.footnote}</p>
            <div className="quotes">
              {t.proof.quotes.map((q) => <Quote key={q.org} q={q} />)}
            </div>
          </div>
        </section>

        <section className="wrap section-pad" id="about" aria-labelledby="about-title">
          <div className="about-grid">
            <Photo slug="stage-portrait" alt="John Heymans speaking on stage" sizes="(min-width: 992px) 40vw, 100vw" className="about-img" />
            <div className="about-copy">
              <h2 id="about-title" className="display display-xl">{t.about.title}</h2>
              {t.about.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}
              <p className="signature" data-reveal>{t.about.signature}</p>
            </div>
          </div>
        </section>

        <section className="wrap section-pad enquire" id="enquire" aria-labelledby="enquire-title">
          <div className="enquire-grid">
            <div>
              <h2 id="enquire-title" className="display display-xl">{t.enquiry.title}</h2>
              <p className="lede" style={{ marginTop: "1.5rem" }}>{t.enquiry.intro}</p>
            </div>
            <div className="enquire-actions">
              <motion.button className="btn btn-dark" onClick={() => m.openBooking()} whileTap={tap}>{t.enquiry.submit}</motion.button>
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
          <span>Concept A. <Link href="/archive/concept-b">B</Link> <Link href="/archive/concept-c">C</Link></span>
        </div>
      </footer>

      <BookingModal open={m.booking} onClose={m.closeBooking} prefill={m.prefill} />
      <FilmModal open={m.film} onClose={m.closeFilm} poster="stage-point" />
    </div>
    </MotionConfig>
  );
}
