import Image from "next/image";
import type { Metadata } from "next";
import { liveKit } from "@/components/story/fonts";
import { Demo } from "@/components/brand/Demo";
import { Easings } from "@/components/brand/Easings";
import { EASES } from "@/components/brand/motion";
import { Grounds } from "@/components/brand/Grounds";
import { Scrub } from "@/components/brand/Scrub";
import { Swatch } from "@/components/brand/Swatch";
import "../brand.css";

export const metadata: Metadata = {
  title: "John Heymans. Brand guide",
  description: "Colour, type, the wordmark, motion and video. Unlisted.",
  robots: { index: false, follow: false, nocache: true },
};

const COLOURS = [
  { name: "Night", hex: "#070613", rgb: "7, 6, 19", use: "The ground the story runs on" },
  { name: "Deep", hex: "#151038", rgb: "21, 16, 56", use: "Where the ground lifts: Iten upward" },
  { name: "Violet", hex: "#3a2c91", rgb: "58, 44, 145", use: "Altitude, stadium light, the dim over photographs" },
  { name: "Lavender", hex: "#b9a8f5", rgb: "185, 168, 245", use: "The machine voice: telemetry, chart guides, labels" },
  { name: "Amber", hex: "#ff7a2f", rgb: "255, 122, 47", use: "The one accent" },
  { name: "Paper", hex: "#f3f1ea", rgb: "243, 241, 234", use: "The sheet under the keynote details, and text on night" },
  { name: "Ink", hex: "#141019", rgb: "20, 16, 25", use: "Text on paper, and text inside the amber pill" },
  { name: "Amber deep", hex: "#a8400d", rgb: "168, 64, 13", use: "The accent on paper, where amber would not hold" },
];

const CONTRAST = [
  ["Paper on night", "17.8:1"],
  ["Ink on paper", "16.6:1"],
  ["Lavender on night", "9.6:1"],
  ["Amber on night", "7.7:1"],
  ["Ink on amber", "7.2:1"],
  ["Amber deep on paper", "5.5:1"],
  ["Amber on paper", "2.3:1, never used"],
];

const SCALE = [
  ["Opener card", "197px", "0.86", "800"],
  ["Section heading", "90px", "0.92", "700"],
  ["Chapter title", "107px", "0.92", "700"],
  ["Lesson card", "94px", "0.93", "700"],
  ["Hero line", "81px", "0.92", "700"],
  ["Record line", "67px", "0.96", "700"],
  ["Figure", "143px", "0.82", "700"],
  ["Story sentence", "38px", "1.16", "500, Instrument Sans"],
  ["Body", "20px", "1.5", "400, Instrument Sans"],
  ["Readout", "13px", "1.6", "600, Geist Mono"],
];

const REVEALS = [
  { kind: "rise" as const, name: "Rise", spec: "0.6s, power3.out, 0.07s per line", text: "Lines rise from behind a mask, one after the other.", use: "Story copy, interface text, anything that reads as a sentence." },
  { kind: "words" as const, name: "Words", spec: "0.55s, power3.out, 0.11s per word", text: "Two years. One algorithm.", use: "Title cards. The most recognisable move in the brand." },
  { kind: "ink" as const, name: "Ink", spec: "1.1s, power1.inOut, 0.1s per line", text: "I ran it anyway.", use: "Lesson cards and the lines that land." },
  { kind: "type" as const, name: "Type", spec: "38 to 72ms per character, 0.22s after a comma", text: "", use: "The chat, and only the chat." },
  { kind: "flash" as const, name: "Flash", spec: "0.35s, power3.out, one frame of paper border", text: "That is not how qualification works.", use: "Notifications from the federation, the coach, the rivals." },
  { kind: "scribble" as const, name: "Scribble", spec: "1.6s per phrase, power1.inOut", text: "", use: "The handwriting, and nothing else." },
];

