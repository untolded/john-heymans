import { llmsTxt } from "@/lib/seo";

/**
 * /llms.txt, built from the page's own copy and confirmed facts (lib/seo.ts),
 * so it cannot drift from the site the way a hand-written file did. Rendered
 * once at build time.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
