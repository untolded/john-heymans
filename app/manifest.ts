import type { MetadataRoute } from "next";
import { content } from "@/lib/content";

/** For "Add to home screen": the name, the night ground, and the icons from scripts/make-icons.mjs. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: content.story.meta.title,
    short_name: content.brand.name,
    description: content.story.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#070613",
    theme_color: "#070613",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
