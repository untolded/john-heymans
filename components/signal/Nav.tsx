"use client";

import { motion } from "framer-motion";
import { content } from "@/lib/content";

/**
 * The whole interface: his name and one button. It inverts when the page
 * reaches the practical part, which is the only place the ground turns light.
 */
export function Nav({ onEnquire }: { onEnquire: () => void }) {
  const t = content.signal.nav;
  return (
    <header className="nav" data-theme="night">
      <a className="nav-mark" href="#top">{t.wordmark}</a>
      <motion.button className="btn btn-amber btn-sm" onClick={onEnquire} whileTap={{ scale: 0.97 }}>
        {t.cta}
      </motion.button>
    </header>
  );
}
