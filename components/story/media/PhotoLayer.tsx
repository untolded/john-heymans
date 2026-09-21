"use client";

import Image from "next/image";
import { photo, type PhotoSlug } from "@/lib/photos";
import { gsap } from "@/lib/story/gsap";
import { credits } from "@/lib/story/credits";
import { useLoadGate } from "@/lib/story/media";
import type { BeatId } from "@/lib/story/beats";

/**
 * A full-bleed photograph on the stage. It mounts when the load queue says
 * its beat is near, keeps separate focus points for desktop and phones, and
 * carries its photographer's credit for the frame.
 */
export function PhotoLayer({
  slug,
  beat,
  focus = "50% 50%",
  focusMobile,
  className,
  children,
}: {
  slug: PhotoSlug;
  beat: BeatId;
  focus?: string;
  focusMobile?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const gate = useLoadGate(beat);
  const p = photo(slug);
  return (
    <div
      className={`L L-media photo-layer ${className ?? ""}`}
      data-slug={slug}
      data-credit={p.credit}
      style={{ "--focus": focus, "--focus-m": focusMobile ?? focus } as React.CSSProperties}
    >
      <div className="pl-inner">
        {gate.load && <Image src={p.src} alt="" fill sizes="100vw" quality={75} fetchPriority={gate.priority} className="pl-img" />}
      </div>
      {children}
    </div>
  );
}

/**
 * Tells the frame which photographers are on screen. A photo counts once it
 * is at a quarter of full opacity: the story dims some photos far below
 * 50 percent, and every photo that appears must carry its credit.
 */
export function reportCredits(root: HTMLElement, active: boolean) {
  root.querySelectorAll<HTMLElement>(".photo-layer").forEach((el) => {
    const id = `${el.dataset.slug}@${el.closest("[data-beat]")?.getAttribute("data-beat")}`;
    const o = active ? Number(gsap.getProperty(el, "opacity")) : 0;
    credits.report(id, el.dataset.credit ?? "", o >= 0.25 ? Math.max(o, 0.51) : 0);
  });
}
