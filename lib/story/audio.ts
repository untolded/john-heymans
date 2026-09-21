"use client";

import { at, type Moment } from "./beats";

/**
 * Story sound. Off by default, and only ever started by a click. Cues are
 * keyed to story moments and fire once per crossing, so scrolling back and
 * forth around a threshold never doubles them. With no sound files listed
 * here, the frame does not render its sound toggle at all.
 *
 * To add sound (asset X2), put the files in public/story/audio and list them:
 *   bed:  { src: "/story/audio/bed.mp3", gain: 0.25 }
 *   cues: [{ at: ["algorithm", 0.08], src: "/story/audio/keys.mp3" }, ...]
 */

type Cue = { at: Moment; src: string; gain?: number };
type Manifest = { bed: { src: string; gain: number } | null; cues: Cue[] };

export const SOUND: Manifest = { bed: null, cues: [] };

export const hasSound = () => SOUND.bed != null || SOUND.cues.length > 0;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bedNode: AudioBufferSourceNode | null = null;
const buffers = new Map<string, AudioBuffer>();
let lastT = -Infinity;

async function load(src: string) {
  if (!ctx) return null;
  if (buffers.has(src)) return buffers.get(src)!;
  const res = await fetch(src);
  const buf = await ctx.decodeAudioData(await res.arrayBuffer());
  buffers.set(src, buf);
  return buf;
}

function play(buf: AudioBuffer, gain: number, loop = false) {
  if (!ctx || !master) return null;
  const node = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = gain;
  node.buffer = buf;
  node.loop = loop;
  node.connect(g).connect(master);
  node.start();
  return node;
}

export const audio = {
  on: false,

  async enable() {
    if (!hasSound()) return;
    ctx ??= new AudioContext();
    master ??= ctx.createGain();
    master.connect(ctx.destination);
    await ctx.resume();
    audio.on = true;
    if (SOUND.bed && !bedNode) {
      const buf = await load(SOUND.bed.src);
      if (buf && audio.on) bedNode = play(buf, SOUND.bed.gain, true);
    }
    await Promise.all(SOUND.cues.map((c) => load(c.src)));
  },

  disable() {
    audio.on = false;
    bedNode?.stop();
    bedNode = null;
    void ctx?.suspend();
  },

  /** Called with story time every frame. Fires cues crossed going forward. */
  tick(t: number) {
    if (audio.on) {
      for (const c of SOUND.cues) {
        const a = at(c.at);
        if (lastT < a && t >= a) {
          const buf = buffers.get(c.src);
          if (buf) play(buf, c.gain ?? 0.6);
        }
      }
    }
    lastT = t;
  },
};
