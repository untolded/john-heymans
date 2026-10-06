// The favicon, the home-screen icon (web clip) and the manifest icons, all from one photograph.
//
//   node scripts/make-icons.mjs
//
// John at the Paris 2024 5000m final, hands on his head, "Hey mom" and "Made it" written on his
// arms (public/photos/final-arms.jpg, Belga, cleared for commercial use). Two crops, chosen by
// looking at them at 16, 32 and 180 px:
//   - tab sizes (16, 32, 48): his face alone. At 32 px the arm writing is a grey smudge, the face
//     still reads as a person laughing in disbelief.
//   - home screen and manifest (180, 192, 512): face plus the "MADE IT" arm, legible from 180 up.
//   - maskable: the system may cut it to a circle, so the face sits in the central safe zone.
//
// Writes app/icon.png (32), app/favicon.ico (16, 32, 48, PNG-in-ICO), app/apple-icon.png (180,
// full bleed, iOS rounds it itself) and public/icons/icon-{192,512}.png plus icon-maskable-512.png.
import fs from "node:fs";
import sharp from "sharp";

const SRC = "public/photos/final-arms.jpg"; // 2400 x 1569
const FACE = { left: 980, top: 140, width: 400, height: 400 };
const MADE_IT = { left: 940, top: 40, width: 660, height: 660 };
const MASKABLE = { left: 860, top: 0, width: 820, height: 820 };

/** A square crop at `size`, sharpened a touch more the smaller it gets. Tab icons get softly rounded corners. */
async function png(crop, size, { round = false } = {}) {
  let img = sharp(SRC).extract(crop).resize(size, size, { kernel: "lanczos3" }).modulate({ saturation: 1.08 });
  if (size <= 48) img = img.sharpen({ sigma: 0.6 });
  let buf = await img.png().toBuffer();
  if (round) {
    const r = Math.round(size * 0.22);
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#fff"/></svg>`);
    buf = await sharp(buf).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
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
fs.writeFileSync("app/icon.png", await png(FACE, 32, { round: true }));
const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(FACE, size, { round: true }) })));
fs.writeFileSync("app/favicon.ico", ico(small));
fs.writeFileSync("app/apple-icon.png", await png(MADE_IT, 180));
fs.mkdirSync("public/icons", { recursive: true });
fs.writeFileSync("public/icons/icon-192.png", await png(MADE_IT, 192));
fs.writeFileSync("public/icons/icon-512.png", await png(MADE_IT, 512));
fs.writeFileSync("public/icons/icon-maskable-512.png", await png(MASKABLE, 512));
console.log("icons written");
