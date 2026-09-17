"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { content } from "@/lib/content";

type Props = { onContinue: (prefill: { date?: string; email?: string }) => void; compact?: boolean };

/**
 * The availability desk. Two fields on the counter; "Continue" carries them
 * into the full enquiry. Built for the senior leader who has already seen
 * John speak and arrives ready to book.
 */
export function Desk({ onContinue, compact }: Props) {
  const t = content.enquiry;
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  return (
    <form
      className="desk"
      onSubmit={(e) => { e.preventDefault(); onContinue({ date: date || undefined, email: email || undefined }); }}
    >
      {!compact && <p className="desk-title">{t.title}</p>}
      <p className="desk-intro">{compact ? t.intro : "Two details to start. The rest takes a minute."}</p>
      <label className="field"><span>{t.fields.date}</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label className="field"><span>{t.fields.email}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="name@company.com" /></label>
      <div className="desk-actions">
        <motion.button type="submit" className="btn btn-pen" whileTap={{ scale: 0.97 }}>Continue</motion.button>
        <span className="small">Reply within two working days.</span>
      </div>
    </form>
  );
}
