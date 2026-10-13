"use client";

import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { fill } from "@/lib/story/format";
import { track } from "@/lib/story/analytics";
import { Pow } from "@/lib/story/pow";
import { FIELDS, MAX, problem, type Field } from "@/lib/enquiry-rules";
import { BackIcon, EditIcon, GptMark, SendIcon } from "./icons";

const e = content.story.enquiry;
const g = e.chat;
const STEPS = FIELDS;
const LAST = STEPS.length - 1;

type Answers = Record<Field, string> & {
  /** Honeypot. People never see it; bots fill it. */
  website: string;
};

const EMPTY: Answers = { name: "", org: "", email: "", phone: "", event: "", website: "" };

/** How each answer is typed: the right keyboard on a phone, and autofill where the browser has it. */
const INPUT: Record<Exclude<Field, "event">, { type: string; autoComplete: string; inputMode?: "email" | "tel" }> = {
  name: { type: "text", autoComplete: "name" },
  org: { type: "text", autoComplete: "organization" },
  email: { type: "email", autoComplete: "email", inputMode: "email" },
  phone: { type: "tel", autoComplete: "tel", inputMode: "tel" },
};

type Status = "idle" | "sending" | "sent" | "error" | "captcha" | "busy";
type Errors = Partial<Record<Field, string>>;

const message = (p: ReturnType<typeof problem>) =>
  p === "required" ? e.required : p === "email" ? e.invalidEmail : p === "phone" ? e.invalidPhone : p === "links" ? e.tooManyLinks : p === "long" ? e.tooLong : undefined;

/**
 * The enquiry as a ChatGPT conversation, a nod to how the season was
 * planned: the assistant asks one question at a time and the visitor answers
 * in the composer, as in a chat. Each answer becomes a bubble (click it to
 * change it). The plain form is one click away and the email address is
 * always on screen.
 *
 * Spam: a hidden honeypot, and an ALTCHA proof of work (lib/story/pow.ts)
 * that starts solving in the background when the enquiry first comes into
 * view. The visitor never sees it unless it fails, and then gets a retry and
 * the email address.
 */
