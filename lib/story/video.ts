/**
 * Every video on the story page ships three times, best first: AV1 in WebM
 * (the smallest, for Chrome, Edge, Firefox and the newest Apple devices),
 * HEVC in MP4 (Safari and iPhones without AV1), and H.264 in MP4 (anything
 * else). Browsers take the first source they can play, and the codec string
 * lets a device decline a file before downloading it. The AV1 files are
 * 10-bit, so the dark grounds do not band.
 */

export type VideoSource = { src: string; type: string; media?: string };

/** Up to 1080p (AV1 level 4.0, HEVC level 4.1), or up to 1440p (level 5.0 for both). */
export type Size = "hd" | "qhd";

const AV1 = { hd: "av01.0.08M.10", qhd: "av01.0.12M.10" };
const HEVC = { hd: "hvc1.1.6.L123.B0", qhd: "hvc1.1.6.L150.B0" };
const H264 = { hd: "avc1.640028", qhd: "avc1.640032" };

/** "/videos/testimonial-01" becomes the WebM, the HEVC MP4 and the H.264 MP4, in that order. */
export const sourcesFor = (base: string, audio: boolean, size: Size = "hd", media?: string): VideoSource[] => [
  { src: `${base}.webm`, type: `video/webm; codecs="${AV1[size]}${audio ? ", opus" : ""}"`, media },
  { src: `${base}-hevc.mp4`, type: `video/mp4; codecs="${HEVC[size]}${audio ? ", mp4a.40.2" : ""}"`, media },
  { src: `${base}.mp4`, type: `video/mp4; codecs="${H264[size]}${audio ? ", mp4a.40.2" : ""}"`, media },
];
