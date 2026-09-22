import { StoryDocument } from "@/components/story/StoryDocument";
import { readoutKit } from "@/components/archive/type/readout";
import { kitMetadata } from "../meta";
import "../../../story.css";
import "../kits.css";

export const metadata = kitMetadata(readoutKit);

export default function ReadoutPage() {
  return <StoryDocument kit={readoutKit} />;
}