export function Enquiry({ context }: { context: "inline" | "modal" }) {
  const [a, setA] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [plain, setPlain] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [moved, setMoved] = useState(false);
  const [keys, setKeys] = useState(false);
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const pow = useRef<Pow | null>(null);

  const startPow = useCallback(() => {
    pow.current ??= new Pow(() => {});
    pow.current.warm();
  }, []);

  // The spam check starts solving when the enquiry first comes near the screen (at once in the modal).
  useEffect(() => {
    const f = form.current;
    if (!f) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          startPow();
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(f);
    return () => {
      io.disconnect();
      pow.current?.stop();
    };
  }, [startPow]);

  // With a keyboard, Enter sends the long answer; on a touch screen Enter is a new line and the button sends.
  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setKeys(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const set = (k: keyof Answers, v: string) => {
    setA((prev) => ({ ...prev, [k]: v }));
    if (k !== "website" && errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    if (status === "captcha" || status === "error" || status === "busy") setStatus("idle");
  };

  const question = (s: Field) => e.steps[s].q;
  const answer = (s: Field) => (s === "phone" && !a.phone.trim() ? e.steps.phone.skipped : a[s].trim());

  const go = (n: number) => {
    setMoved(true);
    setStep(n);
    setFurthest((f) => Math.max(f, n));
    track("enquiry_step", { step: n + 1, field: STEPS[n], context });
  };

  // The newest message is always in view, as in a chat.
  useEffect(() => {
    const t = thread.current;
    if (!t) return;
    const quick = !moved || matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollTo({ top: t.scrollHeight, behavior: quick ? "auto" : "smooth" });
  }, [step, plain, status, moved, errors]);

  // After moving between questions, the cursor waits in the composer.
  useEffect(() => {
    if (!moved || plain) return;
    input.current?.focus({ preventScroll: true });
  }, [step, plain, moved]);

  // The long answer grows with what is typed, up to a limit set in CSS, then scrolls.
  const current = STEPS[step];
  useLayoutEffect(() => {
    const t = input.current;
    if (!t || current !== "event" || plain) return;
    const before = t.offsetHeight;
    t.style.height = "auto";
    t.style.height = `${t.scrollHeight}px`;
    // A taller composer leaves the thread less room: keep the question in view.
    if (t.offsetHeight !== before) thread.current?.scrollTo({ top: thread.current.scrollHeight });
  }, [a.event, current, plain]);

  /** Checks the given fields, shows the first problem, and returns the first field that has one. */
  const check = (fields: readonly Field[]) => {
    const err: Errors = {};
    for (const k of fields) {
      const m = message(problem(k, a[k]));
      if (m) err[k] = m;
    }
    setErrors(err);
    return fields.find((k) => err[k]);
  };

  const focusField = (k: Field) => {
    if (plain) form.current?.querySelector<HTMLElement>(`[name="${k}"]`)?.focus();
    else if (STEPS.indexOf(k) === step) input.current?.focus();
    else go(STEPS.indexOf(k));
  };

  const send = async () => {
    const bad = check(STEPS);
    if (bad) return focusField(bad);
    setStatus("sending");
    startPow();
    // Waits for a solve underway, or starts one again after a failure.
    const altcha = await pow.current!.payload();
    if (!altcha) {
      setStatus(pow.current!.state === "unavailable" ? "error" : "captcha");
      return;
    }
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: a.name.trim(),
          org: a.org.trim(),
          email: a.email.trim(),
          phone: a.phone.trim(),
          event: a.event.trim(),
          website: a.website,
          altcha,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        track("enquiry_sent", { context, phone: !!a.phone.trim() });
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (res.status === 400 && body.error === "captcha") return setStatus("captcha");
      if (res.status === 429) return setStatus("busy");
      if (res.status === 422 && Array.isArray(body.fields)) {
        setStatus("idle");
        const first = check(body.fields.filter((f: string): f is Field => (STEPS as readonly string[]).includes(f)));
        if (first) focusField(first);
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === "sending") return;
    if (plain || step === LAST) return void send();
    if (check([current])) return;
    // After changing an earlier answer, carry on where the conversation had got to.
    go(furthest > step ? furthest : step + 1);
  };

  const skipPhone = () => {
    set("phone", "");
    go(furthest > step ? furthest : step + 1);
  };

  const mail = <a href={`mailto:${e.email}`}>{e.email}</a>;
  const sent = status === "sent";
  const errId = (k: Field) => `${uid}-${k}-err`;
  const qId = `${uid}-q`;
  const countId = `${uid}-count`;
  const near = a.event.length > MAX.event * 0.8;

  const fieldError = (k: Field) =>
    errors[k] ? (
      <span className="enq-error" id={errId(k)} role="alert">
        {errors[k]}
      </span>
    ) : null;

  /** The one-form view: all five fields at once, labelled. */
  const plainForm = (
    <div className="enq-grid">
      {STEPS.map((k) => (
        <label className={k === "event" ? "field field-wide" : "field"} key={k}>
          <span className="field-label">{e.steps[k].label}</span>
          {k === "event" ? (
            <textarea
              name={k}
              rows={5}
              maxLength={MAX.event}
              value={a.event}
              aria-invalid={!!errors[k] || undefined}
              aria-describedby={errors[k] ? errId(k) : undefined}
              onChange={(ev) => set(k, ev.target.value)}
            />
          ) : (
            <input
              name={k}
              {...INPUT[k]}
              maxLength={MAX[k]}
              value={a[k]}
              aria-invalid={!!errors[k] || undefined}
              aria-describedby={errors[k] ? errId(k) : undefined}
              onChange={(ev) => set(k, ev.target.value)}
            />
          )}
          {fieldError(k)}
        </label>
      ))}
    </div>
  );

  /** The composer is where each answer is typed, as in ChatGPT. */
  const composerField =
    current === "event" ? (
      <textarea
        ref={input}
        className="gpt-input gpt-input-long"
        name="event"
        rows={1}
        maxLength={MAX.event}
        value={a.event}
        placeholder={e.steps.event.placeholder}
        enterKeyHint={keys ? "send" : "enter"}
        aria-labelledby={qId}
        aria-invalid={!!errors.event || undefined}
        aria-describedby={[errors.event && errId("event"), near && countId].filter(Boolean).join(" ") || undefined}
        onChange={(ev) => set("event", ev.target.value)}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" && keys && !ev.shiftKey && !ev.nativeEvent.isComposing) {
            ev.preventDefault();
            form.current?.requestSubmit();
          }
        }}
      />
    ) : (
      <input
        ref={input}
        key={current}
        className="gpt-input"
        name={current}
        {...INPUT[current]}
        maxLength={MAX[current]}
        value={a[current]}
        placeholder={e.steps[current].placeholder}
        enterKeyHint="next"
        aria-labelledby={qId}
        aria-invalid={!!errors[current] || undefined}
        aria-describedby={errors[current] ? errId(current) : undefined}
        onChange={(ev) => set(current, ev.target.value)}
      />
    );

  return (
    <form
      ref={form}
      className="enq gpt"
      data-plain={plain}
      data-context={context}
      data-status={status}
      // Inline, the window arrives with its section's copy instead of waiting there, dark and alone, before it.
      data-reveal={context === "inline" ? "fade" : undefined}
      onSubmit={submit}
      onFocusCapture={startPow}
      noValidate
    >
      {context === "inline" && (
        <div className="gpt-bar" aria-hidden="true">
          <GptMark size={20} />
          <span>{g.app}</span>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {!plain && !sent ? fill(e.stepOf, { n: step + 1, total: STEPS.length }) : ""}
      </p>

      <div className="gpt-thread" ref={thread}>
        <div className="gpt-ai">
          <Avatar />
          <p>{g.hello}</p>
        </div>

        {plain ? (
          <div className="gpt-ai">
            <Avatar />
            <div className="enq-plain">{plainForm}</div>
          </div>
        ) : (
          <>
            {STEPS.slice(0, sent ? STEPS.length : step).map((s, i) => (
              <Fragment key={s}>
                <div className="gpt-ai gpt-past">
                  <Avatar />
                  <p>{question(s)}</p>
                </div>
                {sent ? (
                  <p className="gpt-you" data-skipped={s === "phone" && !a.phone.trim()}>
                    {answer(s)}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="gpt-you"
                    data-skipped={s === "phone" && !a.phone.trim()}
                    onClick={() => go(i)}
                    aria-label={`${e.revisit}: ${question(s)} ${answer(s)}`}
                  >
                    <span>{answer(s)}</span>
                    <EditIcon />
                  </button>
                )}
              </Fragment>
            ))}
            {!sent && (
              <div className="gpt-ai enq-current" key={current}>
                <Avatar />
                <div className="gpt-body">
                  <p id={qId}>{question(current)}</p>
                  {current === "phone" && (
                    <div className="enq-choices">
                      <button type="button" className="gpt-chip" onClick={skipPhone}>
                        {e.steps.phone.skip}
                      </button>
                    </div>
                  )}
                  {fieldError(current)}
                </div>
              </div>
            )}
          </>
        )}

        {sent && (
          <div className="gpt-ai enq-done" role="status">
            <Avatar />
            <div className="gpt-body">
              <p>{g.sent}</p>
              <p className="enq-note">{fillNode(e.urgent, { email: mail })}</p>
            </div>
          </div>
        )}
      </div>

      {(status === "error" || status === "busy" || status === "captcha") && (
        <p className="enq-error enq-send-error" role="alert">
          {status === "captcha"
            ? fillNode(e.captcha, {
                email: mail,
                retry: (
                  <button type="button" className="link" onClick={() => void send()}>
                    {e.retry}
                  </button>
                ),
              })
            : fillNode(status === "busy" ? e.busy : e.error, { email: mail })}
        </p>
      )}

      {!sent && (
        <div className="gpt-composer" data-long={!plain && current === "event"}>
          {!plain && step > 0 && (
            <button type="button" className="gpt-round" onClick={() => go(step - 1)} aria-label={e.back}>
              <BackIcon />
            </button>
          )}
          {plain ? (
            <p className="gpt-draft" data-empty="true" aria-hidden="true">
              {g.details}
            </p>
          ) : (
            composerField
          )}
          {/* Pressing send must not blur the long answer first: on phones its blur brings the fine print back and moves the button from under the finger. */}
          {plain || step === LAST ? (
            <button type="submit" className="gpt-send gpt-send-label" disabled={status === "sending"} onPointerDown={(e) => e.preventDefault()}>
              <span>{status === "sending" ? e.sending : e.send}</span>
              <SendIcon />
            </button>
          ) : (
            <button
              type="submit"
              className="gpt-send"
              onPointerDown={(e) => e.preventDefault()}
              // An empty phone number is a skip, so that one can always be sent.
              data-ready={current === "phone" || !!a[current].trim()}
              aria-label={e.next}
            >
              <SendIcon />
            </button>
          )}
        </div>
      )}
      {!sent && !plain && current === "event" && (
        <p className="gpt-hint">
          {keys && <span>{g.keys}</span>}
          {near && (
            <span id={countId}>
              {fill(e.steps.event.count, { n: a.event.length, max: MAX.event })}
            </span>
          )}
        </p>
      )}

      <label className="hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" value={a.website} onChange={(ev) => set("website", ev.target.value)} />
      </label>

      <p className="gpt-fine">{g.disclaimer}</p>
      <p className="enq-direct">
        {!sent && (
          <button
            type="button"
            className="link"
            onClick={() => {
              setErrors({});
              setPlain((p) => !p);
            }}
          >
            {plain ? e.conversational : e.plain}
          </button>
        )}
        <span>{fillNode(e.direct, { email: mail })}</span>
      </p>
    </form>
  );
}

/** The assistant's avatar: the ChatGPT knot in a ring. */
const Avatar = () => (
  <span className="gpt-avatar" aria-hidden="true">
    <GptMark />
  </span>
);

/** Fills {key} placeholders in a sentence with nodes, such as the email link or a retry button. */
function fillNode(template: string, nodes: Record<string, React.ReactNode>) {
  return template.split(/(\{\w+\})/).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return <Fragment key={i}>{key && key in nodes ? nodes[key] : part}</Fragment>;
  });
}
