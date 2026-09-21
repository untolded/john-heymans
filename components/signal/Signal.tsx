"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { content } from "@/lib/content";
import { photographers } from "@/lib/photos";
import { BookingModal } from "@/components/shared/BookingModal";
import { Social } from "@/components/shared/Social";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Story } from "./Story";
import { Practical } from "./Practical";
import { Bio } from "./Bio";

const t = content;
const s = content.signal;

export function Signal() {
  const root = useRef<HTMLDivElement>(null);
  const [booking, setBooking] = useState(false);

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => gsap.set(".progress", { scaleX: self.progress }),
      });

      // One ground under the whole page. It turns from night to paper when the
      // story hands over to the practical part, and the nav turns with it.
      const nav = root.current!.querySelector<HTMLElement>(".nav")!;
      gsap.utils.toArray<HTMLElement>("[data-theme]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => { if (self.isActive) { nav.dataset.theme = section.dataset.theme!; document.body.dataset.theme = section.dataset.theme!; } },
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            linesClass: "split-line",
            onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
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
      <div ref={root} className="page">
        <span className="progress" aria-hidden="true" />
        <Nav onEnquire={() => setBooking(true)} />

        <main>
          <Hero />
          <Story />
          <Practical />
          <Bio />

          <section className="enquire wrap" id="enquire" data-theme="paper" aria-labelledby="enquire-title">
            <h2 id="enquire-title" className="display d-xl" data-rise>{s.enquire.title}</h2>
            <p className="lede" data-reveal>{s.enquire.sub}</p>
            <div className="enquire-actions">
              <motion.button className="btn btn-amber" onClick={() => setBooking(true)} whileTap={{ scale: 0.97 }}>{t.enquiry.submit}</motion.button>
              <a className="enquire-mail" href={`mailto:${t.enquiry.email}`}>{t.enquiry.email}</a>
            </div>
          </section>
        </main>

        <footer className="footer wrap" data-theme="night">
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
            <span><Link href="/">All concepts</Link></span>
          </div>
        </footer>

        <BookingModal open={booking} onClose={() => setBooking(false)} />
      </div>
    </MotionConfig>
  );
}
