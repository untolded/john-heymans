"use client";

import { useCallback, useState } from "react";

/** One place for the two hero actions every concept shares. */
export function useModals() {
  const [booking, setBooking] = useState(false);
  const [film, setFilm] = useState(false);
  const [prefill, setPrefill] = useState<{ date?: string; email?: string }>();
  const openBooking = useCallback((p?: { date?: string; email?: string }) => { setPrefill(p); setBooking(true); }, []);
  const closeBooking = useCallback(() => setBooking(false), []);
  const openFilm = useCallback(() => setFilm(true), []);
  const closeFilm = useCallback(() => setFilm(false), []);
  return { booking, film, prefill, openBooking, closeBooking, openFilm, closeFilm };
}
