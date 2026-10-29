import { pages } from "@/lib/content-pages";
import { FAQ, pageMetadata } from "@/lib/seo";
import { SiteShell } from "@/components/site/SiteShell";
import { FaqPage } from "@/components/site/FaqPage";
import "../story.css";

const doc = pages.faq;

// The title already names John, so it stands alone instead of taking the "| John Heymans" template.
const base = pageMetadata(FAQ, doc.title, doc.description);
export const metadata = {
  ...base,
  title: { absolute: doc.title },
  openGraph: { ...base.openGraph, title: doc.title },
  twitter: { ...base.twitter, title: doc.title },
};

export default function Page() {
  return (
    <SiteShell ground="paper">
      <FaqPage />
    </SiteShell>
  );
}
