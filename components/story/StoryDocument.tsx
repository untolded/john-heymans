import type { Metadata } from "next";
import { content } from "@/lib/content";
import { filmAssets } from "@/lib/story/assets";
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

const shareImage = { url: "/story/og.jpg", width: 1200, height: 630, alt: m.imageAlt };

export const storyMetadata: Metadata = {
  metadataBase: new URL("https://johnheymans.com"),
  title: m.title,
  description: m.description,
  openGraph: { title: m.title, description: m.description, type: "profile", images: [shareImage] },
  twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [shareImage] },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: content.brand.name,
  description: m.person,
  jobTitle: "Keynote speaker",
  sameAs: content.social.map((s) => s.href),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
    </StoryRoot>
  );
}
