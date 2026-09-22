"use client";

import { useState } from "react";

/** A colour, with the hex on click. */
export function Swatch({ hex, name, rgb, use }: { hex: string; name: string; rgb: string; use: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="sw">
      <button
        type="button"
        className="sw-chip"
        style={{ background: hex }}
        onClick={() => {
          navigator.clipboard?.writeText(hex).then(
            () => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            },
            () => {},
          );
        }}
      >
        <span className="sr-only">Copy {name}, {hex}</span>
        <span className="sw-copied" aria-live="polite">
          {copied ? "Copied" : ""}
        </span>
      </button>
      <b className="sw-name">{name}</b>
      <code className="sw-hex">{hex}</code>
      <code className="sw-rgb">{rgb}</code>
      <span className="sw-use">{use}</span>
    </li>
  );
}
