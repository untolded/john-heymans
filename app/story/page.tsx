// Everything for this page lives in components/story and lib/story, so moving
// it to / at launch is one line in app/page.tsx:
//   export { default, metadata } from "./story/page";
import { StoryDocument, storyMetadata } from "@/components/story/StoryDocument";
import "./story.css";

export const metadata = storyMetadata;

export default function StoryPage() {
  return <StoryDocument />;
}
