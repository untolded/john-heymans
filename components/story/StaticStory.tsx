import Image from "next/image";
import { content } from "@/lib/content";
import { SCRIPT } from "@/lib/story/script";
import { fill, ordinal, plain } from "@/lib/story/format";
import { facts, show } from "@/lib/story/data";
import { PROMPT } from "@/lib/story/chat";
import { StoryPhoto } from "./StoryPhoto";
import { Text } from "./Text";
import { ItenMapSvg } from "./set-pieces/ItenMap";
import { RankingChartSvg } from "./set-pieces/RankingChart";
import { NotificationCard, doubterMessages } from "./set-pieces/Notification";
import { HandwritingSvg } from "./set-pieces/Handwriting";
import { ChatAnswer } from "./set-pieces/ChatAnswer";
import { footageCredit } from "@/lib/story/footage";

const c = content.story;
const entry = (id: string) => SCRIPT.find((e) => e.id === id)!;
const text = (id: string) => entry(id).text(c);

function Lesson({ n }: { n: 1 | 2 }) {
  return (
    <div className="lesson-card" id={`lesson-${n}`}>
      <h3 className="lc-title">
        <Text text={c.lessons[n - 1].title} />
      </h3>
    </div>
  );
}

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/** The climb in one sentence, from the milestones' own labels, for people who cannot see the chart. */
function rankingSummary(): string | null {
  const series = show(facts.ranking.series);
  const quota = show(facts.ranking.quota);
  if (!series?.length || quota == null) return null;
  const a = series[0];
  const b = series[series.length - 1];
  const phrase = (label: string) => (/^\d+$/.test(label) ? ordinal(Number(label)) : label.charAt(0).toLowerCase() + label.slice(1));
  return fill(c.doubt.chartSummary, { a: phrase(a.label), from: monthYear.format(new Date(a.date)), b: phrase(b.label), to: monthYear.format(new Date(b.date)), quota });
}

/**
 * The whole story as a readable document, in story order. This is what the
 * server renders, what visitors with reduced motion get, what search engines
 * index, and, visually hidden, what screen readers read in cinema mode. It
 * shows every end state: the full route, the whole answer, the full climb.
 * Chapter names are headings for screen readers only; the film has none.
 */
export function StaticStory() {
  const messages = doubterMessages();
  const chartSummary = rankingSummary();
  const packCredit = footageCredit();

  return (
    <>
      <section className="sb sb-prologue" data-ground="night" aria-label={plain(c.prologue.lines[0])}>
        {c.prologue.lines.map((line) => (
          <p className="sb-prologue-line" key={line}>
            <Text text={line} />
          </p>
        ))}
      </section>

      <section className="sb sb-opener" data-ground="night" aria-labelledby="sb-opener">
        <h2 id="sb-opener" className="sb-opener-title">
          <Text text={text("opener.title")} />
        </h2>
        <span className="sb-startline" aria-hidden="true" />
      </section>

      <section className="sb sb-iten" data-ground="altitude" aria-labelledby="sb-iten">
        <h2 id="sb-iten" className="sr-only">
          {c.chapters.iten}
        </h2>
        <p className="sb-title">
          <Text text={text("iten.title")} />
        </p>
        <figure className="sb-figure sb-map">
          <ItenMapSvg />
          <figcaption className="sr-only">{c.iten.mapSummary}</figcaption>
        </figure>
        <figure className="sphoto sb-photo-wide" style={{ "--ar": "1080 / 608" } as React.CSSProperties}>
          <div className="sphoto-frame">
            <Image src="/story/kenya/pack.jpg" alt={c.iten.packAlt} fill sizes="(min-width: 992px) 60vw, 100vw" />
          </div>
          {packCredit && <figcaption className="sphoto-credit">{packCredit}</figcaption>}
        </figure>
        <p className="sb-record">
          <Text text={text("iten.line")} />
        </p>
        <StoryPhoto slug="iten" sizes="(min-width: 992px) 40vw, 100vw" className="sb-photo" focus="50% 30%" />
        <Lesson n={1} />
      </section>

      <section className="sb sb-edge" data-ground="night" aria-labelledby="sb-edge">
        <h2 id="sb-edge" className="sr-only">
          {c.chapters.edge}
        </h2>
        <p className="sb-title">
          <Text text={text("edge.a")} />
        </p>
        <p className="sb-title">
          <Text text={text("edge.b")} />
        </p>
      </section>

      <section className="sb sb-algorithm" data-ground="signal" aria-labelledby="sb-algorithm">
        <h2 id="sb-algorithm" className="sr-only">
          {c.chapters.algorithm}
        </h2>
        <div className="transcript">
          <p className="tr-app" aria-hidden="true">
            {c.algorithm.app}
          </p>
          <p className="tr-msg tr-you">
            <span className="sr-only">{c.algorithm.you}: </span>
            {PROMPT}
          </p>
          <div className="tr-msg tr-ai">
            <p className="sr-only">{c.algorithm.assistant}:</p>
            <ChatAnswer />
          </div>
        </div>
      </section>

      <section className="sb sb-doubt" data-ground="signal" aria-labelledby="sb-doubt">
        <h2 id="sb-doubt" className="sr-only">
          {c.chapters.doubt}
        </h2>
        <p className="sb-record">
          <Text text={text("doubt.title")} />
        </p>
        <ul className="sb-notifs">
          {messages.map((m) => (
            <li key={m.role}>
              <NotificationCard m={m} />
            </li>
          ))}
        </ul>
        <p className="sb-title">{text("doubt.answer")}</p>
        <p className="sb-record">
          <Text text={text("doubt.record")} />
        </p>
        <figure className="sb-figure sb-chart">
          <RankingChartSvg />
          {chartSummary && <figcaption className="sr-only">{chartSummary}</figcaption>}
        </figure>
        <Lesson n={2} />
      </section>

      <section className="sb sb-final" data-ground="stadium" aria-labelledby="sb-final">
        <h2 id="sb-final" className="sr-only">
          {c.chapters.final}
        </h2>
        <StoryPhoto slug="heats-pack" sizes="(min-width: 992px) 60vw, 100vw" className="sb-photo sb-photo-wide" />
        <p className="sb-title">
          <Text text={text("final.a")} />
        </p>
        <p className="sb-title">{text("final.b")}</p>
        <StoryPhoto slug="final-arms" sizes="(min-width: 992px) 60vw, 100vw" className="sb-photo sb-photo-wide sb-arms">
          <HandwritingSvg className="sb-hand" />
        </StoryPhoto>
        <p className="sr-only">{c.final.arms}</p>
        <p className="sb-opener-title sb-close" id="lesson-5">
          <Text text={text("final.close")} />
        </p>
      </section>

      <section className="sb sb-handover" data-ground="paper" aria-label={plain(c.handover.line)}>
        <p className="sb-title">
          <Text text={text("handover.line")} />
        </p>
      </section>
    </>
  );
}
