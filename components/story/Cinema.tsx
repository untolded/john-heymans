"use client";

import { useEffect } from "react";
import { useStoryPage } from "./StoryRoot";
import { Stage } from "./Stage";
import { Driver } from "./Driver";

/**
 * The cinema layout, loaded only when the mode allows it. It asks for the
 * cinema class once fonts are in, so every split and measurement happens on
 * final metrics, and hands back to the static layout when it unmounts.
 */
export default function Cinema({ touch }: { touch: boolean }) {
  const { ready, setReady } = useStoryPage();

  useEffect(() => {
    let alive = true;
    void document.fonts.ready.then(() => requestAnimationFrame(() => alive && setReady(true)));
    return () => {
      alive = false;
      setReady(false);
    };
  }, [setReady]);

  return (
    <>
      <Stage touch={touch} />
      <Driver touch={touch} ready={ready} />
    </>
  );
}
