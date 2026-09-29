// Runs every expression build-mogrts.jsx writes, outside After Effects, against
// a stand-in for the comp, and checks them against the site's timings and
// layout. It cannot see rendering (fonts, masks, effects); it catches syntax
// errors, wrong maths and timings that drift from lib/story/reveals.ts.
//
//   node scripts/mogrt/check-expressions.mjs
import { readFileSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const ctx = vm.createContext({});
vm.runInContext(readFileSync(path.join(here, "build-mogrts.jsx"), "utf8"), ctx);
const JH = ctx.JH;

let failures = 0;
let checks = 0;
const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;
function expect(ok, what) {
  checks++;
  if (!ok) {
    failures++;
    console.log("  FAIL", what);
  }
}

// Advance widths are not knowable here; a line is 0.42em per character, which is roughly Big Shoulders in capitals.
const EM_PER_CHAR = 0.42;

/** A stand-in for the comp around one layer. */
function env({ fmt, time, controls, master, layers = {}, rect, value = [0, 0, 0], textIndex = 1 }) {
  const style = () => {
    const st = {};
    const o = {
      setFont: (f) => ((st.font = f), o),
      setFontSize: (s) => ((st.size = s), o),
      setTracking: (t) => ((st.tracking = t), o),
      setText: (t) => ({ ...st, text: t }),
    };
    return o;
  };
  const effect = (name) => {
    if (!(name in controls)) throw new Error(`no control "${name}"`);
    return () => ({ value: controls[name] });
  };
  const thisComp = {
    width: fmt.w,
    height: fmt.h,
    duration: JH.DURATION,
    frameDuration: 1 / JH.FPS,
    layer(name) {
      if (name === "Controls") return { effect };
      if (name === "Text") return { text: { sourceText: { value: master } } };
      if (layers[name]) return layers[name];
      throw new Error(`no layer "${name}"`);
    },
  };
  return {
    Math,
    time,
    thisComp,
    value,
    textIndex,
    text: { sourceText: { style: style() } },
    sourceRectAtTime: () => rect ?? { left: 0, top: -100, width: 0, height: 100 },
    createPath: (points) => ({ points }),
  };
}

const run = (src, e) => vm.runInNewContext(src, e);
const DEFAULTS = { Type: 1, Size: 50, Placement: 1, Background: 3, Exit: 1 };

/** Everything one line layer computes at one moment. */
function line(style, fmt, i, t, controls, master) {
  const base = { fmt, time: t, controls, master };
  const txt = run(JH.expr.lineText(style, fmt, i), env(base));
  const width = txt.text.length * EM_PER_CHAR * txt.size;
  const rect = { left: 0, top: -0.8 * txt.size, width, height: 0.8 * txt.size };
  const e = env({ ...base, rect });
  const out = { txt, rect, pos: run(JH.expr.linePosition(style, fmt, i), e), opacity: run(JH.expr.exitOpacity(100), e), scale: run(JH.expr.exitScale(), e) };
  if (style === "rise") {
    out.offset = run(JH.expr.riseOffset(style, fmt, i), e);
    out.mask = run(JH.expr.riseMask(style, fmt, i), e);
  }
  if (style === "ink") {
    out.rampStart = run(JH.expr.inkRampStart(i), e);
    out.rampEnd = run(JH.expr.inkRampEnd(i), e);
    out.mask = run(JH.expr.inkMask(i), e);
    out.feather = run(JH.expr.inkFeather(), e);
    out.textColor = run(JH.expr.textColor(), e);
    out.nib = run(JH.expr.nibColor(), e);
  }
  return out;
}

const power3out = (p) => 1 - Math.pow(1 - p, 4);
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);

