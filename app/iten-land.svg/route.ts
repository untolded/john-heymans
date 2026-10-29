import { itenGeometry } from "@/components/story/set-pieces/ItenMap";

/**
 * The land layer of the static story's flight map (ItenMapSvg): the dots
 * from the same projection, styled as .im-land was (paper at 40 percent,
 * round 3.2 strokes). A file of its own so it is cached and loaded lazily.
 * Rendered once at build time.
 */
export const dynamic = "force-static";

export function GET() {
  const { W, H, dots } = itenGeometry();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path d="${dots}" fill="none" stroke="#f3f1ea" stroke-opacity="0.4" stroke-width="3.2" stroke-linecap="round"/></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" } });
}
