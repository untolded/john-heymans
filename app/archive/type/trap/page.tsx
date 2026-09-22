import { StoryDocument } from "@/components/story/StoryDocument";
import { trapKit } from "@/components/archive/type/trap";
import { kitMetadata } from "../meta";
import "../../../story.css";
import "../kits.css";

export const metadata = kitMetadata(trapKit);

export default function TrapPage() {
  return <StoryDocument kit={trapKit} />;
}
