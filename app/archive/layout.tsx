import type { Metadata } from "next";

// Everything under /archive is an earlier round, kept for reference. It stays
// out of search; child pages inherit this unless they set their own.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
