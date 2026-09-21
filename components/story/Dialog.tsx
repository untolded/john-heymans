"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { scroller } from "@/lib/story/scroll";
import { CloseIcon } from "./icons";

type Props = {
  title: string;
  onClose: () => void;
  closeLabel: string;
  size?: "form" | "wide";
  children: React.ReactNode;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, textarea, video[controls]';

/**
 * A modal on the native dialog element: the browser traps focus, makes the
 * page behind it inert and closes it on Escape. Opening lands on the first
 * control in the content, closing returns focus to whatever opened it, and
 * the page behind holds still while it is open.
 */
export function Dialog({ title, onClose, closeLabel, size = "form", children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const labelId = useId();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const d = ref.current!;
    opener.current = document.activeElement;
    d.showModal();
    scroller.lock(true);
    const first = Array.from(d.querySelectorAll<HTMLElement>(FOCUSABLE)).find((n) => !n.classList.contains("dlg-close"));
    first?.focus();
    return () => {
      scroller.lock(false);
      if (d.open) d.close();
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    const quick = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      ref.current?.close();
      onClose();
    }, quick ? 0 : 200);
  }, [closing, onClose]);

  return (
    <dialog
      ref={ref}
      className={`dlg dlg-${size}`}
      data-closing={closing}
      aria-labelledby={labelId}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="dlg-panel">
        <div className="dlg-head">
          <h2 id={labelId} className="dlg-title">
            {title}
          </h2>
          <button type="button" className="dlg-close" onClick={close} aria-label={closeLabel}>
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
