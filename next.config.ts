import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF where the browser takes it: sharper than WebP at the same weight. 85 is for the
    // full-bleed photographs and the hero poster; everything else stays at the default 75.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  // The film's HLS ladder (scripts/encode-film-hls.sh). Segments are cached for a day so the
  // first segment prefetched when a play button comes into view is reused when the film opens,
  // in every browser (a max-age=0 file would be fetched again).
  headers() {
    const day = "public, max-age=86400, stale-while-revalidate=604800";
    return [
      { source: "/story/film/hls/:path*", headers: [{ key: "Cache-Control", value: day }] },
      { source: "/story/film/hls/:dir/:seg(.*\\.m4s)", headers: [{ key: "Content-Type", value: "video/iso.segment" }] },
    ];
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