for (const fmt of JH.FORMATS) {
  for (const style of ["rise", "words", "ink"]) {
    const S = JH.STYLES[style];
    const master = S.text;
    const lines = master.split("\r");
    const n = lines.length;
    console.log(`${style} ${fmt.label}`);

    // Text: each line layer takes its own line, in capitals, in the display face at the brand size.
    for (let i = 0; i < JH.MAX_LINES; i++) {
      const l = line(style, fmt, i, 2, DEFAULTS, master);
      expect(l.txt.text === (lines[i] ?? "").toUpperCase(), `line ${i} text "${l.txt.text}"`);
      expect(l.txt.font === JH.FONTS.display && near(l.txt.size, S.display[fmt.id]), `line ${i} face ${l.txt.font} ${l.txt.size}`);
    }
    const sentence = line(style, fmt, 0, 2, { ...DEFAULTS, Type: 2 }, master);
    expect(sentence.txt.font === JH.FONTS.sentence && sentence.txt.text === lines[0], "sentence face keeps sentence case");
    expect(near(line(style, fmt, 0, 2, { ...DEFAULTS, Size: 100 }, master).txt.size, 2 * S.display[fmt.id]), "size 100 doubles");
    expect(near(line(style, fmt, 0, 2, { ...DEFAULTS, Size: 0 }, master).txt.size, 0.5 * S.display[fmt.id]), "size 0 halves");
    const bars = line(style, fmt, 1, 2, DEFAULTS, "Two years.|One algorithm.");
    expect(bars.txt.text === "ONE ALGORITHM.", "a vertical bar breaks the line, as in the site's copy");

    // Layout: centred puts the middle of the block on the middle of the frame, and each line's middle on the centre line.
    const size = S.display[fmt.id];
    const lead = size * S.lh;
    const pad = (lead - (0.9855 + 0.2145) * size) / 2;
    const first = line(style, fmt, 0, 2, DEFAULTS, master);
    const last = line(style, fmt, n - 1, 2, DEFAULTS, master);
    const blockTop = first.pos[1] - pad - 0.9855 * size;
    const blockBottom = last.pos[1] - pad - 0.9855 * size + lead;
    expect(near((blockTop + blockBottom) / 2, fmt.h / 2, 0.5), `block centred (${blockTop.toFixed(1)} to ${blockBottom.toFixed(1)})`);
    expect(near(first.pos[0] + first.rect.width / 2, fmt.w / 2, 0.5), "line centred horizontally");
    const left = line(style, fmt, n - 1, 2, { ...DEFAULTS, Placement: 2 }, master);
    expect(near(left.pos[1], fmt.h - fmt.margin, 0.5) && near(left.pos[0], fmt.margin), `bottom left: last baseline on the margin (${left.pos})`);

    // Exits: nothing moves until the last 0.3s (blur) or 0.25s (rise); everything is gone at the end.
    const D = JH.DURATION;
    const before = line(style, fmt, 0, D - 0.31, DEFAULTS, master);
    expect(before.opacity === 100 && before.scale[0] === 100 && near(before.pos[1], first.pos[1]), "no exit before the last 0.3s");
    const gone = line(style, fmt, 0, D, DEFAULTS, master);
    expect(near(gone.opacity, 0) && near(gone.scale[0], 90), `blur exit ends at 0 opacity and 90% (${gone.opacity}, ${gone.scale[0]})`);
    const mid = line(style, fmt, 0, D - 0.15, DEFAULTS, master);
    expect(near(mid.opacity, 100 * (1 - 0.125), 0.1), `blur exit is power2.in (${mid.opacity.toFixed(2)} at half way)`);
    const riseOut = line(style, fmt, 0, D, { ...DEFAULTS, Exit: 2 }, master);
    expect(near(riseOut.opacity, 0) && near(riseOut.pos[1], first.pos[1] - 8), "rise exit lifts 8px and fades");
    const cut = line(style, fmt, 0, D, { ...DEFAULTS, Exit: 3 }, master);
    expect(cut.opacity === 100, "cut holds to the end of the clip");

    if (style === "rise") {
      // Each line starts one line box plus 0.06em low, fully behind its mask, and lands at 0.6s + 0.07s per line.
      for (let i = 0; i < n; i++) {
        const start = line(style, fmt, i, i * 0.07, DEFAULTS, master);
        const off = lead + 0.06 * size;
        expect(near(start.offset[1], off), `line ${i} starts ${off.toFixed(1)}px low (${start.offset[1].toFixed(1)})`);
        const maskBottom = start.mask.points[2][1];
        const capTop = -0.8 * size + start.offset[1];
        expect(capTop >= maskBottom - 0.01, `line ${i} starts hidden: cap top ${capTop.toFixed(1)} vs mask bottom ${maskBottom.toFixed(1)}`);
        const landed = line(style, fmt, i, i * 0.07 + 0.6, DEFAULTS, master);
        expect(near(landed.offset[1], 0), `line ${i} has landed by ${(i * 0.07 + 0.6).toFixed(2)}s`);
        const q = line(style, fmt, i, i * 0.07 + 0.3, DEFAULTS, master);
        expect(near(q.offset[1], off * (1 - power3out(0.5)), 0.01), `line ${i} eases power3.out`);
        expect(landed.mask.points[2][1] >= size, `line ${i} mask opens once it has landed`);
      }
    }

    if (style === "words") {
      // Word w, counted across lines, arrives 0.11s after the one before over 0.55s.
      let w = 0;
      for (let i = 0; i < n; i++) {
        const words = lines[i].split(/\s+/).filter(Boolean);
        for (let k = 1; k <= words.length; k++, w++) {
          const at = (t) => run(JH.expr.wordsAmount(style, fmt, i), env({ fmt, time: t, controls: DEFAULTS, master, textIndex: k }));
          expect(near(at(w * 0.11), 100), `word ${w} still waiting at ${(w * 0.11).toFixed(2)}s`);
          expect(near(at(w * 0.11 + 0.275), 100 * (1 - power3out(0.5)), 0.01), `word ${w} half way`);
          expect(near(at(w * 0.11 + 0.55), 0), `word ${w} landed at ${(w * 0.11 + 0.55).toFixed(2)}s`);
        }
      }
      const lastLanded = (w - 1) * 0.11 + 0.55;
      expect(lastLanded <= S.intro, `the reveal (${lastLanded.toFixed(2)}s) fits the protected intro (${S.intro}s)`);
    }

    if (style === "ink") {
      for (let i = 0; i < n; i++) {
        const start = line(style, fmt, i, i * 0.1, DEFAULTS, master);
        const W = start.rect.width;
        const F = start.feather[0];
        const edge = start.mask.points[1][0];
        expect(edge + F / 2 <= start.rect.left + 0.01, `line ${i} starts unwritten`);
        const done = line(style, fmt, i, i * 0.1 + 1.1, DEFAULTS, master);
        expect(done.mask.points[1][0] - F / 2 >= done.rect.left + W - 0.01, `line ${i} fully opaque at the end`);
        expect(done.rampStart[0] >= done.rect.left + W - 0.01, `line ${i} all text colour at the end (no amber left)`);
        const half = line(style, fmt, i, i * 0.1 + 0.55, DEFAULTS, master);
        const clearEdge = half.mask.points[1][0] + F / 2;
        expect(near(clearEdge, 1.75 * W * 0.5, 0.5), `line ${i} clear edge half way at 0.875W`);
        expect(near(clearEdge - half.rampEnd[0], 0.35 * W, 0.5) && near(clearEdge - half.rampStart[0], 0.7 * W, 0.5), `line ${i} nib 0.35W and solid 0.7W behind the edge`);
      }
      const onPaper = line(style, fmt, 0, 2, { ...DEFAULTS, Background: 4 }, master);
      expect(onPaper.textColor.join() === JH.col(JH.HEX.ink).slice(1, -1).split(", ").map(Number).join() && onPaper.nib[0] < 0.7, "on paper: ink text, amber deep nib");
    }
  }

  // Flash: the notification card.
  console.log(`flash ${fmt.label}`);
  const k = JH.CARDS[fmt.id];
  const textLayer = (w, value) => ({ sourceRectAtTime: () => ({ left: 0, top: -20, width: w, height: 20 }), text: { sourceText: { value } } });
  const layers = { Sender: textLayer(180, "My federation"), Message: textLayer(560, "That is not how qualification works."), Time: textLayer(30, "now") };
  const fenv = (t, extra = {}) => env({ fmt, time: t, controls: { ...DEFAULTS, Background: 1, Exit: 2, ...extra }, master: "", layers });
  const cw = run(JH.expr.cardWidth(fmt), fenv(0));
  const ch = run(JH.expr.cardHeight(fmt), fenv(0));
  expect(cw === k.minW, `short message keeps the site's card width (${cw})`);
  expect(near(ch, 2 * k.padY + k.senderLine + k.bodyGap + k.messageLine, 0.01), `one line card is ${ch.toFixed(1)}px tall`);
  layers.Message = textLayer(k.minW, "A long message\rover two lines");
  const wide = run(JH.expr.cardWidth(fmt), fenv(0));
  const tall = run(JH.expr.cardHeight(fmt), fenv(0));
  expect(wide > k.minW && near(tall - ch, k.messageLine, 0.01), `long message widens (${wide.toFixed(0)}) and a second line adds one line (${tall.toFixed(1)})`);
  const controls = { ...DEFAULTS, Background: 1, Exit: 2, "Card width": cw, "Card height": ch };
  const at = (t, extra = {}) => env({ fmt, time: t, controls: { ...controls, ...extra }, master: "", layers });
  const rest = run(JH.expr.cardPosition(fmt), at(1));
  expect(near(rest[0] + cw / 2, fmt.w / 2) && near(rest[1] + ch / 2, fmt.h / 2), "card centred at rest");
  expect(near(run(JH.expr.cardPosition(fmt), at(0))[0] - rest[0], 24), "card starts 24px to the right");
  expect(near(run(JH.expr.cardOpacity(100), at(0.175)), 100 * power3out(0.5), 0.01), "card fades in on power3.out over 0.35s");
  const border = (t) => run(JH.expr.borderColor(), at(t))[0];
  expect(border(0) < 0.8 && border(1 / JH.FPS) > 0.9 && border(2 / JH.FPS) < 0.8, "paper border on the first visible frame only");
  expect(near(run(JH.expr.cardOpacity(100), at(JH.DURATION)), 0), "rise exit ends clear");
  const low = run(JH.expr.cardPosition(fmt), at(1, { Placement: 2 }));
  expect(near(low[0], fmt.margin) && near(low[1] + ch, fmt.h - fmt.margin), "bottom left sits on the margins");
  const big = run(JH.expr.cardNullScale(), at(1, { Size: 100 }));
  expect(near(big[0], 200), "size 100 doubles the card");
}

console.log(`\n${checks - failures} of ${checks} checks passed`);
process.exit(failures ? 1 : 0);
