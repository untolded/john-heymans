"use client";

import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { scroller } from "@/lib/story/scroll";
import { SendIcon } from "./icons";

const label = content.story.footer.top;
const PHONE = "(max-width: 699px)";

/**
 * A round "back to the top" button, bottom right, from the moment the
 * practical part takes over the screen. Hidden during the story, which has
 * its own skip control in that corner. On phones it steps aside while the
 * enquiry is on screen, so it never sits on the send button; the cookie
 * banner hides it in CSS. Moves through scroller.to, so Lenis runs it.
 */
export function BackToTop() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const practical = document.querySelector<HTMLElement>(".practical");
    const enquiry = document.querySelector<HTMLElement>("#enquiry");
    if (!practical) return;
    const phone = matchMedia(PHONE);
    let frame = 0;
    const check = () => {
      frame = 0;
      const h = window.innerHeight;
      const inside = practical.getBoundingClientRect().top < h * 0.35;
      let blocked = false;
      if (enquiry && phone.matches) {
        const r = enquiry.getBoundingClientRect();
        blocked = r.top < h && r.bottom > 0;
      }
      setOn(inside && !blocked);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className="to-top"
      data-on={on}
      aria-label={label}
      tabIndex={on ? undefined : -1}
      aria-hidden={on ? undefined : true}
      onClick={() => {
        scroller.to(0, { duration: 1.8 });
        document.querySelector<HTMLElement>(".wordmark")?.focus({ preventScroll: true });
      }}
    >
      <SendIcon />
    </button>
  );
}
