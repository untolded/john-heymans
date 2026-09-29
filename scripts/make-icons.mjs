// The favicon, the home-screen icon (web clip) and the manifest icons, all from one SVG.
//
//   node scripts/make-icons.mjs
//
// "JH" in Big Shoulders Display Bold, the wordmark's face, in paper on a night tile, over a short
// finish line in the AI gradient. The initials exist for the browser tab and the home screen only:
// the brand guide has no monogram, and the wordmark stays the only mark everywhere else. The
// glyph outlines are baked in below (read with fontTools from public/brand/fonts), so the icon
// never waits on a web font. The tile is dark, so it reads on light browser chrome; on dark
// chrome the SVG adds a faint light edge.
//
// Writes app/icon.svg, app/favicon.ico (16, 32, 48), app/apple-icon.png (180, full bleed, as
// iOS rounds it itself) and public/icons/icon-{192,512}.png plus icon-maskable-512.png.
import fs from "node:fs";
import sharp from "sharp";

// Font units, 2000 per em, cap height 1600, y up.
const J = "M397 -18Q267 -18 190.5 18.5Q114 55 79.5 134.0Q45 213 42 342Q41 401 41.0 467.5Q41 534 42 594H277Q276 552 275.5 498.5Q275 445 275.5 392.0Q276 339 277 297Q279 242 307.5 214.5Q336 187 397 187Q458 187 484.5 214.5Q511 242 511 297V1600H761V342Q761 149 679.5 65.5Q598 -18 397 -18Z";
const H = "M88 0V1600H337V922H561V1600H811V0H561V701H337V0Z";
const J_ADVANCE = 831;
const LEFT = 41; // J's left edge
const RIGHT = J_ADVANCE + 811; // H's right edge

/**
 * The icon in a 64-unit square. `bleed` fills the square edge to edge (for iOS and maskable
 * icons, which are cropped by the system); `scale` shrinks the letters into a safe zone.
 */
function svg({ bleed = false, scale = 1 } = {}) {
  const cap = 34 * scale;
  const s = cap / 1600;
  const width = (RIGHT - LEFT) * s;
  const bar = 4 * scale;
  const gap = 5 * scale;
  const x0 = (64 - width) / 2;
  const top = (64 - (cap + gap + bar)) / 2 - 0.5 * scale;
  const base = top + cap;
  const tx = x0 - LEFT * s;
  const glyph = (d, dx) => `<path d="${d}" transform="translate(${(tx + dx * s).toFixed(3)} ${base.toFixed(3)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})"/>`;
  const tile = bleed ? `<rect width="64" height="64" fill="url(#night)"/>` : `<rect class="tile" x="0.5" y="0.5" width="63" height="63" rx="14" fill="url(#night)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <style>@media (prefers-color-scheme: dark) { .tile { stroke: rgb(243 241 234 / 0.22); stroke-width: 1; } }</style>
  <defs>
    <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1548"/><stop offset="1" stop-color="#070613"/></linearGradient>
    <linearGradient id="ai" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff7a2f"/><stop offset="0.5" stop-color="#ee9aa6"/><stop offset="1" stop-color="#b9a8f5"/></linearGradient>
  </defs>
  ${tile}
  <g fill="#f3f1ea">${glyph(J, 0)}${glyph(H, J_ADVANCE)}</g>
  <rect x="${x0.toFixed(3)}" y="${(base + gap).toFixed(3)}" width="${width.toFixed(3)}" height="${bar.toFixed(3)}" rx="${(bar / 2).toFixed(3)}" fill="url(#ai)"/>
</svg>
`;
}

const png = (markup, size) => sharp(Buffer.from(markup), { density: Math.max(72, (72 * size) / 64) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** An .ico holding PNG images, which every current browser reads. */
function ico(images) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, e);
    head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((im) => im.data)]);
}

const tab = svg();
fs.writeFileSync("app/icon.svg", tab);
const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tab, size) })));
fs.writeFileSync("app/favicon.ico", ico(small));
fs.writeFileSync("app/apple-icon.png", await png(svg({ bleed: true, scale: 0.78 }), 180));
fs.mkdirSync("public/icons", { recursive: true });
fs.writeFileSync("public/icons/icon-192.png", await png(tab, 192));
fs.writeFileSync("public/icons/icon-512.png", await png(tab, 512));
// Maskable: the system may crop to a circle, so everything sits inside the central 80 percent.
fs.writeFileSync("public/icons/icon-maskable-512.png", await png(svg({ bleed: true, scale: 0.7 }), 512));
console.log("icons written");
