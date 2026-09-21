import { content } from "@/lib/content";

const f = content.story.format;
const numbers = new Intl.NumberFormat("en-GB");
const rules = new Intl.PluralRules("en-GB", { type: "ordinal" });

/** Fills {name} placeholders. Unknown keys are left in place so gaps are visible. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (all, key: string) => (key in vars ? String(vars[key]) : all));
}

export const num = (n: number) => numbers.format(n);

export function ordinal(n: number): string {
  const rule = rules.select(n) as keyof typeof f.ordinal;
  return fill(f.ordinal[rule] ?? f.ordinal.other, { n });
}

/** "I needed an *edge*." becomes the parts around the word the line underlines. */
export function splitMark(text: string): { before: string; mark: string; after: string } | null {
  const m = /^(.*?)\*(.+?)\*(.*)$/.exec(text);
  return m ? { before: m[1], mark: m[2], after: m[3] } : null;
}

/** The text with its markup removed, for headings and assistive technology. */
export const plain = (text: string) => text.replace(/\*/g, "").replace(/\s*\|\s*/g, " ");

/** Title-card lines, split at the vertical bars. */
export const lines = (text: string) => text.split("|");

/** A duration in words sized to its magnitude: seconds, minutes, hours or days. */
export function duration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return fill(f.seconds, { s });
  if (s < 3600) return fill(f.minutes, { m: Math.floor(s / 60), s: s % 60 });
  if (s < 172800) return fill(f.hours, { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60) });
  return fill(f.days, { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600) });
}
