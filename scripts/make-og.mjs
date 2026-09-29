// The image for sharing on LinkedIn, WhatsApp, Slack and elsewhere: the photo from the Olympic
// final with "Hey mom" and "Made it" on his arms, 1200 x 630, with the wordmark, one line and
// the photo credit, set in the brand's own fonts.
//
//   npm i --no-save playwright-core     (once; it drives the installed Google Chrome)
//   node scripts/make-og.mjs
//
// John stands in the middle of the frame, so apps that crop the preview square still keep him.
import { chromium } from "playwright-core";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const url = (p) => pathToFileURL(path.join(root, p)).href;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: "BSD"; src: url("${url("public/brand/fonts/BigShouldersDisplay-Bold.ttf")}"); }
  @font-face { font-family: "IS"; src: url("${url("public/brand/fonts/InstrumentSans[wdth,wght].ttf")}"); font-weight: 400 700; }
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #070613; }
  .og { position: relative; width: 1200px; height: 630px; background: url("${url("public/photos/final-arms.jpg")}") 50% 0 / 1200px auto no-repeat; }
  .og::before { content: ""; position: absolute; inset: 0;
    background: linear-gradient(to top, rgb(7 6 19 / 0.82) 0%, rgb(7 6 19 / 0.35) 30%, rgb(7 6 19 / 0) 55%),
                radial-gradient(80% 90% at 0% 100%, rgb(7 6 19 / 0.55) 0%, rgb(7 6 19 / 0) 60%); }
  .copy { position: absolute; left: 56px; bottom: 50px; color: #f3f1ea; }
  .mark { font: 700 60px/0.9 "BSD"; letter-spacing: -0.006em; text-transform: uppercase; }
  .line { margin-top: 14px; font: 600 25px/1.25 "IS"; font-variation-settings: "wdth" 96; letter-spacing: -0.01em; }
  .bar { width: 120px; height: 4px; margin-top: 18px; border-radius: 2px; background: linear-gradient(90deg, #ff7a2f, #ee9aa6, #b9a8f5); }
  .credit { position: absolute; right: 28px; bottom: 22px; font: 500 14px/1 "IS"; color: rgb(243 241 234 / 0.72); }
</style></head><body><div class="og">
  <div class="copy"><div class="mark">John Heymans</div><div class="line">Olympic 5000m finalist.<br>Keynote speaker.</div><div class="bar"></div></div>
  <div class="credit">Photo: Belga Image</div>
</div></body></html>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
// Opened as a file, not set as content: a blank page may not load file:// fonts and images.
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "og-")), "og.html");
fs.writeFileSync(tmp, html);
await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/story/og.jpg", type: "jpeg", quality: 88 });
await browser.close();
console.log("public/story/og.jpg written");
