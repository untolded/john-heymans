import { content } from "@/lib/content";
import { facts, show } from "@/lib/story/data";
import { ordinal, plain } from "@/lib/story/format";
import { photo } from "@/lib/photos";

/**
 * Everything search engines and AI assistants read about John, built from
 * the same copy and confirmed facts as the page, so the three can never
 * disagree: the structured data (JSON-LD) on every page and /llms.txt.
 * Values that are not confirmed yet are left out, as they are on the page.
 */

export const SITE_URL = "https://johnheymans.com";
const c = content.story;
const abs = (p: string) => new URL(p, SITE_URL).href;

/** The date the site was last built, for dateModified. */
export const UPDATED = new Date().toISOString().slice(0, 10);

/** The legal pages, for the sitemap, the footer and the cookie banner. */
export const LEGAL = [
  { path: "/privacy", key: "privacy" },
  { path: "/cookies", key: "cookies" },
  { path: "/legal", key: "notice" },
] as const;

const result = {
  games: show(facts.result.games),
  placing: show(facts.result.placing),
  finalDate: show(facts.result.finalDate),
  pb: show(facts.result.personalBest),
  years: show(facts.speaker.yearsToFinal),
  keynotes: show(facts.speaker.keynotes),
  quota: show(facts.ranking.quota),
};
const series = show(facts.ranking.series);
const last = series?.[series.length - 1]?.label;
const qualifiedRank = last && /^\d+$/.test(last) ? ordinal(Number(last)) : null;
const placing = result.placing != null ? ordinal(result.placing) : null;

const lessons = c.lessons.map((l) => plain(l.title).replace(/\.$/, ""));
const clients = c.practical.logos.map((l) => l.name);

/** One paragraph that answers "who is John Heymans" on its own, for descriptions and llms.txt. */
export function summary(): string {
  const parts = [
    `John Heymans is a Belgian distance runner and keynote speaker.`,
    result.games && placing ? `He finished ${placing} in the men's 5000m final at the Olympic Games ${result.games}.` : "",
    result.years ? `He went from outside the world's top 200 to that final in ${result.years} years,` : "",
    result.years
      ? `on a competition calendar he planned with AI, against the advice of his federation, his coach and his competitors.`
      : `He planned his competition calendar with AI, against the advice of his federation, his coach and his competitors.`,
    qualifiedRank ? `Climbing to ${qualifiedRank} in the world ranking${result.quota ? `, inside the Olympic quota of ${result.quota}` : ""}, was his Olympic qualification.` : "",
    `It was the fastest rise up the world rankings in the history of athletics.`,
    `His 30-minute keynote turns that story into five lessons for business and entrepreneurship, in English, Dutch or French.`,
  ];
  return parts.filter(Boolean).join(" ");
}

/** The structured data for the home page: the person, the site, the page and the keynote. */
export function homeJsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: content.brand.name,
    givenName: "John",
    familyName: "Heymans",
    url: SITE_URL,
    image: [abs(photo("final-arms").src), abs(photo("stage-lookup").src)],
    description: summary(),
    jobTitle: "Keynote speaker",
    nationality: { "@type": "Country", name: "Belgium" },
    email: `mailto:${c.enquiry.email}`,
    knowsAbout: ["Strategy", "Risk", "Artificial intelligence", "High performance", "Long-distance running", "5000 metres", "Keynote speaking"],
    ...(result.games && placing ? { award: `${placing}, men's 5000m final, Olympic Games ${result.games}` } : {}),
    sameAs: content.social.map((s) => s.href),
  };
  const keynote = {
    "@type": "Service",
    "@id": `${SITE_URL}/#keynote`,
    name: `${c.practical.title}: from outside the top 200 to the Olympic final`,
    serviceType: "Keynote speaking",
    provider: { "@id": `${SITE_URL}/#person` },
    description: `A 30-minute keynote, with optional Q&A, on strategy, risk and using AI to find an edge. Five lessons: ${lessons.join("; ")}.`,
    availableLanguage: ["English", "Dutch", "French"],
    audience: c.practical.scale.map((s) => ({ "@type": "Audience", audienceType: `${s.title} (${s.size})` })),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: content.brand.name, inLanguage: "en", publisher: { "@id": `${SITE_URL}/#person` } },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: c.meta.title,
        description: c.meta.description,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
        primaryImageOfPage: { "@type": "ImageObject", url: abs("/story/og.jpg"), width: 1200, height: 630 },
        dateModified: UPDATED,
      },
      person,
      keynote,
    ],
  };
}

/** A legal page's structured data: a plain web page, part of the site. */
export function pageJsonLd(path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: abs(path),
    name,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: content.brand.name },
    dateModified: UPDATED,
  };
}

/** A script tag's contents, safe to inline. */
export const inline = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * /llms.txt: a plain summary for AI assistants. Google says it does not use
 * it; other assistants may. It says only what the page says.
 */
export function llmsTxt(): string {
  const facts = [
    result.games && placing ? `- Olympic Games ${result.games}: ${placing} in the men's 5000m final${result.finalDate ? ` (${result.finalDate})` : ""}.` : "",
    result.pb ? `- 5000m personal best: ${result.pb}.` : "",
    qualifiedRank ? `- World ranking: from outside the top 200 to ${qualifiedRank}, his Olympic qualification${result.quota ? ` (the quota was ${result.quota} runners)` : ""}.` : "",
    result.years ? `- ${result.years} years from deciding to try to the Olympic final.` : "",
    result.keynotes ? `- ${result.keynotes} keynotes delivered.` : "",
  ].filter(Boolean);
  const quotes = c.practical.quotes.map((q) => `- "${q.text}" (${[q.name, q.who, q.org].filter(Boolean).join(", ")})`);
  return [
    `# ${content.brand.name}`,
    "",
    `> ${summary()}`,
    "",
    "## Facts",
    "",
    ...facts,
    "",
    "## The keynote",
    "",
    "- Length: 30 minutes, plus optional Q&A.",
    "- Languages: English, Dutch or French.",
    `- Rooms: ${c.practical.scale.map((s) => `${s.title.toLowerCase()} (${s.size})`).join(", ")}.`,
    "",
    "## The five lessons",
    "",
    ...lessons.map((l, i) => `${i + 1}. ${l}.`),
    "",
    "## Booked by",
    "",
    `${clients.slice(0, -1).join(", ")} and ${clients[clients.length - 1]}.`,
    "",
    "## What organisers wrote",
    "",
    ...quotes,
    "",
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): the story, the keynote, testimonials and the booking enquiry.`,
    `- [Privacy](${SITE_URL}/privacy), [Cookies](${SITE_URL}/cookies), [Legal notice](${SITE_URL}/legal).`,
    "",
    "## Contact",
    "",
    `- Booking enquiries: ${c.enquiry.email}`,
    ...content.social.map((s) => `- ${s.name}: ${s.href}`),
    "",
    `Last updated: ${UPDATED}`,
    "",
  ].join("\n");
}

/**
 * Metadata for a page other than the story: its own title, description and
 * canonical address, and the site's share card, which Next would otherwise
 * drop when a page sets its own Open Graph title.
 */
export function pageMetadata(path: string, title: string, description: string) {
  const image = { url: "/story/og.jpg", width: 1200, height: 630, alt: c.meta.imageAlt, type: "image/jpeg" };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${content.brand.name}`, description, url: path, siteName: content.brand.name, locale: "en_GB", type: "website" as const, images: [image] },
    twitter: { card: "summary_large_image" as const, title: `${title} | ${content.brand.name}`, description, images: [image] },
  };
}
