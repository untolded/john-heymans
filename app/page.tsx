// The live page. Everything it renders lives in components/story and lib/story.
// Earlier designs are kept, unlisted, under /archive; the three typeface
// proposals under /type render this same document in a different type kit.
import { StoryDocument, storyMetadata } from "@/components/story/StoryDocument";
import "./story.css";

export const metadata = storyMetadata;

export default function HomePage() {
  return <StoryDocument />;
}
