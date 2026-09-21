import { content } from "@/lib/content";
import { facts, show, mark, type DoubterRole } from "@/lib/story/data";

const d = content.story.doubt;
const ROLES: DoubterRole[] = ["federation", "coach", "competitors"];

export type Message = { role: DoubterRole; text: string; marker: "" | "pending" | "placeholder" };

/**
 * What the federation, the coach and the competitors said. Until John
 * approves exact wording, all three say the storyline's line.
 */
export function doubterMessages(): Message[] {
  const approved = show(facts.doubters.messages);
  if (approved?.length) return approved.map((m) => ({ ...m, marker: mark(facts.doubters.messages) }));
  return ROLES.map((role) => ({ role, text: d.fallback, marker: "" }));
}

/** A lock-screen notification: initial, sender, message, "now". */
export function NotificationCard({ m, className }: { m: Message; className?: string }) {
  return (
    <div className={`notif ${className ?? ""}`} data-marker={m.marker ? content.story.dev[m.marker] : undefined}>
      <span className="notif-icon" aria-hidden="true">
        {d.initials[m.role]}
      </span>
      <p className="notif-body">
        <span className="notif-role">{d.roles[m.role]}</span>
        <span className="notif-text">{m.text}</span>
      </p>
      <span className="notif-time" aria-hidden="true">
        {d.now}
      </span>
    </div>
  );
}
