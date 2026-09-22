import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./a.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concept A. Ranking | John Heymans",
};

export default function ConceptALayout({ children }: { children: React.ReactNode }) {
  return <div className={`theme-a ${archivo.variable}`}>{children}</div>;
}
