"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Modal } from "./Modal";
import { content } from "@/lib/content";

type Props = { open: boolean; onClose: () => void; prefill?: { date?: string; email?: string } };
type Status = "idle" | "sending" | "sent";

/**
 * The booking enquiry. There is no backend yet: submit waits 900ms and shows
 * the success state, which is the exact flow the real form will follow.
 */
export function BookingModal({ open, onClose, prefill }: Props) {
  const t = content.enquiry;
  const [status, setStatus] = useState<Status>("idle");
  const reduce = useReducedMotion();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return; }
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  };

  const close = () => { onClose(); window.setTimeout(() => setStatus("idle"), 300); };

  return (
    <Modal open={open} onClose={close} title={t.title} closeLabel={t.success.close}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div key="sent" className="form-success" initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="form-success-title">{t.success.title}</p>
            <p>{t.success.body}</p>
            <button type="button" className="btn btn-primary" onClick={close}>{t.success.close}</button>
          </motion.div>
        ) : (
          <motion.form key="form" className="form" onSubmit={submit} noValidate initial={false} exit={{ opacity: 0 }}>
            <p className="form-intro">{t.intro}</p>
            <div className="form-grid">
              <label className="field"><span>{t.fields.name}</span><input name="name" type="text" required autoComplete="name" /></label>
              <label className="field"><span>{t.fields.company}</span><input name="company" type="text" required autoComplete="organization" /></label>
              <label className="field"><span>{t.fields.email}</span><input name="email" type="email" required autoComplete="email" defaultValue={prefill?.email} /></label>
              <label className="field"><span>{t.fields.date}</span><input name="date" type="date" defaultValue={prefill?.date} /></label>
              <label className="field"><span>{t.fields.type}</span>
                <select name="type" required defaultValue="">
                  <option value="" disabled>Select</option>
                  {t.types.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="field"><span>{t.fields.language}</span>
                <select name="language" defaultValue={t.languages[0]}>
                  {t.languages.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="field field-full"><span>{t.fields.message}</span><textarea name="message" rows={4} /></label>
            </div>
            <div className="form-actions">
              <motion.button type="submit" className="btn btn-primary" disabled={status === "sending"} whileTap={{ scale: 0.97 }}>
                {status === "sending" ? t.sending : t.submit}
              </motion.button>
              <a className="form-mail" href={`mailto:${t.email}`}>{t.email}</a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
