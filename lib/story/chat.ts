import { content } from "@/lib/content";
import { facts, show } from "./data";
import { fill, num } from "./format";

/**
 * What ChatGPT answers in the story, filled from the facts. A value that may
 * not be shown leaves its line out rather than printing a placeholder.
 */

const c = content.story.algorithm;
const quota = show(facts.ranking.quota);
const target = show(facts.algorithm.target);
const vars = { quota: quota ?? "", points: target != null ? num(target) : "", n: c.agents.length };
const complete = (template: string) => !/\{(quota|points)\}/.test(template) || (quota != null && target != null);

export const PROMPT = c.prompt;

export const STEPS = c.steps.filter(complete).map((s) => fill(s, vars));

export const AGENTS = c.agents.filter((a) => complete(a.task) && complete(a.done)).map((a) => ({ name: a.name, task: fill(a.task, vars), done: fill(a.done, vars) }));
export const AGENTS_HEAD = fill(c.agentsHead, { n: AGENTS.length });
export const AGENTS_DONE = fill(c.agentsDone, { n: AGENTS.length });

/** The code, filled. Only the comments carry facts; without them the lines still read. */
export const CODE = c.code.map((line) => (complete(line) ? fill(line, vars) : line.replace(/\s*#.*$/, "").replace(/\{points\}/, "None")));

export type Token = { t: string; k?: "com" | "str" | "num" | "key" | "fn" | "arg" };

const TOKEN = /(#.*$)|("[^"]*")|(\b\d[\d_,]*\b)|(\b(?:def|return|for|in|if|else|import|from|None)\b)|(\b[a-zA-Z_]\w*(?=\())|(\b[a-z_]\w*(?==[^=]))/g;

/** A small Python highlighter: enough for the dozen lines on screen. */
export function highlight(line: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    if (m.index! > last) out.push({ t: line.slice(last, m.index) });
    const k = m[1] ? "com" : m[2] ? "str" : m[3] ? "num" : m[4] ? "key" : m[5] ? "fn" : "arg";
    out.push({ t: m[0], k });
    last = m.index! + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last) });
  return out;
}

/**
 * The season calendar in the answer: two lanes across one year. The chosen
 * lane is the real indoor season (Boston, Liévin, Glasgow). The other lane
 * stands for the conventional advice in the strategy doc, twelve to fifteen
 * big outdoor races from May to September; its dates are illustrative and
 * the page never names them.
 */
const USUAL = ["05-19", "05-31", "06-08", "06-20", "06-30", "07-07", "07-19", "07-26", "08-09", "08-20", "08-30", "09-13"];

const chosenIds = (facts.races.chosen.value ?? []).map((r) => r.id);
const CHOSEN = (facts.races.candidates.value ?? []).filter((m) => chosenIds.includes(m.id)).map((m) => m.date.slice(5));

/** Position across the year, 0 to 100. */
const across = (mmdd: string) => {
  const [m, d] = mmdd.split("-").map(Number);
  const days = new Date(Date.UTC(2024, m, 0)).getUTCDate();
  return ((m - 1 + (d - 1) / days) / 12) * 100;
};

export const LANES = c.calendar.rows.map((row) => ({
  ...row,
  dots: (row.id === "chosen" ? CHOSEN : USUAL).map(across),
}));

const narrow = new Intl.DateTimeFormat("en-GB", { month: "narrow", timeZone: "UTC" });
export const MONTHS = Array.from({ length: 12 }, (_, i) => narrow.format(new Date(Date.UTC(2024, i, 1))));
