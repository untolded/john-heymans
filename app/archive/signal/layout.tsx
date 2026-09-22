import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./signal.css";

// Wide heavy grotesque for display, a clean neutral for reading. Both are
// set large; readability was the thing John called out.
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const text = Geist({ subsets: ["latin"], variable: "--font-text", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Only for the two words he wrote on his arms.
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker", display: "swap" });

export const metadata: Metadata = { title: "John Heymans | Olympic finalist, keynote speaker" };

export default function SignalLayout({ children }: { children: React.ReactNode }) {
  return <div className={`theme-signal ${display.variable} ${text.variable} ${mono.variable} ${marker.variable}`}>{children}</div>;
}
