import type { MetadataRoute } from "next";
import { FAQ, LEGAL, SITE_URL } from "@/lib/seo";

/** The pages worth finding: the story, the FAQ, then the legal pages. The share photo is listed with the home page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1, images: [`${SITE_URL}/story/og.jpg`, `${SITE_URL}/photos/final-arms.jpg`, `${SITE_URL}/photos/about-john.jpg`] },
    { url: `${SITE_URL}${FAQ}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...LEGAL.map(({ path }) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
