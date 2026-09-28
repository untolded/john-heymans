"use client";

import { CopyOverlay } from "./CopyOverlay";
import { Prologue } from "./beats/Prologue";
import { Opener } from "./beats/Opener";
import { Iten } from "./beats/Iten";
import { Edge } from "./beats/Edge";
import { Algorithm } from "./beats/Algorithm";
import { Doubt } from "./beats/Doubt";
import { Chart } from "./beats/Chart";
import { Final } from "./beats/Final";

/**
 * The sticky 100svh stage. Paint order across all beats: media, dim, set
 * pieces, the line, then copy. Hidden from assistive technology, because the
 * static story beneath it carries the same text in order. The handover has no
 * layers of its own: the copy says the line, and the practical part rises
 * over the stage as a sheet of paper.
 */
export function Stage({ touch }: { touch: boolean }) {
  return (
    <div className="stage" aria-hidden="true" data-touch={touch}>
      <Prologue />
      <Opener />
      <Iten />
      <Edge />
      <Algorithm />
      <Doubt />
      <Chart />
      <Final />
      <CopyOverlay />
    </div>
  );
}
