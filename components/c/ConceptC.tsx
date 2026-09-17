"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { content } from "@/lib/content";
import { photographers } from "@/lib/photos";
import { Photo } from "@/components/shared/Photo";
import { BookingModal } from "@/components/shared/BookingModal";
import { FilmModal } from "@/components/shared/FilmModal";
import { useModals } from "@/components/shared/useModals";
import { Desk } from "./Desk";
import { Parts } from "./Parts";
import { Log } from "./Log";

const t = content;

export function ConceptC() {
  const root = useRef<HTMLDivElement>(null);
  const m = useModals();
  // Always the same props on server and client; MotionConfig turns the gesture off for reduced motion.
  const tap = { scale: 0.97 };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Hero: the paragraph settles in, the desk arrives a beat later.
        const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
        intro.from(".hero-role", { opacity: 0, duration: 0.6 }, 0);
        intro.from(".hero .display-xl", { opacity: 0, y: 10, duration: 0.9 }, 0.1);
        intro.from(".hero-sub", { opacity: 0, duration: 0.7 }, 0.5);
        intro.from(".hero-side > *", { opacity: 0, y: 10, duration: 0.7, stagger: 0.12 }, 0.6);

        // Photographs are grey until they reach the middle of the viewport.
        gsap.utils.toArray<HTMLElement>(".aside-photo").forEach((fig) => {
          ScrollTrigger.create({ trigger: fig, start: "top 70%", end: "bottom 30%", toggleClass: { targets: fig, className: "is-colour" } });
        });
        // Text arrives quietly, opacity only.
        gsap.set("[data-reveal]", { opacity: 0 });
        ScrollTrigger.batch("[data-reveal]", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, duration: 0.8, stagger: 0.08 }) });
        return () => gsap.utils.toArray<HTMLElement>(".aside-photo").forEach((f) => f.classList.add("is-colour"));
      });
      mm.add(`not all and ${MOTION_OK}`, () => {
        gsap.utils.toArray<HTMLElement>(".aside-photo").forEach((f) => f.classList.add("is-colour"));
      });
    },
    { scope: root },
  );

  return (
    <MotionConfig reducedMotion="user">
    <div ref={root}>
      <header className="nav">
        <a href="#top" className="wordmark">{t.brand.name}</a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#keynote" className="hide-m">{t.nav.keynote}</a>
          <a href="#log" className="hide-m">{t.nav.story}</a>
          <a href="#proof" className="hide-m">{t.nav.proof}</a>
          <button onClick={m.openFilm} className="hide-m">{t.nav.filmShort}</button>
          <a href="#enquire" className="pen">{t.nav.enquireShort}</a>
        </nav>
      </header>

      <main id="top">
        {/* Hero. The desk is primary: the returning leader is already sold. The film is one click away. */}
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div>
              <p className="hero-role">{t.brand.role}</p>
              <h1 id="hero-title" className="display display-xl">{t.hero.c.headline}</h1>
              <p className="lede hero-sub">{t.hero.c.sub}</p>
            </div>
            <div className="hero-side">
              <Desk onContinue={m.openBooking} />
              <button className="film-link" onClick={m.openFilm}>
                <Photo slug="stage-point" alt="" sizes="7rem" credit="hidden" />
                <span><strong>{t.nav.film}</strong><span className="small">Sixty seconds. Voice-over by a leading athletics commentator.</span></span>
              </button>
            </div>
          </div>
        </section>

        <div className="wrap"><div className="rule" /></div>

        {/* Reading flow: the proposition, with the numbers as a margin note. */}
        <section className="wrap section-pad read" aria-labelledby="read-title">
          <div className="page">
            <div>
              <h2 id="read-title" className="display display-l">{t.proposition.title}</h2>
              {t.proposition.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}
              <dl className="numbers">
                {t.numbers.map((n) => (
                  <div key={n.label} className="number" data-reveal>
                    <dt className="sr-only">{n.label}</dt>
                    <dd><strong>{n.value}{n.unit ? <small>{n.unit}</small> : null}</strong><span className="small">{n.label}</span></dd>
                  </div>
                ))}
              </dl>
            </div>
            <aside className="margin-note">
              <Photo slug="kit-hips" alt="John in the Belgian kit on an indoor track" sizes="(min-width: 992px) 26rem, 100vw" className="aside-photo" credit="below" />
            </aside>
          </div>
        </section>

        <Log />

        {/* Keynote */}
        <section className="wrap section-pad" id="keynote" aria-labelledby="keynote-title">
          <div className="page">
            <div>
              <h2 id="keynote-title" className="display display-l">{t.keynote.title}</h2>
              <p className="lede" data-reveal>{t.keynote.intro}</p>
              <dl className="facts">
                {t.keynote.facts.map((f) => <div key={f.label} className="fact" data-reveal><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
              </dl>
              <h3 className="display-m" style={{ marginTop: "3rem", marginBottom: "0.5rem" }}>The five parts</h3>
              <Parts />
              <h3 className="display-m" style={{ marginTop: "3rem" }}>Where it works</h3>
              <ul className="contexts">
                {t.keynote.contexts.map((c) => <li key={c.title} className="context" data-reveal><strong>{c.title}</strong><span>{c.detail}</span></li>)}
              </ul>
            </div>
            <aside className="margin-note">
              <div className="recording">
                <Photo slug="stage-wide" alt="John on stage at Supernova" sizes="(min-width: 992px) 40rem, 100vw" className="aside-photo is-wide" credit="below" />
                <div>
                  <p><em>{t.keynote.supernova.title}.</em> {t.keynote.supernova.note}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="wrap"><div className="rule" /></div>

        {/* Proof, written as a sentence. */}
        <section className="wrap section-pad" id="proof" aria-labelledby="proof-title">
          <div className="page">
            <div>
              <h2 id="proof-title" className="display display-l">{t.proof.title}</h2>
              <p className="clients-line" data-reveal>
                {t.proof.clients.map((c, i) => (
                  <span key={c}><b>{c}</b>{i < t.proof.clients.length - 1 ? (i === t.proof.clients.length - 2 ? " and " : ", ") : "."}</span>
                ))}{" "}
                <span className="note">{t.proof.footnote}</span>
              </p>
              {t.proof.quotes.map((q) => (
                <blockquote key={q.org} className="quote" data-reveal>
                  <p>{q.text}</p>
                  <footer><strong>{q.who}</strong>, <span>{q.org}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <div className="wrap"><div className="rule" /></div>

        {/* About */}
        <section className="wrap section-pad" id="about" aria-labelledby="about-title">
          <div className="page">
            <div>
              <h2 id="about-title" className="display display-l">{t.about.title}</h2>
              {t.about.body.map((p) => <p key={p} className="body" data-reveal>{p}</p>)}
              <p className="signature" data-reveal>{t.about.signature}</p>
            </div>
            <aside className="margin-note">
              <Photo slug="track-laugh" alt="John laughing at the side of a track" sizes="(min-width: 992px) 26rem, 100vw" className="aside-photo" credit="below" />
            </aside>
          </div>
        </section>

        {/* Enquire: the desk again, on the counter. */}
        <section className="wrap section-pad enquire" id="enquire" aria-labelledby="enquire-title">
          <div className="page">
            <div>
              <h2 id="enquire-title" className="display display-l">{t.enquiry.title}</h2>
              <p className="lede" data-reveal>{t.enquiry.intro}</p>
              <p className="body" data-reveal style={{ marginTop: "1.5rem" }}>Or write to <a className="link" href={`mailto:${t.enquiry.email}`}>{t.enquiry.email}</a>.</p>
              <motion.button className="btn btn-line" style={{ marginTop: "1.5rem" }} onClick={m.openFilm} whileTap={tap}>{t.nav.film}</motion.button>
            </div>
            <aside className="margin-note">
              <Desk onContinue={m.openBooking} compact />
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <p>{t.footer.copyright}. {t.footer.made}</p>
        <p>{t.footer.credits}: {photographers.join(", ")}</p>
        <p>Concept C. The log. <Link href="/">All three concepts</Link></p>
      </footer>

      <BookingModal open={m.booking} onClose={m.closeBooking} prefill={m.prefill} />
      <FilmModal open={m.film} onClose={m.closeFilm} poster="stage-wide" />
    </div>
    </MotionConfig>
  );
}
