import { Host_Grotesk, Martian_Mono } from "next/font/google";
import type { TypeKit } from "@/components/story/typeKit";

// A monospace for the headlines: every character on the same fixed pitch, the
// way a results list, a split time and a training log are set. It is also the
// story's own subject, since a model wrote the schedule.
const display = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-mono", display: "swap", preload: false });
// Everything a person has to read is proportional, and quiet.
const text = Host_Grotesk({ subsets: ["latin"], variable: "--font-text", display: "swap" });

export const readoutKit: TypeKit = {
  id: "readout",
  name: "Readout",
  className: `${display.variable} ${text.variable} ${mono.variable}`,
  faces: { display: "Martian Mono", text: "Host Grotesk", mono: "Martian Mono" },
  claim: "Fixed pitch. The typography of a results list, a split time and the schedule the model produced.",
  notes: [
    "The headlines and the readouts are one voice, so the page sounds like the thing that wrote the schedule.",
    "Host Grotesk carries every sentence, because nobody should read a paragraph in monospace.",
    "The boldest of the three, and the one that will divide a room.",
  ],
};
