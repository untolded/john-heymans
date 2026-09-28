import { content } from "@/lib/content";
import { facts, show, SHOW_PENDING } from "./data";
import { fill } from "./format";

/**
 * "Footage: Name" for the Kenya clips. Until the person who filmed them is
 * confirmed, development says so on screen and production shows no line.
 * Kept out of the client modules: the server-rendered static story calls it.
 */
export function footageCredit(): string {
  const who = show(facts.footage.kenya)?.credit;
  if (who) return fill(content.story.footageCredit, { name: who });
  return SHOW_PENDING ? fill(content.story.footageCredit, { name: content.story.dev.creditPending }) : "";
}
