"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Visual size. "wide" is used for the film. */
  size?: "form" | "wide";
  closeLabel?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal shared by the booking enquiry and the film. Traps focus,
 * closes on Escape and backdrop click, returns focus to the opener, locks
 * body scroll. Motion is Framer Motion and collapses to a plain fade when the
 * visitor prefers reduced motion.
 */
export function Modal({ open, onClose, title, children, size = "form", closeLabel = "Close" }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const labelId = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Land on the first control in the content, not on the close button.
    const nodes = Array.from(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const first = nodes.find((n) => !n.classList.contains("modal-close")) ?? nodes[0];
    (first ?? panel.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const firstEl = nodes[0], lastEl = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.99 },
        transition: { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.25 }}
        >
          <button className="modal-backdrop" aria-label={closeLabel} onClick={onClose} tabIndex={-1} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            className={`modal-panel modal-panel-${size}`}
            {...panelMotion}
          >
            <div className="modal-head">
              <h2 id={labelId} className="modal-title">{title}</h2>
              <button className="modal-close" onClick={onClose} aria-label={closeLabel}>
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" /></svg>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
