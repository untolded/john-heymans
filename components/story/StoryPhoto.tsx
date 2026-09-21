import Image from "next/image";
import { content } from "@/lib/content";
import { photo, type PhotoSlug } from "@/lib/photos";
import { fill } from "@/lib/story/format";
import { creditFor } from "@/lib/story/photos";

type AltSlug = keyof typeof content.story.photoAlt;

/** Alt text for a story photo. Every photo the story uses has one in content. */
export const photoAlt = (slug: PhotoSlug) => content.story.photoAlt[slug as AltSlug] ?? "";

/** "Photo: Jelle Jansegers" */
export const photoCredit = (slug: PhotoSlug) => {
  const name = creditFor(slug);
  return name ? fill(content.story.credit, { name }) : "";
};

/**
 * A photograph with its credit, always. Children sit on top of the image in
 * the image's own coordinates (the handwriting trace uses this).
 */
export function StoryPhoto({
  slug,
  sizes,
  className,
  focus,
  children,
}: {
  slug: PhotoSlug;
  sizes: string;
  className?: string;
  focus?: string;
  children?: React.ReactNode;
}) {
  const p = photo(slug);
  return (
    <figure className={`sphoto ${className ?? ""}`} style={{ "--ar": `${p.width} / ${p.height}` } as React.CSSProperties}>
      <div className="sphoto-frame">
        <Image src={p.src} alt={photoAlt(slug)} fill sizes={sizes} style={focus ? { objectPosition: focus } : undefined} />
        {children}
      </div>
      {photoCredit(slug) && <figcaption className="sphoto-credit">{photoCredit(slug)}</figcaption>}
    </figure>
  );
}
