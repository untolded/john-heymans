import type { Metadata } from "next";
import { Big_Shoulders, Hanken_Grotesk, Permanent_Marker } from "next/font/google";
import "./b.css";

const display = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap", fallback: ["Big Shoulders Fallback", "Arial", "sans-serif"], adjustFontFallback: false, preload: false });
const text = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-text", display: "swap", preload: false });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker", display: "swap", preload: false });

export const metadata: Metadata = { title: "Concept B. Made it | John Heymans" };

export default function ConceptBLayout({ children }: { children: React.ReactNode }) {
  return <div className={`theme-b ${display.variable} ${text.variable} ${marker.variable}`}>{children}</div>;
}
