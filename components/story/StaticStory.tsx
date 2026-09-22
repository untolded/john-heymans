import { content } from "@/lib/content";
import { SCRIPT } from "@/lib/story/script";
import { fill, ordinal, plain } from "@/lib/story/format";
import { facts, show } from "@/lib/story/data";
import { StoryPhoto } from "./StoryPhoto";
import { Text } from "./Text";
import { ItenMapSvg } from "./set-pieces/ItenMap";
import { SeasonGridSvg } from "./set-pieces/SeasonGrid";
import { RankingChartSvg } from "./set-pieces/RankingChart";
import { NotificationCard, doubterMessages } from "./set-pieces/Notification";
import { AltitudeSvg } from "./set-pieces/AltitudeProfile";
import { HandwritingSvg } from "./set-pieces/Handwriting";

const c = content.story;
const entry = (id: string) => SCRIPT.find((e) => e.id === id)!;
const text = (id: string) => entry(id).text(c);

function Lesson({ n }: { n: 1 | 2 | 3 | 4 }) {
  const lesson = c.lessons[n - 1];
  return (
    <div className="lesson-card" id={`lesson-${n}`}>
      <h3 className="lc-title">{lesson.title}</h3>
      <p className="lc-line">{lesson.line}</p>
      <p className="lc-meta">{fill(c.lessonOf, { n, total: c.lessons.length })}</p>
    </div>
  );
}

const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/** The climb in one sentence, from the milestones' own labels, for people who cannot see the chart. */
function rankingSummary(): string | null {
  const series = show(facts.ranking.series);
  const quota = show(facts.ranking.quota);
  const hold = facts.ranking.hold.value;
  if (!series?.length || quota == null || !hold) return null;
  const a = series[0];
  const b = series.find((p) => p.date === hold.start) ?? series[series.length - 1];
  const phrase = (label: string) => (/^\d+$/.test(label) ? ordinal(Number(label)) : label.charAt(0).toLowerCase() + label.slice(1));
  return fill(c.doubt.chartSummary, { a: phrase(a.label), from: monthYear.format(new Date(a.date)), b: phrase(b.label), to: monthYear.format(new Date(b.date)), quota });
}

/**
 * The whole story as a readable document, in story order. This is what the
 * server renders, what visitors with reduced motion get, what search engines
 * index, and, visually hidden, what screen readers read in cinema mode. It
 * shows every end state: the full route, the full season, the full climb.
 */
