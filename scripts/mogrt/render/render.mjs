// Renders the text motion styles to video, from the site's own reveals
// (lib/story/reveals.ts, bundled as is), one frame at a time at 25 fps.
//
//   npm i --no-save esbuild playwright-core
//
//   node scripts/mogrt/render/render.mjs overlays [list.json]
//     Every clip in the list (default: overlays.json next to this file), in
//     every format it names, as ProRes 4444 with transparency for Premiere.
//
//   node scripts/mogrt/render/render.mjs one words "Two years.|One algorithm." --format 9x16
//     One clip. Options: --format 16x9|9x16, --type display|sentence,
//     --role lesson (Ink as a lesson card), --size <percent>, --placement centre|bottom-left,
//     --background none|scrim|night|paper, --exit blur|rise|cut,
//     --hold <seconds>, --name <file name>. Flash also takes --sender,
//     --time and --initial; its text is the message.
//
//   node scripts/mogrt/render/render.mjs examples
//     The four example films in public/brand/mogrt/examples.
//
// Sizes, line heights, margins and the card come from build-mogrts.jsx, so
// the overlays and the .mogrt templates are the same design.
// Needs Google Chrome and Homebrew ffmpeg.
import { build } from "esbuild";
import { chromium } from "playwright-core";
import { readFile, mkdir, mkdtemp, rm, cp } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { tmpdir } from "node:os";
import vm from "node:vm";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const repo = path.resolve(here, "../../..");
const FFMPEG = "/opt/homebrew/bin/ffmpeg";

const ctx = vm.createContext({});
vm.runInContext(await readFile(path.join(here, "../build-mogrts.jsx"), "utf8"), ctx);
const JH = ctx.JH;
const FPS = JH.FPS;
const FORMATS = Object.fromEntries(JH.FORMATS.map((f) => [f.id, f]));
const EXIT_LENGTH = { blur: 0.3, rise: 0.25, cut: 0 };

// The site's lesson cards (app/story.css .k-lesson: 5.88rem, 2.8rem on a
// phone), which the overlays add to Ink as `"role": "lesson"`, and the
// measures each role wraps at. 9:16 is the phone layout, as in build-mogrts.jsx.
// Lessons take the record measure: the site's 13ch fits the column beside the
// chart, and strands words in a centred frame.
const LESSON = { size: { "16x9": 125, "9x16": 124 }, lh: 0.93 };
const MEASURE = { title: 20, record: 24, lesson: 24, sentence: { "16x9": 30, "9x16": 22 } };

/** A clip as the list describes it, turned into what the harness needs. */
function toSpec(clip, formatId) {
  const fmt = FORMATS[formatId];
  if (!fmt) throw new Error(`unknown format "${formatId}"`);
  const style = JH.STYLES[clip.style];
  if (!style) throw new Error(`unknown style "${clip.style}"`);
  const k = (clip.size ?? 100) / 100;
  const face = clip.type ?? "display";
  const spec = {
    kind: clip.style,
    // A line can be broken differently for a format: "text_9x16" wins over "text" in 9:16.
    text: clip[`text_${formatId}`] ?? clip.text,
    width: fmt.w,
    height: fmt.h,
    margin: fmt.margin,
    placement: clip.placement ?? "centre",
    background: clip.background ?? "none",
    exit: clip.exit ?? (clip.style === "flash" ? "rise" : "blur"),
    hold: clip.hold ?? 2,
    // Flash starts half a frame late, so its one frame of paper border lands on a frame at 25 fps.
    start: (clip.start ?? 0) + (clip.style === "flash" ? 0.5 / FPS : 0),
    tail: clip.tail ?? 0,
    k,
  };
  if (clip.style === "flash") {
    Object.assign(spec, { sender: clip.sender ?? "", time: clip.time ?? "now", initial: clip.initial ?? (clip.sender ?? "").trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? "" });
    spec.card = Object.fromEntries(Object.entries(JH.CARDS[formatId]).map(([key, v]) => [key, v * k]));
  } else if (face === "sentence") {
    Object.assign(spec, { face, size: style.sentence[formatId] * k, lh: 1.2, measure: MEASURE.sentence[formatId] });
  } else if (clip.role === "lesson") {
    Object.assign(spec, { face, size: LESSON.size[formatId] * k, lh: LESSON.lh, measure: MEASURE.lesson });
  } else {
    Object.assign(spec, { face, size: style.display[formatId] * k, lh: style.lh, measure: clip.style === "ink" ? MEASURE.record : MEASURE.title });
  }
  return spec;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 6).join("-");

async function open() {
  const bundle = await build({
    stdin: {
      contents: 'import * as R from "./lib/story/reveals"; import { gsap } from "./lib/story/gsap"; window.R = R; window.gsap = gsap;',
      resolveDir: repo,
      loader: "ts",
    },
    bundle: true,
    format: "iife",
    write: false,
    logLevel: "error",
    alias: { "@": repo },
    define: { "process.env.NODE_ENV": '"production"' },
  });
  const js = bundle.outputFiles[0].text;
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1920 }, deviceScaleFactor: 1 });
  await page.route("http://harness.local/**", async (route) => {
    const rel = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
    if (rel === "bundle.js") return route.fulfill({ body: js, contentType: "text/javascript" });
    if (rel.startsWith("fonts/")) return route.fulfill({ body: await readFile(path.join(repo, "public/brand", rel)), contentType: "font/ttf" });
    return route.fulfill({ body: await readFile(path.join(here, rel)), contentType: "text/html" });
  });
  page.on("pageerror", (e) => console.error("page:", e.message));
  await page.goto("http://harness.local/harness.html");
  return { browser, page };
}

