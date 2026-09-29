import { pages } from "@/lib/content-pages";
import { pageMetadata } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { LegalPage } from "@/components/site/LegalPage";
import "../story.css";

const doc = pages.legal.cookies;

export const metadata = pageMetadata("/cookies", doc.title, doc.description);

export default function Page() {
  return (
    <SiteShell ground="paper">
      <LegalPage kind="cookies" />
    </SiteShell>
  );
}
