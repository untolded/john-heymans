import type { Metadata } from "next";
import { ScrollManager } from "@/components/shared/ScrollManager";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Heymans | Olympic finalist, keynote speaker",
  description:
    "Two years from deciding to try, to the Olympic 5000m final. A 30-minute keynote on strategy, risk and the status quo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior lets Next switch smooth scrolling off during route changes,
    // so a new page never animates in from the old scroll position.
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ScrollManager />
        {children}
      </body>
    </html>
  );
}
