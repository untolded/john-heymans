"use client";

import { content } from "@/lib/content";
import type { FilmAssets } from "@/lib/story/assets";
import { track } from "@/lib/story/analytics";
import { Dialog } from "../Dialog";

const t = content.story.film;

/**
 * The film with sound, opened from the hero. A click opened it, so it may
 * start playing with sound. English captions are on by default when the
 * caption file exists. Until the real film arrives it plays the stand-in
 * and says so.
 */
export default function FilmModal({ onClose, film }: { onClose: () => void; film: FilmAssets }) {
  return (
    <Dialog title={t.title} onClose={onClose} closeLabel={t.close} size="wide">
      <div className="film-frame">
        <video
          src={film.film}
          poster={film.poster}
          controls
          autoPlay
          playsInline
          onPlay={(e) => {
            if (!e.currentTarget.muted && !film.filmIsStandIn) track("film_sound_on");
          }}
        >
          {film.captions && <track kind="captions" src={film.captions} srcLang="en" label={t.captions} default />}
        </video>
      </div>
      {film.filmIsStandIn && <p className="film-note">{t.standIn}</p>}
    </Dialog>
  );
}
