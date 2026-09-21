// Turns a continuous clip into an AVIF frame sequence for a scroll-driven
// beat (the Seasats technique). Frames land in
// public/story/frames/<id>/<desktop|mobile>/frame_0001.avif with a manifest.
//
//   node scripts/export-frames.mjs <id> <source> <desktop|mobile> [credit]
//
// Desktop: 24 fps, 1920 wide. Mobile: 20 fps, 1080 wide portrait crop.
// At most 240 frames. Budgets: desktop under 8 MB, mobile under 4 MB.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const [id, src, target = "desktop", credit = ""] = process.argv.slice(2);
if (!id || !src) {
  console.error("usage: node scripts/export-frames.mjs <id> <source> <desktop|mobile> [credit]");
  process.exit(1);
}
const mobile = target === "mobile";
const fps = mobile ? 20 : 24;
const width = mobile ? 1080 : 1920;
const MAX = 240;
const ffmpeg = "/opt/homebrew/bin/ffmpeg";

const tmp = path.join(tmpdir(), `frames-${id}-${target}`);
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const vf = mobile ? `fps=${fps},scale=${width}:1920:force_original_aspect_ratio=increase,crop=${width}:1920` : `fps=${fps},scale=${width}:-2`;
execFileSync(ffmpeg, ["-y", "-v", "error", "-i", src, "-vf", vf, "-frames:v", String(MAX), path.join(tmp, "frame_%04d.png")]);

const out = path.join("public/story/frames", id, target);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const files = readdirSync(tmp).filter((f) => f.endsWith(".png")).sort();
let bytes = 0;
let meta = { width: 0, height: 0 };
for (const f of files) {
  const dest = path.join(out, f.replace(".png", ".avif"));
  const info = await sharp(path.join(tmp, f)).avif({ quality: 50, effort: 6 }).toFile(dest);
  meta = { width: info.width, height: info.height };
  bytes += statSync(dest).size;
}
writeFileSync(path.join(out, "manifest.json"), JSON.stringify({ count: files.length, fps, ...meta, credit }, null, 2));
rmSync(tmp, { recursive: true, force: true });
console.log(`${files.length} frames, ${(bytes / 1e6).toFixed(1)} MB, in ${out}`);
