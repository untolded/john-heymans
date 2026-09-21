import resultJson from "./result.json";
import routeJson from "./route.json";
import rankingJson from "./ranking.json";
import racesJson from "./races.json";
import algorithmJson from "./algorithm.json";
import doubtersJson from "./doubters.json";
import qualificationJson from "./qualification.json";
import speakerJson from "./speaker.json";
import type { Sourced } from "./types";

export * from "./types";

type S<T> = Sourced<T>;
type Place = { lon: number; lat: number };

/** A ranking milestone. rank gives the line its shape; label is what visitors read, since several milestones are ranges. */
export type RankPoint = { date: string; rank: number; points: number | null; label: string };
export type Meet = { id: string; name: string | null; city: string | null; country: string | null; date: string; category: string };
export type ChosenMeet = { id: string; result: { place: number | null; time: string | null; points: number | null } };
export type DoubterRole = "federation" | "coach" | "competitors";

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
    iten: S<Place & { altitude: number }>;
  },
  ranking: rankingJson as {
    series: S<RankPoint[]> & { approximate?: boolean };
    quota: S<number>;
    window: S<{ start: string; end: string }>;
    /** From entering the quota to the qualifying run: the stretch the setbacks chapter looks at up close. */
    hold: S<{ start: string; end: string }>;
  },
  races: racesJson as { candidates: S<Meet[]>; chosen: S<ChosenMeet[]> },
  algorithm: algorithmJson as {
    inputs: S<string[] | null>;
    target: S<number>;
    objective: S<string | null>;
    prompt: S<string | null>;
    reply: S<string[] | null>;
  },
  doubters: doubtersJson as { messages: S<{ role: DoubterRole; text: string }[]> },
  qualification: qualificationJson as { date: S<string | null>; how: S<string | null>; standard: S<string>; city: S<string> },
  speaker: speakerJson as { yearsToFinal: S<number>; keynotes: S<number> },
};
