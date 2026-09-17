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
import { Odometer } from "./Odometer";
import { RankingClimb } from "./RankingClimb";

const t = content;
const CHAPTER_PHOTOS = ["xc-autumn", "watch", "track-lying", "crowd", "final-arms"] as const;

function PlayIcon() {
  return <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z" fill="currentColor" /></svg>;
}

export function ConceptA() {
  const root = useRef<HTMLDivElement>(null);
  const m = useModals();
  const poster = photo("stage-point");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Hero: lanes draw, headline lines rise, board cells arrive, numerals count.
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.from(".hero-lanes i", { scaleX: 0, duration: 1.2, stagger: 0.05, ease: "power2.inOut" }, 0);
        SplitText.create(".hero-headline", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => intro.from(self.lines, { yPercent: 110, duration: 0.9, stagger: 0.08 }, 0.15),
        });
        intro.from([".hero-copy .lede", ".hero-kicker", ".hero-actions"], { opacity: 0, y: 12, duration: 0.7, stagger: 0.08 }, 0.55);
        intro.from(".hero-board .cell, .hero-board .board-film", { opacity: 0, duration: 0.6, stagger: 0.07 }, 0.5);
        gsap.utils.toArray<HTMLElement>("[data-odometer]").forEach((el) => {
          const target = Number(el.dataset.odometer);
          const o = { v: 0 };
          intro.to(o, { v: target, duration: 1.4, ease: "power2.out", snap: { v: 1 }, onUpdate: () => (el.textContent = String(Math.round(o.v))) }, 0.7);
        });

        // Lane rules between sections draw in from the left as they enter.
        gsap.utils.toArray<HTMLElement>(".lane-rule").forEach((rule) => {
          gsap.from(rule, { scaleX: 0, ease: "none", scrollTrigger: { trigger: rule, start: "top 92%", end: "top 58%", scrub: 0.4 } });
        });

        // Text blocks fade in place. No slide; the rules already give the movement.
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, overwrite: true }),
        });
        gsap.set("[data-reveal]", { opacity: 0 });

        // Skip control visible only while the story is on screen.
        const skip = root.current!.querySelector(".skip");
        if (skip) {
          gsap.set(skip, { opacity: 0, pointerEvents: "none" });
          ScrollTrigger.create({
            trigger: "#story",
            endTrigger: "#proof",
            start: "top 60%",
            end: "top 80%",
            onToggle: (self) => gsap.to(skip, { opacity: self.isActive ? 1 : 0, pointerEvents: self.isActive ? "auto" : "none", duration: 0.3 }),
          });
        }
      });
    },
    { scope: root },
  );

  // Always the same props on server and client; MotionConfig turns the gesture off for reduced motion.
  const tap = { scale: 0.97 };

  return (
    <MotionConfig reducedMotion="user">
    <div ref={root}>
      <header className="nav">
        <a href="#top" className="wordmark"><b>John Heymans</b><span>{t.brand.shortRole}</span></a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#keynote">{t.nav.keynote}</a>
          <a href="#story">{t.nav.story}</a>
          <a href="#proof">{t.nav.proof}</a>
          <a href="#about">{t.nav.about}</a>
        </nav>
        <motion.button className="btn btn-primary btn-sm" onClick={() => m.openBooking()} whileTap={tap}>{t.nav.enquire}</motion.button>
      </header>

      <main id="top">
        {/* Hero. Enquiry is primary here: the buyer comparing speakers needs the price path fast. */}
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-lanes" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => <i key={i} data-n={String(i + 1)} />)}
          </div>
          <div className="grid hero-inner">
            <div className="hero-copy">
              <h1 id="hero-title" className="display display-xl hero-headline">{t.hero.a.headline}</h1>
              <p className="lede">{t.hero.a.sub}</p>
              <p className="hero-kicker">{t.hero.a.kicker}</p>
              <div className="hero-actions">
                <motion.button className="btn btn-accent" onClick={() => m.openBooking()} whileTap={tap}>{t.nav.enquire}</motion.button>
                <motion.button className="btn btn-ghost" onClick={m.openFilm} whileTap={tap}><PlayIcon />{t.nav.film}</motion.button>
              </div>
            </div>
            <div className="hero-board">
              <div className="board">
                <div className="board-cells">
                  {t.numbers.map((n, i) => (
                    <div key={n.label} className={`cell ${i === 3 ? "is-accent" : ""}`}>
                      <Odometer value={n.value} unit={n.unit} />
                      <p className="label">{n.label}</p>
                    </div>
                  ))}
                </div>
                <button className="board-film" onClick={m.openFilm} aria-label={t.nav.film}>
                  <Image src={poster.src} alt="" fill sizes="(min-width: 992px) 40vw, 100vw" priority />
                  <span className="play"><PlayIcon />{t.nav.film}</span>
                  <span className="photo-credit">Photo {poster.credit}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="wrap"><div className="lane-rule" /></div>

        {/* Proposition */}
        <section className="wrap section-pad" aria-labelledby="prop-title">
          <div className="grid">
            <h2 id="prop-title" className="display display-l prop-title" data-reveal>{t.proposition.title}</h2>
            <div className="prop-body">
              {t.proposition.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}
            </div>
          </div>
        </section>

        <div className="wrap"><div className="lane-rule" /></div>

        {/* Story chapters. Teasers only; the lessons stay in the room. */}
        <section className="wrap section-pad" id="story" aria-labelledby="story-title">
          <div className="chapters-head">
            <h2 id="story-title" className="display display-l" data-reveal>Five parts. Two years.</h2>
            <p className="body" data-reveal style={{ maxWidth: "26rem" }}>What each part is about, without the part you pay for.</p>
          </div>
          <ol>
            {t.chapters.map((c, i) => (
              <li key={c.n} className="chapter">
                <span className="chapter-n">{c.n}</span>
                <div>
                  <p className="chapter-place">{c.place}</p>
                  <h3 className="chapter-title">{c.title}</h3>
                </div>
                <div className="chapter-body">
                  <p className="chapter-tease">{c.tease}</p>
                  <p className="chapter-hook">{c.hook}</p>
                </div>
                <Photo slug={CHAPTER_PHOTOS[i]} alt="" sizes="(min-width: 992px) 16vw, 100vw" className="chapter-img" />
              </li>
            ))}
          </ol>
        </section>

        <RankingClimb />

        {/* Keynote */}
        <section className="wrap section-pad" id="keynote" aria-labelledby="keynote-title">
          <div className="keynote-head">
            <h2 id="keynote-title" className="display display-l" data-reveal>{t.keynote.title}</h2>
            <p className="lede" data-reveal>{t.keynote.intro}</p>
          </div>
          <div className="facts">
            {t.keynote.facts.map((f) => (
              <div key={f.label} className="fact"><span className="label">{f.label}</span><strong>{f.value}</strong></div>
            ))}
          </div>
          <div className="contexts">
            {t.keynote.contexts.map((c) => (
              <div key={c.title} className="context" data-reveal><strong>{c.title}</strong><p>{c.detail}</p></div>
            ))}
          </div>
          <div className="recording">
            <Photo slug="stage-wide" alt="John on stage at Supernova, a wide screen behind him" sizes="(min-width: 992px) 40vw, 100vw" />
            <div>
              <h3 className="display display-m" data-reveal>{t.keynote.supernova.title}</h3>
              <p className="body" data-reveal style={{ marginTop: "0.75rem" }}>{t.keynote.supernova.note}</p>
            </div>
          </div>
        </section>

        <div className="wrap"><div className="lane-rule" /></div>

        {/* Proof */}
        <section className="wrap section-pad" id="proof" aria-labelledby="proof-title">
          <h2 id="proof-title" className="display display-l" data-reveal>{t.proof.title}</h2>
          <ul className="clients">
            {t.proof.clients.map((c) => <li key={c} className="client">{c}</li>)}
          </ul>
          <p className="label clients-note">{t.proof.footnote}</p>
          <div className="quotes">
            {t.proof.quotes.map((q) => (
              <blockquote key={q.org} className="quote" data-reveal>
                <p>{q.text}</p>
                <footer><strong>{q.who}</strong><span>{q.org}</span></footer>
              </blockquote>
            ))}
          </div>
        </section>

        <div className="wrap"><div className="lane-rule" /></div>

        {/* About */}
        <section className="wrap section-pad" id="about" aria-labelledby="about-title">
          <div className="grid">
            <Photo slug="stage-portrait" alt="John Heymans speaking on stage" sizes="(min-width: 992px) 40vw, 100vw" className="about-img" />
            <div className="about-copy">
              <h2 id="about-title" className="display display-l" data-reveal>{t.about.title}</h2>
              {t.about.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}
              <p className="signature" data-reveal>{t.about.signature}</p>
            </div>
          </div>
        </section>

        {/* Enquire */}
        <section className="wrap section-pad enquire" id="enquire" aria-labelledby="enquire-title">
          <div className="enquire-inner">
            <div>
              <h2 id="enquire-title" className="display display-xl" data-reveal>{t.enquiry.title}</h2>
              <p className="lede" data-reveal style={{ marginTop: "1.5rem" }}>{t.enquiry.intro}</p>
            </div>
            <div className="enquire-actions">
              <motion.button className="btn btn-accent" onClick={() => m.openBooking()} whileTap={tap}>{t.enquiry.submit}</motion.button>
              <a className="enquire-mail" href={`mailto:${t.enquiry.email}`}>{t.enquiry.email}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <div className="footer-grid">
          <div>
            <p className="label">{t.footer.contact}</p>
            <p style={{ marginTop: "0.5rem" }}><a href={`mailto:${t.enquiry.email}`}>{t.enquiry.email}</a></p>
          </div>
          <div>
            <p className="label">{t.footer.credits}</p>
            <p style={{ marginTop: "0.5rem" }}>{photographers.join(", ")}</p>
          </div>
          <div>
            <p className="label">Concept</p>
            <p style={{ marginTop: "0.5rem" }}>A. Ranking. <Link href="/">All three concepts</Link></p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.made}</span>
        </div>
      </footer>

      <button className="skip btn btn-ghost btn-sm" onClick={() => m.openBooking()}>{t.nav.skip}</button>

      <BookingModal open={m.booking} onClose={m.closeBooking} prefill={m.prefill} />
      <FilmModal open={m.film} onClose={m.closeFilm} poster="stage-point" />
    </div>
    </MotionConfig>
  );
}
