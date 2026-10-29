import { content } from "@/lib/content";
import { pages } from "@/lib/content-pages";
import { facts, show } from "@/lib/story/data";
import { fill, ordinal, plain } from "@/lib/story/format";
import { FAQ, SITE_URL } from "@/lib/seo";

/**
 * The FAQ's answers with their facts filled in, from the same confirmed data
 * as the page and /llms.txt, so the three cannot disagree. An answer that
 * needs a fact which is not confirmed yet is left out whole, as the page
 * leaves out pending values. Server only: it reads lib/content-pages.ts.
 */

const c = content.story;
const f = pages.faq;

export type FaqItem = { q: string; a: string[] };
export type FaqGroup = { heading: string; items: FaqItem[] };

/** "a, b and c", or "a; b; and c" when the items carry commas of their own. */
const list = (items: string[], sep: ", " | "; " = ", ") =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(sep)}${sep === "; " ? "; and " : " and "}${items[items.length - 1]}`;
/** Small counts read as words in prose ("two years"); "50+" reads as "more than 50". */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const count = (n: number | string) => (typeof n === "number" ? (WORDS[n] ?? String(n)) : n.replace(/^([\d,]+)\+$/, "more than $1"));
const day = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

function vars(): Record<string, string> {
  const r = facts.result;
  const placing = show(r.placing);
  const series = show(facts.ranking.series);
  const last = series?.[series.length - 1];
  const inputs = show(facts.algorithm.inputs);
  const target = show(facts.algorithm.target);
  const v: Record<string, string | number | undefined> = {
    games: show(r.games),
    placing: placing != null ? ordinal(placing) : undefined,
    venue: show(r.venue),
    finalDate: show(r.finalDate) && day(show(r.finalDate)!),
    time: show(r.time) ?? undefined,
    pb: show(r.personalBest),
    years: show(facts.speaker.yearsToFinal) != null ? count(show(facts.speaker.yearsToFinal)!) : undefined,
    keynotes: show(facts.speaker.keynotes) && count(show(facts.speaker.keynotes)!),
    quota: show(facts.ranking.quota),
    rank: last && /^\d+$/.test(last.label) ? ordinal(Number(last.label)) : undefined,
    startYear: series?.[0]?.date.slice(0, 4),
    endYear: last?.date.slice(0, 4),
    inputs: inputs ? list(inputs.map((i) => i.toLowerCase())) : undefined,
    target: target != null ? new Intl.NumberFormat("en-GB").format(target) : undefined,
    lessons: list(c.lessons.map((l) => `“${plain(l.title).replace(/\.$/, "")}”`), "; "),
    rooms: list(c.practical.scale.map((s) => `${s.title.toLowerCase()} (${s.size.replace(/^([\d,]+)\+$/, "$1 or more")} people)`)),
    clients: list(c.practical.logos.map((l) => l.name)),
    quotes: c.practical.quotes
      .map((q) => `“${plain(q.text)}” (${[q.name, q.who, q.org].filter(Boolean).join(", ")})`)
      .join(" "),
    email: c.enquiry.email,
  };
  return Object.fromEntries(Object.entries(v).filter(([, x]) => x != null && x !== "").map(([k, x]) => [k, String(x)]));
}

/** Every group with the answers that can be given today. */
export function faqGroups(): FaqGroup[] {
  const known = vars();
  const done = (text: string) => {
    const out = fill(text, known);
    return /\{\w+\}/.test(out) ? null : out;
  };
  return f.groups
    .map((g) => ({
      heading: g.heading,
      items: g.items.flatMap((item) => {
        const q = done(item.q);
        const a = item.a.map(done);
        return q && a.every(Boolean) ? [{ q, a: a as string[] }] : [];
      }),
    }))
    .filter((g) => g.items.length > 0);
}

/** The page's structured data: an FAQPage, every question with its whole answer. */
export function faqJsonLd(groups: FaqGroup[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${FAQ}#faq`,
    url: `${SITE_URL}${FAQ}`,
    name: f.title,
    description: f.description,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: content.brand.name },
    about: { "@id": `${SITE_URL}/#person` },
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntity: groups.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a.join(" ") } })),
    ),
  };
}