export function StaticStory() {
  const messages = doubterMessages();
  const qualified = { date: show(facts.qualification.date), how: show(facts.qualification.how) };
  const chartSummary = rankingSummary();

  return (
    <>
      <section className="sb sb-opener" data-ground="night" aria-labelledby="sb-opener">
        <h2 id="sb-opener" className="sb-opener-title">
          <Text text={text("opener.title")} />
        </h2>
        <span className="sb-startline" aria-hidden="true" />
      </section>

      <section className="sb sb-iten" data-ground="altitude" aria-labelledby="sb-iten">
        <h2 id="sb-iten" className="sb-chapter">
          {c.chapters.iten}
        </h2>
        <figure className="sb-figure sb-map">
          <ItenMapSvg />
          <figcaption className="sr-only">{c.iten.mapSummary}</figcaption>
        </figure>
        <div className="sb-altitude">
          <AltitudeSvg className="sb-altitude-svg" />
          <p className="sb-counter">{fill(c.iten.altitude, { n: "2,400" })}</p>
        </div>
        <p className="sb-sentence">{text("iten.line")}</p>
        <Lesson n={1} />
      </section>

      <section className="sb sb-edge" data-ground="night" aria-labelledby="sb-edge">
        <h2 id="sb-edge" className="sb-chapter">
          {c.chapters.edge}
        </h2>
        <p className="sb-title">{text("edge.a")}</p>
        <p className="sb-title">
          <Text text={text("edge.b")} />
        </p>
      </section>

      <section className="sb sb-algorithm" data-ground="signal" aria-labelledby="sb-algorithm">
        <h2 id="sb-algorithm" className="sb-chapter">
          {c.chapters.algorithm}
        </h2>
        <div className="transcript">
          <p className="tr-app" aria-hidden="true">
            {c.algorithm.app}
          </p>
          <p className="tr-msg tr-you">
            <span className="sr-only">{c.algorithm.you}: </span>
            {show(facts.algorithm.prompt) ?? c.algorithm.prompt}
          </p>
          <div className="tr-msg tr-ai">
            <span className="sr-only">{c.algorithm.assistant}: </span>
            {(show(facts.algorithm.reply) ?? c.algorithm.reply).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <figure className="sb-figure sb-grid">
          <SeasonGridSvg />
          <figcaption className="sr-only">{c.algorithm.gridSummary}</figcaption>
        </figure>
        <p className="sb-sentence">{text("algorithm.caption")}</p>
      </section>

      <section className="sb sb-doubt" data-ground="signal" aria-labelledby="sb-doubt">
        <h2 id="sb-doubt" className="sb-chapter">
          {c.chapters.doubt}
        </h2>
        <ul className="sb-notifs">
          {messages.map((m) => (
            <li key={m.role}>
              <NotificationCard m={m} />
            </li>
          ))}
        </ul>
        <p className="sb-title">{text("doubt.answer")}</p>
        <figure className="sb-figure sb-chart">
          <RankingChartSvg />
          {chartSummary && <figcaption className="sr-only">{chartSummary}</figcaption>}
        </figure>
        <p className="sb-record">{text("doubt.record")}</p>
        <Lesson n={2} />
      </section>

      <section className="sb sb-setback" data-ground="low" aria-labelledby="sb-setback">
        <h2 id="sb-setback" className="sb-chapter">
          {c.chapters.setback}
        </h2>
        <StoryPhoto slug="track-lying" sizes="(min-width: 992px) 40vw, 100vw" className="sb-photo" />
        <p className="sb-sentence">{text("setback.line")}</p>
        <div className="sb-columns">
          <div className="col-cannot">
            <p className="sr-only">{c.setback.cannot}</p>
            <ul>
              {c.setback.uncontrollable.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <div className="col-can">
            <p className="sr-only">{c.setback.can}</p>
            <ul>
              {c.setback.controllable.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="sb-sentence">{text("setback.focus")}</p>
        <p className="sb-title">{text("setback.qualified")}</p>
        {qualified.date && qualified.how && <p className="sb-note">{fill(c.qualifiedNote, { date: day.format(new Date(qualified.date)), how: qualified.how })}</p>}
        <Lesson n={3} />
      </section>

      <section className="sb sb-village" data-ground="warm" aria-labelledby="sb-village">
        <h2 id="sb-village" className="sb-chapter">
          {c.chapters.village}
        </h2>
        <div className="sb-pair">
          <StoryPhoto slug="outdoor-portrait" sizes="(min-width: 992px) 30vw, 50vw" className="sb-photo" focus="30% 14%" />
          <StoryPhoto slug="track-laugh" sizes="(min-width: 992px) 30vw, 50vw" className="sb-photo" />
        </div>
        <p className="sb-sentence">{text("village.a")}</p>
        <p className="sb-sentence">{text("village.b")}</p>
        <p className="sb-title">{text("village.c")}</p>
        <Lesson n={4} />
      </section>

      <section className="sb sb-final" data-ground="stadium" aria-labelledby="sb-final">
        <h2 id="sb-final" className="sb-chapter">
          {c.chapters.final}
        </h2>
        <StoryPhoto slug="heats-pack" sizes="(min-width: 992px) 60vw, 100vw" className="sb-photo sb-photo-wide" />
        <p className="sb-sentence">{text("final.a")}</p>
        <p className="sb-sentence">{text("final.b")}</p>
        <StoryPhoto slug="final-arms" sizes="(min-width: 992px) 60vw, 100vw" className="sb-photo sb-photo-wide sb-arms">
          <HandwritingSvg className="sb-hand" />
        </StoryPhoto>
        <p className="sr-only">{c.final.arms}</p>
        <p className="sb-opener-title sb-close" id="lesson-5">
          <Text text={text("final.close")} />
        </p>
        <p className="lc-line">{c.lessons[4].line}</p>
        <p className="lc-meta">{fill(c.lessonOf, { n: 5, total: c.lessons.length })}</p>
      </section>

      <section className="sb sb-handover" data-ground="paper" aria-label={plain(c.handover.line)}>
        <p className="sb-title"><Text text={text("handover.line")} /></p>
      </section>
    </>
  );
}
