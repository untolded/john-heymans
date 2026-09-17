import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./c.css";

// One family for everything. Optical size and width axes carry the hierarchy.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-brico", display: "swap" });

export const metadata: Metadata = { title: "Concept C. Stadium | John Heymans" };

export default function ConceptCLayout({ children }: { children: React.ReactNode }) {
  return <div className={`theme-c ${bricolage.variable}`}>{children}</div>;
}
