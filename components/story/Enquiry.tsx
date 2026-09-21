"use client";

import { useEffect, useId, useRef, useState } from "react";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { track } from "@/lib/story/analytics";
import { BackIcon } from "./icons";

const e = content.story.enquiry;
const STEPS = ["type", "date", "size", "language", "contact"] as const;
type StepId = (typeof STEPS)[number];
type Choice = "type" | "size" | "language";

type Answers = {
  type: string;
  date: string;
  dateOpen: boolean;
  size: string;
  language: string;
  name: string;
  org: string;
  email: string;
  message: string;
  /** Honeypot. People never see it; bots fill it. */
  website: string;
};

const EMPTY: Answers = { type: "", date: "", dateOpen: false, size: "", language: "", name: "", org: "", email: "", message: "", website: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const dateText = (d: string) => (d ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d)) : "");

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<keyof Answers, string>>;

/**
 * The enquiry as a short conversation in John's voice, after LISA: one
 * question at a time, the previous answer receding above it (click it to go
 * back), a progress bar, and full keyboard use. The plain route is always one
 * click away, and the email address is always on screen.
 */
export function Enquiry({ context }: { context: "inline" | "modal" }) {
  const [a, setA] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [plain, setPlain] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const [moved, setMoved] = useState(false);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => {
    setA((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const answered = (s: StepId) => (s === "date" ? !!a.date || a.dateOpen : s === "contact" ? true : !!a[s]);
  const question = (s: StepId) => e.steps[s].q;
  const answer = (s: StepId) => (s === "date" ? (a.dateOpen ? e.steps.date.notFixed : dateText(a.date)) : s === "contact" ? a.name : a[s]);

  const go = (n: number) => {
    setMoved(true);
    setStep(n);
    track("enquiry_step", { step: n + 1, context });
  };

  // After moving between questions, focus lands on the new one.
  useEffect(() => {
    if (!moved || plain) return;
    const f = form.current?.querySelector<HTMLElement>(".enq-current input:checked, .enq-current input, .enq-current button.choice");
    f?.focus();
  }, [step, plain, moved]);

  const validate = () => {
    const err: Errors = {};
    if (!a.name.trim()) err.name = e.required;
    if (!a.org.trim()) err.org = e.required;
    if (!EMAIL.test(a.email.trim())) err.email = a.email.trim() ? e.invalidEmail : e.required;
    if (plain) {
      if (!a.type) err.type = e.required;
      if (!a.size) err.size = e.required;
      if (!a.language) err.language = e.required;
    }
    setErrors(err);
    const first = Object.keys(err)[0];
    if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    return !first;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!plain && step < STEPS.length - 1) {
      if (answered(STEPS[step])) go(step + 1);
      return;
    }
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: a.type,
          date: a.dateOpen ? "" : a.date,
          dateOpen: a.dateOpen,
          size: a.size,
          language: a.language,
          name: a.name.trim(),
          org: a.org.trim(),
          email: a.email.trim(),
          message: a.message.trim(),
          website: a.website,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      track("enquiry_sent", { context });
    } catch {
      setStatus("error");
    }
  };

  const mail = <a href={`mailto:${e.email}`}>{e.email}</a>;

  if (status === "sent") {
    return (
      <div className="enq enq-done" role="status">
        <p className="enq-q">{e.success}</p>
        <p className="enq-note">{fillNode(e.urgent, mail)}</p>
      </div>
    );
  }

  const pick = (s: Choice, v: string, clicked: boolean) => {
    set(s, v);
    // A click moves on by itself; arrow keys only select, Enter moves on.
    if (clicked && !plain) window.setTimeout(() => go(STEPS.indexOf(s) + 1), 260);
  };

  const choices = (s: Choice, asQuestion = false) => (
    <fieldset className="enq-field" aria-invalid={!!errors[s] || undefined}>
      <legend className={asQuestion ? "enq-q" : "enq-label"}>{question(s)}</legend>
      <div className="enq-choices">
        {e.steps[s].options.map((o) => (
          <label className="choice" key={o}>
            <input
              type="radio"
              name={s}
              value={o}
              checked={a[s] === o}
              onChange={() => set(s, o)}
              onClick={(ev) => {
                if (ev.detail > 0) pick(s, o, true);
              }}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {errors[s] && <p className="enq-error">{errors[s]}</p>}
    </fieldset>
  );

  const date = (asQuestion: boolean) => (
    <fieldset className="enq-field">
      <legend className={asQuestion ? "enq-q" : "enq-label"}>{question("date")}</legend>
      <div className="enq-date">
        <label className="field">
          <span className="field-label">{e.steps.date.label}</span>
          <input type="date" name="date" value={a.date} disabled={a.dateOpen} onChange={(ev) => set("date", ev.target.value)} />
        </label>
        <label className="choice choice-check">
          <input type="checkbox" name="dateOpen" checked={a.dateOpen} onChange={(ev) => set("dateOpen", ev.target.checked)} />
          <span>{e.steps.date.notFixed}</span>
        </label>
      </div>
    </fieldset>
  );

  const contact = (asQuestion: boolean) => (
    <fieldset className="enq-field">
      <legend className={asQuestion ? "enq-q" : "enq-label"}>{question("contact")}</legend>
      <div className="enq-grid">
        {(["name", "org", "email"] as const).map((k) => (
          <label className="field" key={k}>
            <span className="field-label">{e.steps.contact[k]}</span>
            <input
              name={k}
              type={k === "email" ? "email" : "text"}
              autoComplete={k === "name" ? "name" : k === "org" ? "organization" : "email"}
              value={a[k]}
              aria-invalid={!!errors[k] || undefined}
              aria-describedby={errors[k] ? `${uid}-${k}` : undefined}
              onChange={(ev) => set(k, ev.target.value)}
            />
            {errors[k] && (
              <span className="enq-error" id={`${uid}-${k}`}>
                {errors[k]}
              </span>
            )}
          </label>
        ))}
        <label className="field field-wide">
          <span className="field-label">
            {e.steps.contact.message} <span className="field-optional">({e.steps.contact.optional})</span>
          </span>
          <textarea name="message" rows={3} value={a.message} onChange={(ev) => set("message", ev.target.value)} />
        </label>
        <label className="hp" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" value={a.website} onChange={(ev) => set("website", ev.target.value)} />
        </label>
      </div>
    </fieldset>
  );

  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <form ref={form} className="enq" data-plain={plain} data-context={context} onSubmit={submit} noValidate>
      {plain ? (
        <div className="enq-plain">
          {choices("type")}
          {date(false)}
          {choices("size")}
          {choices("language")}
          {contact(false)}
        </div>
      ) : (
        <div className="enq-stage">
          {step > 0 && (
            <button type="button" className="enq-prev" key={`prev-${step}`} onClick={() => go(step - 1)} aria-label={`${e.revisit}: ${question(STEPS[step - 1])}`}>
              <span className="enq-prev-q">{question(STEPS[step - 1])}</span>
              <span className="enq-prev-a">{answer(STEPS[step - 1])}</span>
            </button>
          )}
          <div
            className="enq-current"
            key={current}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" && !(ev.target instanceof HTMLTextAreaElement) && !last) {
                ev.preventDefault();
                if (answered(current)) go(step + 1);
              }
            }}
          >
            {current === "date" ? date(true) : current === "contact" ? contact(true) : choices(current, true)}
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="enq-error enq-send-error" role="alert">
          {fillNode(e.error, mail)}
        </p>
      )}

      <div className="enq-nav">
        {!plain && step > 0 && (
          <button type="button" className="enq-back" onClick={() => go(step - 1)}>
            <BackIcon />
            <span>{e.back}</span>
          </button>
        )}
        {!plain && (
          <p className="enq-count" aria-live="polite">
            {fill(e.stepOf, { n: step + 1, total: STEPS.length })}
          </p>
        )}
        {plain || last ? (
          <button type="submit" className="pill pill-amber" disabled={status === "sending"}>
            {status === "sending" ? e.sending : e.send}
          </button>
        ) : (
          <button type="submit" className="pill pill-ghost" disabled={!answered(current)}>
            {e.next}
          </button>
        )}
      </div>

      {!plain && (
        <div className="enq-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${step / STEPS.length})` }} />
        </div>
      )}

      <p className="enq-direct">
        <button type="button" className="link" onClick={() => setPlain((p) => !p)}>
          {plain ? e.conversational : e.plain}
        </button>
        <span>{fillNode(e.direct, mail)}</span>
      </p>
    </form>
  );
}

/** Fills {email} in a sentence with a link. */
function fillNode(template: string, node: React.ReactNode) {
  const [before, after] = template.split("{email}");
  return (
    <>
      {before}
      {node}
      {after}
    </>
  );
}