const EXITS = [
  ["Rise", "Up 8px, fade out", "0.25s, power2.in"],
  ["Blur", "Up 24px, to 90%, 4px of blur", "0.3s, power2.in"],
  ["Cut", "Gone", "Instant"],
];

const VIDEO = [
  ["Hero loop", "1920 wide, 16:9", "Muted", "Must work looped and silent. No burned-in titles"],
  ["Portrait loop", "720 × 1280", "Muted", "The phone hero"],
  ["The film", "1920 wide, 16:9", "Sound", "Plays in a dialog, with captions"],
  ["Audience clips", "1280 tall, 9:16", "Sound", "Subtitles required, the audience speaks Dutch"],
  ["Reel", "9:16", "Muted by default", "The about section, sound one tap away"],
];

const DOWNLOADS: { group: string; items: { href: string; label: string; note: string }[] }[] = [
  {
    group: "Fonts",
    items: [
      { href: "/brand/fonts/BigShouldersDisplay-Bold.ttf", label: "Big Shoulders Display Bold", note: "Static, opsz 72 / wght 700. Install this one" },
      { href: "/brand/fonts/BigShouldersDisplay-ExtraBold.ttf", label: "Big Shoulders Display ExtraBold", note: "Static, opsz 72 / wght 800" },
      { href: "/brand/fonts/InstrumentSansNarrow-Regular.ttf", label: "Instrument Sans Narrow Regular", note: "Static, wdth 96 / wght 400" },
      { href: "/brand/fonts/InstrumentSansNarrow-Medium.ttf", label: "Instrument Sans Narrow Medium", note: "Static, wdth 96 / wght 500" },
      { href: "/brand/fonts/InstrumentSansNarrow-SemiBold.ttf", label: "Instrument Sans Narrow SemiBold", note: "Static, wdth 96 / wght 600" },
      { href: "/brand/fonts/BigShoulders%5Bopsz%2Cwght%5D.ttf", label: "Big Shoulders, variable", note: "The original, all axes" },
      { href: "/brand/fonts/InstrumentSans%5Bwdth%2Cwght%5D.ttf", label: "Instrument Sans, variable", note: "The original, all axes" },
      { href: "/brand/fonts/GeistMono%5Bwght%5D.ttf", label: "Geist Mono, variable", note: "Readouts only" },
      { href: "/brand/fonts/BigShoulders-OFL.txt", label: "Licences", note: "SIL OFL 1.1. Ship it with the fonts" },
    ],
  },
  {
    group: "Wordmark",
    items: [
      { href: "/brand/wordmark/wordmark-paper.svg", label: "Wordmark, paper (SVG)", note: "Outlined, no font needed" },
      { href: "/brand/wordmark/wordmark-ink.svg", label: "Wordmark, ink (SVG)", note: "For paper grounds" },
      { href: "/brand/wordmark/wordmark-amber.svg", label: "Wordmark, amber (SVG)", note: "Single-element frames only" },
      { href: "/brand/wordmark/wordmark-paper.png", label: "Wordmark, paper (PNG)", note: "2000px, transparent" },
      { href: "/brand/wordmark/wordmark-ink.png", label: "Wordmark, ink (PNG)", note: "2000px, transparent" },
    ],
  },
  {
    group: "Colour",
    items: [
      { href: "/brand/palette/john-heymans.ase", label: "Swatches (.ase)", note: "Premiere, After Effects, Illustrator, Photoshop" },
      { href: "/brand/palette/palette.css", label: "palette.css", note: "The custom properties the site declares" },
      { href: "/brand/palette/palette.json", label: "palette.json", note: "Hex, RGB and float RGB" },
    ],
  },
  {
    group: "Templates and texture",
    items: [
      { href: "/brand/templates/title-16x9.svg", label: "Title card, 16:9", note: "1920 × 1080, live text" },
      { href: "/brand/templates/title-9x16.svg", label: "Title card, 9:16", note: "1080 × 1920, live text" },
      { href: "/brand/templates/lower-third-16x9.svg", label: "Lower third, 16:9", note: "Name and role" },
      { href: "/brand/texture/grain.png", label: "Grain tile", note: "256px, tiles seamlessly" },
      { href: "/brand/motion/motion-tokens.json", label: "motion-tokens.json", note: "Every duration, ease and stagger" },
    ],
  },
];

