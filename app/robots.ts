import type { MetadataRoute } from "next";

/**
 * The live page is the only thing worth indexing. The archive is earlier
 * rounds and the brand guide is unlisted, so both are kept out. The guide's
 * own path is not named here, because a robots file is public.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/archive/", "/brand/"] },
  };
}
