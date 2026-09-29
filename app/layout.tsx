import type { Metadata, Viewport } from "next";
import { ScrollManager } from "@/components/shared/ScrollManager";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const m = content.story.meta;

/**
 * Defaults for every page. The live page sets its own title and share card;
 * the legal pages fill the title template. Large image previews let search
 * results and AI answers show the photographs. The archive and the brand
 * guide opt out of indexing in their own layouts. Icons and the manifest are
 * files in app/ (scripts/make-icons.mjs).
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: m.title, template: `%s | ${content.brand.name}` },
  description: m.description,
  applicationName: content.brand.name,
  authors: [{ name: content.brand.name, url: SITE_URL }],
  creator: content.brand.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  appleWebApp: { title: content.brand.name, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#070613",
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
