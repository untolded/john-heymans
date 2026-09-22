import { Big_Shoulders, Geist_Mono, Instrument_Sans } from "next/font/google";
import type { TypeKit } from "./typeKit";

// Display: Big Shoulders, signage type. The optical size axis is set at 72
// for every display role, which is what opens the counters at headline size.
export const display = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap" });
// Reading: Instrument Sans, set slightly narrow so it sits under the display
// face without arguing with it.
export const text = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-text", display: "swap" });
// The algorithm's voice only. Not needed for the first paint.
export const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

export const fontVariables = `${display.variable} ${text.variable} ${mono.variable}`;

/** The kit the live page is set in. The default for StoryDocument. */
export const liveKit: TypeKit = {
  id: "board",
  name: "Scoreboard",
  className: fontVariables,
  faces: { display: "Big Shoulders", text: "Instrument Sans", mono: "Geist Mono" },
  claim: "Stadium signage. Tall, narrow capitals and figures built to be read from the far stand.",
  notes: [
    "The narrowest of the three proposals, so it is set larger than the others were.",
    "The figures are the point: 13:03.46, 2,400 m and the pace board all read as a results screen.",
    "Instrument Sans underneath, set slightly narrow.",
  ],
};
