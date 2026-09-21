"use client";

import { geoInterpolate } from "d3-geo";

type LonLat = [number, number];
const RAD = Math.PI / 180;

/**
 * A dotted orthographic globe on a 2D canvas. Land dots come precomputed
 * (scripts/build-globe-points.mjs); the projection is done by hand so a full
 * redraw of 8,000 dots stays well under a millisecond or two. The flight is
 * a great circle drawn up to a fraction of its length.
 */
export class Globe {
  private ctx: CanvasRenderingContext2D;
  private lon: Float32Array;
  private lat: Float32Array;
  private cosLat: Float32Array;
  private sinLat: Float32Array;
  private dpr = 1;
  w = 0;
  h = 0;
  cx = 0;
  cy = 0;
  r = 0;
  centre: LonLat = [0, 0];

  constructor(
    private canvas: HTMLCanvasElement,
    points: ArrayLike<number>,
    private opts: { touch: boolean },
  ) {
    this.ctx = canvas.getContext("2d")!;
    // Phones draw half the dots.
    const step = opts.touch ? 4 : 2;
    const n = Math.floor(points.length / step);
    this.lon = new Float32Array(n);
    this.lat = new Float32Array(n);
    this.cosLat = new Float32Array(n);
    this.sinLat = new Float32Array(n);
    for (let i = 0, j = 0; j < n; i += step, j++) {
      this.lon[j] = points[i] * RAD;
      this.lat[j] = points[i + 1] * RAD;
      this.cosLat[j] = Math.cos(this.lat[j]);
      this.sinLat[j] = Math.sin(this.lat[j]);
    }
  }

  resize(w: number, h: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, this.opts.touch ? 2 : 1.5);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
  }

  /** Screen position of a point, and whether it faces the viewer. */
  project([lon, lat]: LonLat): [number, number, boolean] {
    const l0 = this.centre[0] * RAD;
    const p0 = this.centre[1] * RAD;
    const l = lon * RAD;
    const p = lat * RAD;
    const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
    const x = this.r * Math.cos(p) * Math.sin(l - l0);
    const y = this.r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0));
    return [this.cx + x, this.cy - y, cosc > 0];
  }

  draw(o: { centre: LonLat; r: number; cx: number; cy: number; from: LonLat; to: LonLat; arc: number; dots: number }) {
    const { ctx, dpr } = this;
    this.centre = o.centre;
    this.r = o.r;
    this.cx = o.cx;
    this.cy = o.cy;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    // The sphere: a faint violet body and a lit limb.
    const body = ctx.createRadialGradient(o.cx - o.r * 0.3, o.cy - o.r * 0.35, o.r * 0.1, o.cx, o.cy, o.r);
    body.addColorStop(0, "rgba(58, 44, 145, 0.34)");
    body.addColorStop(0.75, "rgba(21, 16, 56, 0.2)");
    body.addColorStop(1, "rgba(185, 168, 245, 0.14)");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(o.cx, o.cy, o.r, 0, Math.PI * 2);
    ctx.fill();

    // Land.
    const l0 = o.centre[0] * RAD;
    const p0 = o.centre[1] * RAD;
    const sp0 = Math.sin(p0);
    const cp0 = Math.cos(p0);
    const size = this.opts.touch ? 1.3 : 1.15 + Math.min(2.5, (o.r / Math.min(this.w, this.h)) * 0.45);
    ctx.fillStyle = `rgba(243, 241, 234, ${0.4 * o.dots})`;
    ctx.beginPath();
    for (let i = 0; i < this.lon.length; i++) {
      const dl = this.lon[i] - l0;
      const cdl = Math.cos(dl);
      if (sp0 * this.sinLat[i] + cp0 * this.cosLat[i] * cdl <= 0) continue;
      const x = o.cx + o.r * this.cosLat[i] * Math.sin(dl);
      const y = o.cy - o.r * (cp0 * this.sinLat[i] - sp0 * this.cosLat[i] * cdl);
      if (x < -4 || y < -4 || x > this.w + 4 || y > this.h + 4) continue;
      ctx.rect(x - size / 2, y - size / 2, size, size);
    }
    ctx.fill();

    // The route, drawn up to o.arc of its length.
    if (o.arc > 0) {
      const at = geoInterpolate(o.from, o.to);
      const steps = 72;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#FF7A2F";
      ctx.shadowColor = "rgba(255, 122, 47, 0.65)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = Math.min(o.arc, i / steps);
        const [x, y] = this.project(at(t) as LonLat);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (t >= o.arc) break;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  /** Position and heading of the head of the route. */
  head(from: LonLat, to: LonLat, t: number): { x: number; y: number; angle: number } {
    const at = geoInterpolate(from, to);
    const [x, y] = this.project(at(t) as LonLat);
    const [bx, by] = this.project(at(Math.max(0, t - 0.01)) as LonLat);
    return { x, y, angle: (Math.atan2(y - by, x - bx) * 180) / Math.PI };
  }
}
