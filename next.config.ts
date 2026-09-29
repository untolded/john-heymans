import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF where the browser takes it: sharper than WebP at the same weight. 85 is for the
    // full-bleed photographs and the hero poster; everything else stays at the default 75.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  // The story page moved to / and the earlier designs to /archive. Links to
  // the old URLs are out with John and the client, so they keep working.
  redirects() {
    return [
      { source: "/story", destination: "/", permanent: true },
      { source: "/signal", destination: "/archive/signal", permanent: true },
      { source: "/concept-:letter(a|b|c)", destination: "/archive/concept-:letter", permanent: true },
      { source: "/type/:path*", destination: "/archive/type/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
