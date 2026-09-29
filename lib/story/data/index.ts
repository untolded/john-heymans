import resultJson from "./result.json";
import routeJson from "./route.json";
import rankingJson from "./ranking.json";
import algorithmJson from "./algorithm.json";
import qualificationJson from "./qualification.json";
import speakerJson from "./speaker.json";
import footageJson from "./footage.json";
import legalJson from "./legal.json";
import type { Sourced } from "./types";

export * from "./types";

type S<T> = Sourced<T>;
type Place = { lon: number; lat: number };

/** A ranking milestone. rank gives the line its shape; label is what visitors read, since several milestones are ranges. */
export type RankPoint = { date: string; rank: number; points: number | null; label: string };

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
  },
  algorithm: algorithmJson as {
    inputs: S<string[] | null>;
    target: S<number>;
    objective: S<string | null>;
    prompt: S<string | null>;
    reply: S<string[] | null>;
  },
  qualification: qualificationJson as { date: S<string | null>; how: S<string | null>; standard: S<string>; city: S<string> },
  speaker: speakerJson as { yearsToFinal: S<number>; keynotes: S<number> },
  /** Who filmed the video footage the story plays. */
  footage: footageJson as { kenya: S<{ credit: string } | null> },
  /** The legal pages' facts about who runs the site. */
  legal: legalJson as Record<"owner" | "address" | "enterpriseNumber" | "vat" | "host" | "mailbox" | "courts", S<string | null>>,
};
