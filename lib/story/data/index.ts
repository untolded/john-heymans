import resultJson from "./result.json";
import routeJson from "./route.json";
import rankingJson from "./ranking.json";
import racesJson from "./races.json";
import algorithmJson from "./algorithm.json";
import doubtersJson from "./doubters.json";
import headlinesJson from "./headlines.json";
import setbacksJson from "./setbacks.json";
import qualificationJson from "./qualification.json";
import controllablesJson from "./controllables.json";
import speakerJson from "./speaker.json";
import type { Sourced } from "./types";

export * from "./types";

type S<T> = Sourced<T>;
type Place = { lon: number; lat: number };

export type RankPoint = { date: string; rank: number; points: number | null };
export type Meet = { id: string; name: string | null; city: string | null; country: string | null; date: string; category: string };
export type ChosenMeet = { id: string; result: { place: number | null; time: string | null; points: number | null } };
export type DoubterRole = "federation" | "coach" | "competitors";
export type Headline = { outlet: string; date: string; headline: string; language: string; url: string };
export type Setback = { date: string; kind: string; line: string };

/** Every dataset the story shows. Values only reach the page through show(). */
export const facts = {
  result: resultJson as {
    games: S<string>;
    venue: S<string>;
    finalDate: S<string>;
    placing: S<number>;
    time: S<string | null>;
    personalBest: S<string>;
  },
  route: routeJson as {
    origin: S<Place>;
    departure: S<Place & { city: string; altitude: number }>;
    stops: S<(Place & { city: string })[]>;
    iten: S<Place & { altitude: number }>;
    trip: S<{ from: string; to: string; weeks: number } | null>;
  },
  ranking: rankingJson as {
    series: S<RankPoint[]>;
    quota: S<number>;
    window: S<{ start: string; end: string }>;
    setbackSpan: S<{ start: string; end: string }>;
  },
  races: racesJson as { candidates: S<Meet[]>; chosen: S<ChosenMeet[]> },
  algorithm: algorithmJson as {
    meetsEvaluated: S<number>;
    inputs: S<string[] | null>;
    objective: S<string | null>;
    prompt: S<string | null>;
    reply: S<string[] | null>;
  },
  doubters: doubtersJson as { messages: S<{ role: DoubterRole; text: string }[]> },
  headlines: headlinesJson as { items: S<Headline[]>; recordSource: S<string | null> },
  setbacks: setbacksJson as { events: S<Setback[]> },
  qualification: qualificationJson as { date: S<string | null>; how: S<string | null>; position: S<number | null> },
  controllables: controllablesJson as { sleep: S<string | null>; nutrition: S<string | null>; training: S<string | null> },
  speaker: speakerJson as { yearsToFinal: S<number>; keynotes: S<number> },
};
