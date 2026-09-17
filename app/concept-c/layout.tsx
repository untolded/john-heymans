import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./c.css";

const newsreader = Newsreader({ subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = { title: "Concept C. The log | John Heymans" };

export default function ConceptCLayout({ children }: { children: React.ReactNode }) {
  return <div className={`theme-c ${newsreader.variable}`}>{children}</div>;
}
