"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "./Modal";
import { content } from "@/lib/content";
import { photo, type PhotoSlug } from "@/lib/photos";

type Props = { open: boolean; onClose: () => void; poster: PhotoSlug };

/**
 * Film player. The 60-second film is still in edit, so until
 * /media/promo.mp4 exists the player falls back to the poster frame with
 * an honest note. Dropping the file in makes it play with no code change.
 */
export function FilmModal({ open, onClose, poster }: Props) {
  const [missing, setMissing] = useState(false);
  const p = photo(poster);
  return (
    <Modal open={open} onClose={onClose} title={content.film.title} size="wide" closeLabel={content.film.close}>
      <div className="film-frame">
        {missing ? (
          <>
            <Image src={p.src} alt="" fill sizes="(min-width: 992px) 60vw, 100vw" className="film-poster" />
            <p className="film-pending">{content.film.pending}</p>
          </>
        ) : (
          <video controls autoPlay playsInline poster={p.src} onError={() => setMissing(true)}>
            <source src="/media/promo.mp4" type="video/mp4" />
          </video>
        )}
        <span className="photo-credit film-credit">Poster frame {p.credit}</span>
      </div>
    </Modal>
  );
}
