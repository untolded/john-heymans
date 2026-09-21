import manifest from "./photos.json";

export type PhotoSlug = keyof typeof manifest;
export type Photo = {
  src: string;
  width: number;
  height: number;
  credit: string;
  caption: string;
  /** Copyright free: no credit needed. */
  free?: boolean;
};

export const photos = manifest as Record<PhotoSlug, Photo>;
export const photo = (slug: PhotoSlug): Photo => photos[slug];

/** Every photographer whose work appears on the site, for the footer credit line. */
export const photographers = Array.from(new Set(Object.values(photos).map((p) => p.credit).filter(Boolean)));
