"use client";

import { MIN_FILL_SECONDS } from "@/lib/enquiry-rules";

/**
 * The enquiry's invisible spam check, in the browser: fetch a signed ALTCHA
 * challenge from /api/altcha and solve it in the background while the visitor
 * answers. The solver (altcha-lib with WebCrypto PBKDF2) is imported only
 * when the enquiry first comes into view, so the page's first load is unchanged.
 * Nothing is stored; the answer travels once, with the enquiry.
 */

export type PowState = "idle" | "solving" | "ready" | "failed" | "unavailable";

type Solved = { payload: string; issuedAt: number; expiresAt: number };

export class Pow {
  state: PowState = "idle";
  private job: Promise<Solved | null> | null = null;
  private solved: Solved | null = null;
  private controller: AbortController | null = null;

  constructor(private onChange: (s: PowState) => void) {}

  private set(s: PowState) {
    this.state = s;
    this.onChange(s);
  }

  /** The first start, when the enquiry comes into view or gets focus. After a failure, only a send tries again. */
  warm() {
    if (this.state === "idle") this.start();
  }

  /** Starts solving if nothing is solved or underway. Safe to call often. */
  start() {
    if (this.job || (this.solved && this.solved.expiresAt - Date.now() > 60_000)) return;
    this.controller = new AbortController();
    this.set("solving");
    this.job = this.solve(this.controller.signal).then(
      (s) => {
        this.solved = s;
        this.job = null;
        if (s) this.set("ready");
        return s;
      },
      () => {
        this.job = null;
        if (this.state !== "unavailable") this.set("failed");
        return null;
      },
    );
  }

  /** The payload for a send: waits for a solve underway, renews one about to expire, and never sends sooner than the server allows. */
  async payload(): Promise<string | null> {
    if (!this.solved || this.solved.expiresAt - Date.now() < 30_000) {
      this.solved = null;
      this.start();
    }
    const s = this.solved ?? (await this.job);
    if (!s) return null;
    const wait = s.issuedAt + (MIN_FILL_SECONDS + 0.5) * 1000 - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    // One solution sends once; the next send needs a new one.
    this.solved = null;
    return s.payload;
  }

  stop() {
    this.controller?.abort();
  }

  private async solve(signal: AbortSignal): Promise<Solved | null> {
    const res = await fetch("/api/altcha", { cache: "no-store", signal });
    // Measured once the challenge has arrived, so it is never earlier than the time the server signed.
    const issuedAt = Date.now();
    if (res.status === 503) {
      this.set("unavailable");
      throw new Error("not_configured");
    }
    if (!res.ok) throw new Error(String(res.status));
    const challenge = await res.json();
    const [{ solveChallenge }, { deriveKey }] = await Promise.all([import("altcha-lib"), import("altcha-lib/algorithms/web/pbkdf2")]);
    const controller = new AbortController();
    signal.addEventListener("abort", () => controller.abort());
    const solution = await solveChallenge({ challenge, deriveKey, controller, timeout: 60_000 });
    if (!solution) throw new Error("unsolved");
    const payload = btoa(JSON.stringify({ challenge, solution }));
    const expiresAt = (challenge.parameters.expiresAt ?? issuedAt / 1000 + 600) * 1000;
    return { payload, issuedAt, expiresAt };
  }
}
