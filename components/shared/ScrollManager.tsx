"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
// ScrollTrigger on its own: importing lib/gsap here would load every plugin on every page.
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const KEY = (path: string) => `scroll:${path}`;
const ENFORCE_MS = 1500;

function saved(path: string): number {
  try {
    return Number(sessionStorage.getItem(KEY(path))) || 0;
  } catch {
    return 0;
  }
}

/**
 * One rule for scroll position across the site:
 * - a fresh load, a reload or a normal link lands at the top;
 * - browser back or forward returns to where you were on that page.
 *
 * The browser's own restoration is switched off because it fires before GSAP
 * has built the pinned sections, which lands visitors mid-page. Instead the
 * position is saved per page and re-applied for a short window while pins,
 * images and fonts settle. Any input from the visitor ends that window.
 */
export function ScrollManager() {
  const pathname = usePathname();
  const current = useRef<string | null>(null);
  // The last decision, so a repeated effect run for the same page (React dev
  // re-runs effects) reuses it instead of treating the page as a new visit.
  const last = useRef<{ path: string; target: number } | null>(null);
  const isPop = useRef(false);
  const saving = useRef(true);
  const stopEnforcing = useRef<() => void>(() => {});

  useEffect(() => {
    history.scrollRestoration = "manual";

    let raf = 0;
    const onScroll = () => {
      if (!saving.current || current.current === null) return;
      cancelAnimationFrame(raf);
      const path = current.current;
      raf = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(KEY(path), String(Math.round(window.scrollY)));
        } catch {}
      });
    };
    // At popstate the URL has already changed but the old page is still on screen.
    // Stop saving so the old position is not written under the new page.
    const onPop = () => {
      isPop.current = true;
      saving.current = false;
    };
    // Leaving for another page by link: freeze the last saved position of this page.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin === location.origin && url.pathname !== location.pathname) saving.current = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    const firstLoad = last.current === null;
    current.current = pathname;

    let target = 0;
    if (!firstLoad && last.current!.path === pathname && !isPop.current) {
      target = last.current!.target;
    } else if (firstLoad) {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "back_forward") {
        target = saved(pathname);
      } else if (location.hash) {
        // A reload or new visit on a section link still starts at the top.
        history.replaceState(history.state, "", location.pathname + location.search);
      }
    } else if (isPop.current) {
      target = saved(pathname);
    }
    isPop.current = false;
    last.current = { path: pathname, target };

    stopEnforcing.current();
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const start = performance.now();
    let frame = 0;
    let done = false;
    const jump = () => {
      if (Math.abs(window.scrollY - target) > 1) window.scrollTo(0, target);
    };
    // resume = false when superseded by the next route change, so saving stays
    // off until that page has settled too.
    const stop = (resume: boolean) => {
      if (done) return;
      done = true;
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener("refresh", jump);
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => window.removeEventListener(t, finish));
      html.style.scrollBehavior = previousBehavior;
      if (resume) saving.current = true;
    };
    const finish = () => stop(true);
    const tick = () => {
      jump();
      if (performance.now() - start < ENFORCE_MS) frame = requestAnimationFrame(tick);
      else finish();
    };

    ScrollTrigger.clearScrollMemory("manual");
    ScrollTrigger.addEventListener("refresh", jump);
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((t) => window.addEventListener(t, finish, { passive: true }));
    jump();
    frame = requestAnimationFrame(tick);
    stopEnforcing.current = () => stop(false);

    return () => stop(false);
  }, [pathname]);

  return null;
}
