import Image from "next/image";
import { photo, type PhotoSlug } from "@/lib/photos";

type Props = {
  slug: PhotoSlug;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Where the credit sits. "hidden" means the credit is rendered elsewhere. */
  credit?: "corner" | "below" | "hidden";
  style?: React.CSSProperties;
};

/**
 * Every photograph on the site goes through this so the photographer credit
 * is never dropped. The image fills .photo-frame; with credit="corner" the
 * frame fills the figure (which carries the aspect ratio), with
 * credit="below" the frame carries the aspect ratio and the caption follows.
 */
export function Photo({ slug, alt, sizes, priority, className, imgClassName, credit = "corner", style }: Props) {
  const p = photo(slug);
  return (
    <figure className={`photo ${className ?? ""}`} style={style} data-credit-pos={credit}>
      <div className="photo-frame">
        <Image src={p.src} alt={alt} fill sizes={sizes} priority={priority} className={imgClassName} />
      </div>
      {credit !== "hidden" && (
        <figcaption className="photo-credit">
          <span>{p.caption}</span>
          <span>Photo {p.credit}</span>
        </figcaption>
      )}
    </figure>
  );
}
