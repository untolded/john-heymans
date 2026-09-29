import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * The live page and the legal pages are worth indexing. The archive is earlier
 * rounds and the brand guide is unlisted, so both are kept out. The guide's
 * own path is not named here, because a robots file is public.
 *
 * AI crawlers are named one by one, because they do different jobs. The
 * search crawlers decide whether an assistant can cite the site in an answer
 * (ChatGPT search, Claude, Perplexity, Google and Apple search). The training
 * crawlers decide whether the site may be used to train models. Both are
 * allowed: a speaker wants to be known. To opt out of training only, move the
 * TRAINING list to a disallow rule; search stays unaffected.
 */
const SEARCH = ["Googlebot", "Bingbot", "Applebot", "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"];
const TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];
const PRIVATE = ["/archive/", "/brand/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: SEARCH, allow: "/", disallow: PRIVATE },
      { userAgent: TRAINING, allow: "/", disallow: PRIVATE },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
