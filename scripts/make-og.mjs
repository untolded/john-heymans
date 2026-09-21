// The image for sharing on LinkedIn and elsewhere (asset X3): the hero's
// poster frame with the hero line, 1200 x 630, rendered by the page itself so
// the type is exactly the site's. Re-run when the film's poster arrives.
//
//   npm i -D playwright-core        (once; uses the installed Google Chrome)
//   npm run dev -- -p 3111          (in another terminal)
//   node scripts/make-og.mjs [http://localhost:3111/story]
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3111/story";
const browser = await chromium.launch({ channel: "chrome" });
const page = await (await browser.newContext({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce", deviceScaleFactor: 1 })).newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.addStyleTag({
  content: `
    .hero-sub, .hero-film, .hero-cue, .hero-pause, .hero-credit, .frame-actions, .skip-link, nextjs-portal { display: none !important; }
    .hero { height: 630px !important; min-height: 0 !important; }
    .hero-copy { left: 56px !important; bottom: 52px !important; width: 760px !important; }
    .hero-line { font-size: 76px !important; }
    .frame-top { padding: 40px 56px 0 !important; }
    .wordmark { font-size: 22px !important; }
  `,
});
await page.waitForTimeout(800);
await page.screenshot({ path: "public/story/og.jpg", type: "jpeg", quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("public/story/og.jpg written");
