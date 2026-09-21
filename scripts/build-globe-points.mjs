// Land as dots for the flight globe. Samples an even grid (about 1.2 degrees
// apart on the sphere) and keeps the points that fall on land in
// world-atlas land-110m (Natural Earth, public domain). Run once:
//   node scripts/build-globe-points.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const STEP = 1.2;
const topo = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const land = feature(topo, topo.objects.land);

const out = [];
for (let lat = -90 + STEP / 2; lat < 90; lat += STEP) {
  const lonStep = STEP / Math.max(0.15, Math.cos((lat * Math.PI) / 180));
  // Offset alternate rows so the dots sit on a staggered, less mechanical grid.
  const offset = (Math.round((lat + 90) / STEP) % 2) * (lonStep / 2);
  for (let lon = -180 + offset; lon < 180; lon += lonStep) {
    if (geoContains(land, [lon, lat])) out.push(Math.round(lon * 10) / 10, Math.round(lat * 10) / 10);
  }
}

mkdirSync("public/story/data", { recursive: true });
writeFileSync("public/story/data/land-points.json", JSON.stringify(out));
console.log(`${out.length / 2} land points written to public/story/data/land-points.json`);
