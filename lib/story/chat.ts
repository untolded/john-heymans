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
const vars = { quota: quota ?? "", points: target != null ? num(target) : "" };
const complete = (template: string) => !/\{(quota|points)\}/.test(template) || (quota != null && target != null);

export const PROMPT = c.prompt;

export const STEPS = c.steps.filter(complete).map((s) => fill(s, vars));

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
