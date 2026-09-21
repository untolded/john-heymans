import { content } from "@/lib/content";
import { facts, show } from "./data";
import { fill, num } from "./format";
import type { BeatId } from "./beats";

/**
 * The algorithm's inner voice: short status lines, bottom right, that appear
 * as the story crosses their threshold. Only true statements. A line that
 * needs a value which may not be shown is skipped, never filled in.
 * Telemetry runs in the algorithm, doubters and setbacks chapters only.
 */

export type TelemetryEntry = { id: string; beat: BeatId; at: number; text: () => string | null };

const t = content.story.telemetry;
const line = (s: string) => () => s;
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** A line filled from facts, or skipped when any of them may not be shown. */
const facty =
  (template: string, get: () => Record<string, string | number | undefined | null>) =>
  (): string | null => {
    const vars = get();
    if (Object.values(vars).some((v) => v == null)) return null;
    return fill(template, vars as Record<string, string | number>);
  };

export const TELEMETRY: readonly TelemetryEntry[] = [
  {
    id: "objective",
    beat: "algorithm",
    at: 0.3,
    text: facty(t.objective, () => {
      const p = show(facts.algorithm.target);
      return { points: p == null ? p : num(p), quota: show(facts.ranking.quota) };
    }),
  },
  { id: "calendar", beat: "algorithm", at: 0.38, text: line(t.calendar) },
  { id: "scored", beat: "algorithm", at: 0.44, text: line(t.scored) },
  { id: "projecting", beat: "algorithm", at: 0.5, text: line(t.projecting) },
  { id: "optimising", beat: "algorithm", at: 0.55, text: line(t.optimising) },
  { id: "selected", beat: "algorithm", at: 0.86, text: line(t.selected) },

  { id: "objections", beat: "doubt", at: 0.1, text: line(t.objections) },
  { id: "unchanged", beat: "doubt", at: 0.44, text: line(t.unchanged) },
  { id: "tracking", beat: "doubt", at: 0.58, text: line(t.tracking) },
  { id: "record", beat: "doubt", at: 0.84, text: line(t.record) },

  { id: "holding", beat: "setback", at: 0.12, text: facty(t.holding, () => ({ quota: show(facts.ranking.quota) })) },
  { id: "sorting", beat: "setback", at: 0.33, text: line(t.sorting) },
  { id: "controllables", beat: "setback", at: 0.5, text: line(t.controllables) },
  { id: "standard", beat: "setback", at: 0.66, text: facty(t.standard, () => ({ standard: show(facts.qualification.standard) })) },
  {
    id: "qualified",
    beat: "setback",
    at: 0.7,
    text: facty(t.qualified, () => {
      const d = show(facts.qualification.date);
      return { city: show(facts.qualification.city), date: d ? day.format(new Date(d)) : d, time: show(facts.result.personalBest) };
    }),
  },
];

