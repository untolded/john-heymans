import type { Metadata } from "next";

// Unlisted. Nothing links here; the link is the access.
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
