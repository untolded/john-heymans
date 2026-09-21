import { Archivo, Geist, Geist_Mono } from "next/font/google";

// Display: Archivo variable, weight and width, for title cards and figures.
export const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
// Reading: Geist, set large.
export const text = Geist({ subsets: ["latin"], variable: "--font-text", display: "swap" });
// The algorithm's voice only. Not needed for the first paint.
export const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

export const fontVariables = `${display.variable} ${text.variable} ${mono.variable}`;
