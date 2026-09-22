import type { Metadata } from "next";
import type { TypeKit } from "@/components/story/typeKit";

/** Review routes: same page, different type, and never indexed. */
export function kitMetadata(kit: TypeKit): Metadata {
  return {
    title: `${kit.name}. John Heymans, set in ${kit.faces.display}`,
    description: kit.claim,
    robots: { index: false, follow: false },
  };
}
