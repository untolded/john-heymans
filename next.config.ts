import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The CSS (about 22 KB compressed) arrives inside the HTML instead of as render-blocking files:
  // most visitors are first-time bookers on a link, who have nothing cached and gain a round trip.
  experimental: { inlineCss: true },
  poweredByHeader: false,
  images: {
    // AVIF where the browser takes it: sharper than WebP at the same weight. 85 is for the
    // full-bleed photographs and the hero poster; everything else stays at the default 75.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  headers() {
    const day = "public, max-age=86400, stale-while-revalidate=604800";
    // Security headers on every response. No CSP yet: Next's inline scripts, the JSON-LD and the
    // ALTCHA worker would need nonces, and a wrong policy breaks the enquiry silently.
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000" },
    ];
    return [
      { source: "/:path*", headers: security },
      // Media keeps its file name when it is re-encoded, so a day (then revalidated in the background),
      // not a year: long enough that a second visit loads nothing again, short enough that a new cut arrives.
      // This includes the film's HLS ladder (scripts/encode-film-hls.sh), so the first segment prefetched
      // when a play button comes into view is reused when the film opens, in every browser.
      { source: "/:dir(story|videos|photos|logos|testimonials|icons)/:path*", headers: [{ key: "Cache-Control", value: day }] },
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