const SECTIONS = [
  ["voice", "Voice"],
  ["colour", "Colour"],
  ["type", "Type"],
  ["wordmark", "Wordmark"],
  ["motion", "Motion"],
  ["video", "Video"],
  ["photography", "Photography"],
  ["downloads", "Downloads"],
];

export default function BrandGuide() {
  return (
    <main className={`brand ${liveKit.className}`}>
      <header className="b-top">
        <Image className="b-mark" src="/brand/wordmark/wordmark-paper.svg" alt="John Heymans" width={531} height={80} priority />
        <p className="b-meta">
          Brand guide, version 1.0 <span>22 September 2026</span>
        </p>
      </header>

      <section className="b-intro">
        <h1 className="b-h1">The brand</h1>
        <p className="b-lede">
          Two years from deciding to try, to the Olympic 5000m final, on a race schedule an algorithm he built chose for
          him, against the advice of his federation, his coach and his competitors. A strategy and risk story that
          happens to take place on a running track.
        </p>
        <p className="b-note">
          This page is unlisted. Anyone with the link can open it, nothing links to it, and it is kept out of search.
          Everything on it is generated from the code the site runs, so it cannot drift from the real thing.
        </p>
        <nav className="b-contents" aria-label="Contents">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      </section>

      {/* ----------------------------------------------------------- voice */}
      <section className="b-sec" id="voice">
        <h2 className="b-h2">Voice</h2>
        <div className="b-cols">
          <div>
            <p className="b-body">
              Everything is in his voice, in the first person. Short sentences. Specific about the method: name the tool,
              name the risk, name who said no. The numbers are extraordinary enough that they do not need adjectives.
            </p>
            <p className="b-body">
              Sentence case everywhere, including buttons and captions. The display type sets headlines in capitals; the
              copy underneath never does.
            </p>
          </div>
          <div className="b-rules">
            <div className="b-rule b-rule-do">
              <b>Write</b>
              <p>&ldquo;I had no support for this.&rdquo;</p>
              <p>&ldquo;An algorithm I built picked the races.&rdquo;</p>
              <p>&ldquo;Check John&rsquo;s availability.&rdquo;</p>
            </div>
            <div className="b-rule b-rule-dont">
              <b>Never</b>
              <p>Inspiring, unique energy, authenticity, powerful lessons, takes you on a journey.</p>
              <p>Exclamation marks. Third person about himself. Em dashes.</p>
            </div>
          </div>
        </div>
        <p className="b-quote">
          &ldquo;Hey mom, made it.&rdquo; Written on his arm at the Games. The most ownable thing in the brand. Use it
          where it has been earned, never as a tagline.
        </p>
      </section>

      {/* ---------------------------------------------------------- colour */}
      <section className="b-sec" id="colour">
        <h2 className="b-h2">Colour</h2>
        <p className="b-body b-measure">
          Eight values, fixed. Everything else is one of them at an opacity. Click a chip to copy its hex.
        </p>
        <ul className="sw-grid">
          {COLOURS.map((c) => (
            <Swatch key={c.hex} {...c} />
          ))}
        </ul>

        <div className="b-cols b-cols-wide">
          <div>
            <h3 className="b-h3">Amber is spent, not spread</h3>
            <p className="b-body">
              It marks the thing that is happening: an action the viewer can take, a line being drawn, a word being
              underlined, the one cell on the results board that is his. If two amber things are on screen at once, one
              of them is wrong.
            </p>
            <h3 className="b-h3">Lavender is not a second accent</h3>
            <p className="b-body">
              It is the colour of anything the machine says: readouts, axis labels, chart guides, the log. It never
              carries a message from John.
            </p>
          </div>
          <table className="b-table">
            <caption>Contrast</caption>
            <tbody>
              {CONTRAST.map(([pair, ratio]) => (
                <tr key={pair}>
                  <th scope="row">{pair}</th>
                  <td>{ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="b-h3">The seven grounds</h3>
        <p className="b-body b-measure">
          The story never cuts between backgrounds, it crossfades between these across whole beats. In video, treat them
          as the grade.
        </p>
        <Grounds />
      </section>

      {/* ------------------------------------------------------------ type */}
      <section className="b-sec" id="type">
        <h2 className="b-h2">Type</h2>
        <div className="b-spec">
          <p className="b-spec-display">Hey mom, made it.</p>
          <p className="b-spec-label">Big Shoulders, optical size 72, weight 700, capitals, tracking −0.002em</p>
        </div>
        <div className="b-spec">
          <p className="b-spec-text">
            Everyone at the top already trains consistently. That is the entry fee, not the edge. So I built a model that
            chose which competitions to enter.
          </p>
          <p className="b-spec-label">Instrument Sans, width 96, weight 400 and 500, tracking −0.004em</p>
        </div>
        <div className="b-spec">
          <p className="b-spec-mono">212 meets scored · fastest rise in the history of the event</p>
          <p className="b-spec-label">Geist Mono, capitals, tracking 0.04em, in lavender. The machine voice</p>
        </div>

        <div className="b-cols b-cols-wide">
          <div>
            <h3 className="b-h3">The rule that matters most</h3>
            <p className="b-body">
              Line breaks are decided, not left to the browser. Headlines are set to a measure in characters, and where a
              break reads badly it is written into the copy with a vertical bar.
            </p>
            <pre className="b-code">
              <code>&quot;That&apos;s the story.|Here&apos;s what your team takes from it.&quot;</code>
            </pre>
            <p className="b-body">
              Nothing that animates uses <code>text-wrap: balance</code>: the reveal splits the text into lines, and
              balance would regroup the words when it unsplits them. In video the same rule applies. Type is set once and
              does not re-wrap on screen.
            </p>
          </div>
          <table className="b-table">
            <caption>The scale, at a 1728px design width</caption>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Size</th>
                <th scope="col">Leading</th>
                <th scope="col">Weight</th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map(([role, size, lh, w]) => (
                <tr key={role}>
                  <th scope="row">{role}</th>
                  <td>{size}</td>
                  <td>{lh}</td>
                  <td>{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="b-note">
          Install the static instances for Premiere and After Effects: they are cut at exactly the settings the brand
          uses, and Adobe applications handle variable axes unevenly. All three faces are SIL OFL 1.1.
        </p>
      </section>

      {/* -------------------------------------------------------- wordmark */}
      <section className="b-sec" id="wordmark">
        <h2 className="b-h2">Wordmark</h2>
        <div className="b-cols b-cols-wide">
          <figure className="b-mark-demo">
            <span className="b-mark-clear">
              <Image src="/brand/wordmark/wordmark-paper.svg" alt="John Heymans" width={531} height={80} />
            </span>
            <figcaption>Clear space is half the cap height on every side. Nothing enters it.</figcaption>
          </figure>
          <div>
            <p className="b-body">
              The wordmark is the name, set in Big Shoulders Display Bold, in capitals. There is no logo, no monogram and
              no symbol, and there should not be one.
            </p>
            <ul className="b-list">
              <li>Minimum 90px wide on screen, 18mm in print. Below that the counters close up.</li>
              <li>Paper on night, ink on paper. Amber only when it is the single element in the frame.</li>
              <li>Never stretch it, re-space it, set it in another face, outline it, or put it on a photograph without a scrim.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- motion */}
      <section className="b-sec" id="motion">
        <h2 className="b-h2">Motion</h2>
        <ol className="b-principles">
          <li>
            <b>The scroll is the timeline.</b> Nothing plays on its own clock. Every beat is a paused timeline scrubbed
            by the scroll, so the viewer sets the pace and can stop anywhere. Anything the scroll drives is linear,
            never eased: the hand is the ease.
          </li>
          <li>
            <b>Things arrive, they do not appear.</b> Every element enters with one of six reveals and leaves with one
            of three exits. Nothing fades in place.
          </li>
          <li>
            <b>One thing moves at a time.</b> If the type is arriving, the photograph is still. If the chart is drawing,
            the copy has already landed.
          </li>
        </ol>

        <h3 className="b-h3">Drag it yourself</h3>
        <Scrub />

        <h3 className="b-h3">Easing</h3>
        <Easings />

        <h3 className="b-h3">The six reveals</h3>
        <p className="b-body b-measure">
          Each one below is the code the site runs, not a recreation. Match these in video and the cut belongs to the
          same brand.
        </p>
        <div className="b-demos">
          {REVEALS.map((r) => (
            <article className="b-demo" key={r.kind}>
              <header>
                <b>{r.name}</b>
                <code>{r.spec}</code>
              </header>
              <Demo kind={r.kind} text={r.text} />
              <p className="b-demo-use">{r.use}</p>
            </article>
          ))}
        </div>

        <div className="b-cols b-cols-wide">
          <table className="b-table">
            <caption>The three exits</caption>
            <tbody>
              {EXITS.map(([name, what, spec]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>{what}</td>
                  <td>{spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <h3 className="b-h3">Grain</h3>
            <p className="b-body">
              A 256px tile at 3.5% opacity, 5% on the darkest ground, jumping through six positions every 0.72s. Over
              everything except the paper ground. In video, add it as an overlay at the same strength and the same rate.
              Not a film burn, not scratches, not a vignette.
            </p>
            <h3 className="b-h3">Reduced motion</h3>
            <p className="b-body">
              Anyone who asks their system for less motion gets the story as a document: every beat a section, no
              scrubbing, no autoplay, no grain animation. Keep a still-frame alternative for any motion piece.
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- video */}
      <section className="b-sec" id="video">
        <h2 className="b-h2">Video</h2>
        <table className="b-table b-table-wide">
          <caption>Formats</caption>
          <thead>
            <tr>
              <th scope="col">Use</th>
              <th scope="col">Frame</th>
              <th scope="col">Sound</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {VIDEO.map(([use, frame, sound, note]) => (
              <tr key={use}>
                <th scope="row">{use}</th>
                <td>{frame}</td>
                <td>{sound}</td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="b-h3">Safe area and layout</h3>
        <p className="b-body b-measure">
          The site&rsquo;s margin is 3.7% of the width, so a 1920 frame gets 72px on every side. Type sits bottom left in
          a hero and centred in a title card, matching the page. The dashed guide is not part of the frame.
        </p>
        <div className="b-templates">
          {[
            { src: "/brand/templates/title-16x9.png", href: "/brand/templates/title-16x9.svg", label: "Title card, 16:9", w: 960, h: 540 },
            { src: "/brand/templates/title-9x16.png", href: "/brand/templates/title-9x16.svg", label: "Title card, 9:16", w: 540, h: 960 },
            { src: "/brand/templates/lower-third-16x9.png", href: "/brand/templates/lower-third-16x9.svg", label: "Lower third", w: 960, h: 540 },
          ].map((t) => (
            <figure key={t.label}>
              <Image src={t.src} alt={t.label} width={t.w} height={t.h} sizes="(min-width: 900px) 30vw, 90vw" />
              <figcaption>
                {t.label}
                <a href={t.href} download>
                  SVG
                </a>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="b-cols b-cols-wide">
          <div>
            <h3 className="b-h3">Scrim</h3>
            <p className="b-body">Type over footage always gets the scrim, never a flat black box.</p>
            <pre className="b-code">
              <code>{`linear-gradient(to top,
  rgba(7, 6, 19, 0.85) 0%,
  rgba(7, 6, 19, 0.35) 45%,
  rgba(7, 6, 19, 0) 100%)`}</code>
            </pre>
            <p className="b-body">
              Where a photograph has to sit back behind copy, violet is multiplied over it at 50% rather than dimmed to
              black. Colour, not grey.
            </p>
            <h3 className="b-h3">Captions</h3>
            <p className="b-body">
              WebVTT alongside the file, named <code>&lt;file&gt;.en.vtt</code>. Dutch runs 15 to 20 percent longer than
              English, so never time a caption to the frame it sits on.
            </p>
          </div>
          <div>
            <h3 className="b-h3">Encoding</h3>
            <p className="b-body">
              Everything is self-hosted, AV1 in WebM first and H.264 in MP4 as the fallback. Desktop loop under 4 MB,
              phone loop under 2.5 MB.
            </p>
            <pre className="b-code">
              <code>{`# muted hero loop
ffmpeg -i in.mov -vf scale=1920:-2 \\
  -c:v libx264 -crf 26 -preset slow \\
  -pix_fmt yuv420p -movflags +faststart -an out.mp4

ffmpeg -i in.mov -vf scale=1920:-2 \\
  -c:v libsvtav1 -crf 38 -preset 6 \\
  -pix_fmt yuv420p10le -an out.webm

# the film, with sound
ffmpeg -i in.mov -vf scale=1920:-2 \\
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p \\
  -c:a aac -b:a 160k -movflags +faststart film.mp4

# an audience clip
ffmpeg -i in.mov -vf scale=-2:1280 \\
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p \\
  -c:a aac -b:a 128k -movflags +faststart clip.mp4`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- photography */}
      <section className="b-sec" id="photography">
        <h2 className="b-h2">Photography</h2>
        <ul className="b-list b-measure">
          <li>Full colour, always. The brand was built away from black and white deliberately.</li>
          <li>Photographs are dimmed with violet at 50% multiply, never desaturated to grey.</li>
          <li>Grain sits over them at the same strength as everywhere else.</li>
          <li>
            <b>Every photograph carries its photographer, wherever it appears.</b> Jelle Jansegers, Raf Thomas, Arthur
            Vermeylen, Belga Image and others. A licence condition, not a courtesy.
          </li>
          <li>Belga Image files come only from the commercial licence folder.</li>
        </ul>
      </section>

      {/* ------------------------------------------------------- downloads */}
      <section className="b-sec" id="downloads">
        <h2 className="b-h2">Downloads</h2>
        <p className="b-body b-measure">
          Everything the brand is made of. The fonts are open licence, so they can be installed and shipped freely; keep
          the licence file with them.
        </p>
        <a className="b-kit" href="/brand/john-heymans-brand-kit.zip" download>
          <b>Everything, in one file</b>
          <span>Fonts, wordmark, palette, templates, grain, motion tokens and this guide in writing. 720 KB.</span>
        </a>
        <div className="b-downloads">
          {DOWNLOADS.map((g) => (
            <div className="b-dl-group" key={g.group}>
              <h3 className="b-h3">{g.group}</h3>
              <ul>
                {g.items.map((i) => (
                  <li key={i.href}>
                    <a href={i.href} download>
                      {i.label}
                    </a>
                    <span>{i.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="b-note">
          The same guide in writing is in the repository at <code>docs/brand-guide.md</code>. The easing values are also
          in <code>motion-tokens.json</code>, with every duration and stagger on this page:{" "}
          {EASES.map((e) => e.gsap).join(", ")}.
        </p>
      </section>

      <footer className="b-foot">
        <Image className="b-mark b-mark-foot" src="/brand/wordmark/wordmark-paper.svg" alt="" width={531} height={80} />
        <p>
          Brand guide, version 1.0, 22 September 2026. Unlisted. <a href="mailto:hello@johnheymans.com">hello@johnheymans.com</a>
        </p>
      </footer>
    </main>
  );
}
