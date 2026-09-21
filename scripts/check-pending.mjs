// Lists every fact on the story page that is not confirmed yet. Runs before
// every build. With STRICT_FACTS=1 (the launch build) it fails while any
// fact is still pending, so nothing unconfirmed can ship by accident.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const DIR = "lib/story/data";
const strict = process.env.STRICT_FACTS === "1";
const pending = [];

function walk(node, trail) {
  if (!node || typeof node !== "object") return;
  if ("status" in node && "value" in node) {
    if (node.status !== "confirmed") pending.push({ where: trail.join("."), placeholder: !!node.placeholder, source: node.source ?? "" });
    return;
  }
  for (const [k, v] of Object.entries(node)) walk(v, [...trail, k]);
}

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()) {
  walk(JSON.parse(readFileSync(path.join(DIR, file), "utf8")), [file.replace(/\.json$/, "")]);
}

if (!pending.length) {
  console.log("Facts: every value is confirmed.");
  process.exit(0);
}

console.log(`Facts: ${pending.length} not confirmed. They render in development only.`);
for (const p of pending) console.log(`  ${p.placeholder ? "placeholder" : "pending    "}  ${p.where.padEnd(30)} ${p.source}`);
if (strict) {
  console.error("\nSTRICT_FACTS=1: the launch build needs every fact confirmed.");
  process.exit(1);
}
