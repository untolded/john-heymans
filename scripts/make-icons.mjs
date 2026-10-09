// The favicon, the home-screen icon (web clip) and the manifest icons, all from one photograph.
//
//   node scripts/make-icons.mjs
//
// John at the Paris 2024 5000m final, hands on his head, "Hey mom" and "Made it" written on his
// arms (public/photos/final-arms.jpg, Belga, cleared for commercial use), as one round portrait:
// from his hands down to the HEYMANS bib, both arms in frame, the purple track around him. The
// crop was chosen by Maarten (9 October 2026) after face-only and symbol options.
//   - tab sizes (16, 32, 48): the circle alone, transparent around it.
//   - home screen and manifest (180, 192, 512): the circle on the night ground, since iOS fills
//     transparency with black anyway.
//   - maskable: the circle at 80 percent, inside the safe zone a system may cut to.
//
// Writes app/icon.png (32), app/favicon.ico (16, 32, 48, PNG-in-ICO), app/apple-icon.png (180)
// and public/icons/icon-{192,512}.png plus icon-maskable-512.png.
import fs from "node:fs";
import sharp from "sharp";

const SRC = "public/photos/final-arms.jpg"; // 2400 x 1569
const CIRCLE = { left: 390, top: 0, width: 1500, height: 1500 };
const NIGHT = { r: 7, g: 6, b: 19, alpha: 1 };

/** The round portrait at `size` px across, transparent outside the circle. */
async function disc(size) {
  let img = sharp(SRC).extract(CIRCLE).resize(size, size, { kernel: "lanczos3" }).modulate({ saturation: 1.08 });
  if (size <= 48) img = img.sharpen({ sigma: 0.6 });
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);
  return sharp(await img.png().toBuffer()).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

/** The icon at `size`: the disc filling `fill` of it, on transparency or on the night ground. */
async function png(size, { fill = 1, ground = false } = {}) {
  const d = Math.round(size * fill);
  let buf = await disc(d);
  if (fill < 1 || ground) {
    const off = Math.round((size - d) / 2);
    buf = await sharp({ create: { width: size, height: size, channels: 4, background: ground ? NIGHT : { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: buf, left: off, top: off }])
      .png()
      .toBuffer();
  }
  // Large sizes as a 256-colour palette: a photo at 512 px would otherwise weigh half a megabyte.
  return sharp(buf).png(size > 48 ? { palette: true, quality: 92, effort: 10, dither: 0.6 } : { compressionLevel: 9 }).toBuffer();
}

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

if (fs.existsSync("app/icon.svg")) fs.rmSync("app/icon.svg");
fs.writeFileSync("app/icon.png", await png(32));
const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })));
fs.writeFileSync("app/favicon.ico", ico(small));
fs.writeFileSync("app/apple-icon.png", await png(180, { fill: 0.92, ground: true }));
fs.mkdirSync("public/icons", { recursive: true });
fs.writeFileSync("public/icons/icon-192.png", await png(192, { fill: 0.92, ground: true }));
fs.writeFileSync("public/icons/icon-512.png", await png(512, { fill: 0.92, ground: true }));
fs.writeFileSync("public/icons/icon-maskable-512.png", await png(512, { fill: 0.8, ground: true }));
console.log("icons written");
