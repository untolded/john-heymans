// A 256px tile of film grain for the story ground. Neutral grey noise,
// blended over the ground, so it reads the same over night violet and amber.
//   node scripts/make-grain.mjs
import sharp from "sharp";

const size = 256;
// Eight grey levels are plenty at 3 to 4 percent opacity, and keep the tile small.
const px = Buffer.alloc(size * size);
let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < size * size; i++) px[i] = Math.round(rnd() * 7) * 36;
await sharp(px, { raw: { width: size, height: size, channels: 1 } }).png({ compressionLevel: 9, palette: true, colours: 8 }).toFile("public/story/grain.png");
console.log("public/story/grain.png written");
