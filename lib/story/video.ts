/**
 * Every video on the story page ships twice: AV1 in WebM (a third to half
 * the size) and H.264 in MP4 as the fallback. Browsers take the first source
 * they can play, and the codec string lets devices without AV1 decline the
 * WebM before downloading it.
 */
export const WEBM_AV1 = 'video/webm; codecs="av01.0.08M.08"';
export const WEBM_AV1_OPUS = 'video/webm; codecs="av01.0.08M.08, opus"';

export type VideoSource = { src: string; type: string };

/** "/story/reel/about" becomes the WebM and the MP4, in that order. */
export const sourcesFor = (base: string, audio: boolean): VideoSource[] => [
  { src: `${base}.webm`, type: audio ? WEBM_AV1_OPUS : WEBM_AV1 },
  { src: `${base}.mp4`, type: "video/mp4" },
];
