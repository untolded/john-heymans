import { pages } from "@/lib/content-pages";
import { pageMetadata } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { LegalPage } from "@/components/site/LegalPage";
import "../story.css";

const doc = pages.legal.notice;

export const metadata = pageMetadata("/legal", doc.title, doc.description);

export default function Page() {
  return (
    <SiteShell ground="paper">
      <LegalPage kind="notice" />
    </SiteShell>
  );
}
