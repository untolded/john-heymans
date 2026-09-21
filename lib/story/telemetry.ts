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

export const TELEMETRY: readonly TelemetryEntry[] = [
  { id: "objective", beat: "algorithm", at: 0.3, text: line(t.objective) },
  { id: "calendar", beat: "algorithm", at: 0.38, text: line(t.calendar) },
  {
    id: "scored",
    beat: "algorithm",
    at: 0.44,
    text: () => {
      const n = show(facts.algorithm.meetsEvaluated);
      return n == null ? null : fill(t.scored, { n: num(n) });
    },
  },
  { id: "projecting", beat: "algorithm", at: 0.5, text: line(t.projecting) },
  { id: "optimising", beat: "algorithm", at: 0.55, text: line(t.optimising) },
  { id: "selected", beat: "algorithm", at: 0.86, text: line(t.selected) },

  { id: "objections", beat: "doubt", at: 0.1, text: line(t.objections) },
  { id: "unchanged", beat: "doubt", at: 0.44, text: line(t.unchanged) },
  { id: "tracking", beat: "doubt", at: 0.58, text: line(t.tracking) },
  { id: "record", beat: "doubt", at: 0.84, text: line(t.record) },

  { id: "sorting", beat: "setback", at: 0.33, text: line(t.sorting) },
  { id: "controllables", beat: "setback", at: 0.5, text: line(t.controllables) },
  { id: "recovering", beat: "setback", at: 0.68, text: line(t.recovering) },
  { id: "quota", beat: "setback", at: 0.8, text: line(t.quota) },
];

/** Whether a telemetry line is a pending value shown only in development. */
export const telemetryPending = (id: string) => id === "scored" && facts.algorithm.meetsEvaluated.status !== "confirmed";
