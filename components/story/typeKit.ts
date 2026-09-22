/**
 * A type kit: the typefaces the page is set in, loaded as the three CSS
 * variables app/story.css reads (--font-display, --font-text, --font-mono).
 *
 * Everything else about the setting, the weights, the variable axes, the
 * case and the display scale, lives in app/type/kits.css against the kit's
 * id. The live kit is components/story/fonts.ts; the three under review are
 * in this folder, one module each, so a kit's fonts only load on its own
 * route.
 */
export type TypeKit = {
  /** Sets .story-root[data-type]. The kit's CSS block hangs off it. */
  id: string;
  /** What we call it in the review. */
  name: string;
  /** The next/font variable classes. */
  className: string;
  /** The typefaces, named, for the specimen page. */
  faces: { display: string; text: string; mono: string };
  /** Why this face for this story, in one line. */
  claim: string;
  /** What to look at. */
  notes: string[];
};
