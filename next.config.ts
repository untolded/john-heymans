import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