/** Renders one clip to numbered PNGs with transparency; returns the folder. */
async function frames(page, spec) {
  await page.setViewportSize({ width: spec.width, height: spec.height });
  await page.evaluate((s) => window.setup(s), spec);
  const reveal = await page.evaluate(() => window.revealLength());
  spec.exitAt = spec.start + reveal + spec.hold;
  const length = spec.exitAt + EXIT_LENGTH[spec.exit] + spec.tail;
  await page.evaluate((s) => window.setup(s), spec);
  const dir = await mkdtemp(path.join(tmpdir(), "jh-frames-"));
  const count = Math.ceil(length * FPS) + 1;
  for (let f = 0; f < count; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    await page.screenshot({ path: path.join(dir, `f${String(f).padStart(4, "0")}.png`), omitBackground: true });
  }
  return { dir, count };
}

function encode(dir, file, kind) {
  const input = ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(dir, "f%04d.png")];
  const codec =
    kind === "prores"
      ? ["-c:v", "prores_ks", "-profile:v", "4444", "-qscale:v", "9", "-pix_fmt", "yuva444p10le", "-alpha_bits", "8", "-vendor", "apl0"]
      : ["-c:v", "libx264", "-crf", "20", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  execFileSync(FFMPEG, [...input, ...codec, file]);
}

/** The scrim on its own, as a still to put under type over footage. */
async function scrim(page, formatId, file) {
  const fmt = FORMATS[formatId];
  await page.setViewportSize({ width: fmt.w, height: fmt.h });
  await page.evaluate((s) => window.setup(s), { kind: "none", width: fmt.w, height: fmt.h, margin: fmt.margin, placement: "centre", background: "scrim", start: 0 });
  await page.screenshot({ path: file, omitBackground: true });
}

const mode = process.argv[2];
const { browser, page } = await open();
try {
  if (mode === "examples") {
    const out = path.join(repo, "public/brand/mogrt/examples");
    await mkdir(out, { recursive: true });
    const clips = [
      { style: "rise", text: "The day after my graduation,|I booked a plane|ticket to Kenya." },
      { style: "words", text: "Two years.|One algorithm." },
      { style: "ink", text: "My team and my peers|called me crazy." },
      { style: "flash", sender: "My federation", text: "Run fast times in the big outdoor meets. That's the route.", exit: "rise" },
    ];
    for (const clip of clips) {
      const spec = toSpec({ ...clip, background: "night", start: 0.4, hold: 2, tail: 0.4 }, "16x9");
      const { dir, count } = await frames(page, spec);
      encode(dir, path.join(out, `${clip.style}.mp4`), "h264");
      await rm(dir, { recursive: true, force: true });
      console.log(`${clip.style}.mp4, ${count} frames`);
    }
  } else if (mode === "overlays" || mode === "one") {
    let list;
    if (mode === "overlays") {
      const file = process.argv[3] ? path.resolve(process.argv[3]) : path.join(here, "overlays.json");
      list = JSON.parse(await readFile(file, "utf8"));
    } else {
      const { values, positionals } = parseArgs({
        args: process.argv.slice(3),
        allowPositionals: true,
        options: Object.fromEntries(["format", "type", "role", "size", "placement", "background", "exit", "hold", "name", "sender", "time", "initial", "out"].map((o) => [o, { type: "string" }])),
      });
      const [style, text] = positionals;
      if (!style || text == null) throw new Error('usage: render.mjs one <rise|words|ink|flash> "<text>" [options]');
      const clip = { style, text, ...values };
      if (clip.size) clip.size = Number(clip.size);
      if (clip.hold) clip.hold = Number(clip.hold);
      list = { out: values.out, formats: [values.format ?? "16x9"], clips: [clip] };
    }
    const out = path.resolve(repo, list.out ?? "media/premiere-overlays");
    await mkdir(out, { recursive: true });
    for (const formatId of list.formats) {
      const file = path.join(out, `scrim-${formatId}.png`);
      await scrim(page, formatId, file);
    }
    for (const clip of list.clips) {
      for (const formatId of clip.formats ?? list.formats) {
        const spec = toSpec(clip, formatId);
        const name = `${clip.name ?? `${clip.style}-${slug(clip.text)}`}-${formatId}.mov`;
        const { dir, count } = await frames(page, spec);
        encode(dir, path.join(out, name), "prores");
        await rm(dir, { recursive: true, force: true });
        console.log(`${name}, ${(count / FPS).toFixed(2)}s`);
      }
    }
    // The folder travels on its own, so it carries its instructions and the example films.
    await cp(path.join(repo, "public/brand/mogrt/README.md"), path.join(out, "README.md"));
    await cp(path.join(repo, "public/brand/mogrt/examples"), path.join(out, "examples"), { recursive: true });
    console.log(`in ${path.relative(repo, out) || out}`);
  } else {
    throw new Error("usage: render.mjs overlays [list.json] | one <style> \"<text>\" [options] | examples");
  }
} finally {
  await browser.close();
}
