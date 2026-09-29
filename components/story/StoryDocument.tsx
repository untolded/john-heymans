import type { Metadata } from "next";
import { content } from "@/lib/content";
import { filmAssets } from "@/lib/story/assets";
import { SITE_URL, homeJsonLd, inline } from "@/lib/seo";
import { liveKit } from "./fonts";
import type { TypeKit } from "./typeKit";
import { StoryRoot } from "./StoryRoot";
import { Hero } from "./Hero";
import { StoryTrack } from "./StoryTrack";
import { StaticStory } from "./StaticStory";
import { Practical } from "./practical/Practical";
import { Bio } from "./Bio";
import { Footer } from "./Footer";

const m = content.story.meta;

/** The photo from the final, "Hey mom" and "Made it" on his arms (scripts/make-og.mjs). */
const shareImage = { url: "/story/og.jpg", width: 1200, height: 630, alt: m.imageAlt, type: "image/jpeg" };

export const storyMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: "/", languages: { en: "/", "x-default": "/" } },
  openGraph: {
    title: m.title,
    description: m.description,
    url: "/",
    siteName: content.brand.name,
    locale: "en_GB",
    type: "profile",
    firstName: "John",
    lastName: "Heymans",
    images: [shareImage],
  },
  twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [shareImage] },
};

/**
 * The whole page, rendered on the server as a readable document. The client
 * root then decides the mode and, where motion is welcome, plays the story
 * over the same content.
 *
 * The kit is the typefaces it is set in. The live page takes the default;
 * the routes under /type pass one of the three proposals instead.
 */
export function StoryDocument({ kit = liveKit }: { kit?: TypeKit }) {
  const film = filmAssets();
  return (
    <StoryRoot className={kit.className} typeKit={kit.id} film={film}>
      <main id="main">
        <Hero film={film} />
        <StoryTrack>
          <StaticStory />
        </StoryTrack>
        <Practical />
        <Bio />
      </main>
      <Footer filmIsStandIn={film.filmIsStandIn} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: inline(homeJsonLd()) }} />
    </StoryRoot>
  );
}
