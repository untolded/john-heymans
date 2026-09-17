"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/content";

/**
 * The five parts of the keynote as an accordion. One open at a time; the
 * height animates with Framer Motion so the reader sees what changed.
 */
export function Parts() {
  const [open, setOpen] = useState<number | null>(1);
  const reduce = useReducedMotion();
  return (
    <ol className="parts">
      {content.chapters.map((c, i) => {
        const isOpen = open === i;
        return (
          <li key={c.n} className="part">
            <button className="part-btn" aria-expanded={isOpen} aria-controls={`part-${c.n}`} id={`part-btn-${c.n}`} onClick={() => setOpen(isOpen ? null : i)}>
              <span className="part-n">{c.n}</span>
              <span><span className="part-title">{c.title}</span> <span className="part-place">{c.place}</span></span>
              <motion.span className="part-icon" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: reduce ? 0 : 0.3 }} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.25" /></svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`part-${c.n}`}
                  role="region"
                  aria-labelledby={`part-btn-${c.n}`}
                  className="part-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { height: { type: "spring", stiffness: 380, damping: 40 }, opacity: { duration: 0.25 } }}
                >
                  <div className="part-body-inner">
                    <p>{c.tease}</p>
                    <p className="note">{c.hook}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
