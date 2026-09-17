import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Heymans | Olympic finalist, keynote speaker",
  description:
    "Two years from deciding to try, to the Olympic 5000m final. A 30-minute keynote on strategy, risk and the status quo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
