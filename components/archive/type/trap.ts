import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import type { TypeKit } from "@/components/story/typeKit";

// One family for everything a person reads. The optical size axis does the
// work: at 96 the ink traps are cut wide open, at 14 they close up again.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-display", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

export const trapKit: TypeKit = {
  id: "trap",
  name: "Ink trap",
  className: `${display.variable} ${mono.variable}`,
  faces: { display: "Bricolage Grotesque", text: "Bricolage Grotesque", mono: "Geist Mono" },
  claim: "Ink traps: notches cut into the joints so the letter survives being printed fast. Precision you only see up close.",
  notes: [
    "One family, top to bottom. The optical size axis opens the traps in the headlines and closes them in the reading type.",
    "Set in sentence case, so the shapes carry the page instead of the volume.",
    "The only kit here where the headline and the body are the same voice.",
  ],
};
