import { Fragment } from "react";
import Link from "next/link";
import { content } from "@/lib/content";
import { pages } from "@/lib/content-pages";
import { facts, show } from "@/lib/story/data";
import { fill } from "@/lib/story/format";
import { pagePhotographers } from "@/lib/story/photos";
import { LEGAL, inline, pageJsonLd } from "@/lib/seo";

const l = pages.legal;
type Kind = (typeof LEGAL)[number]["key"];
type Field = keyof typeof l.fields;
type Block = string | { readonly list: readonly string[] } | { readonly table: { readonly head: readonly string[]; readonly rows: readonly (readonly string[])[] } };

const isField = (key: string): key is Field => key in l.fields;

/**
 * A piece of legal text with its braces filled: the booking address as a
 * link, the photographers from the footer's list, and the facts about who
 * runs the site. A fact John has not confirmed yet shows as a marked "To
 * confirm", on every build, so a preview makes the gaps obvious; the launch
 * build refuses to run until they are filled (lib/story/data/legal.json).
 */
function Filled({ text }: { text: string }) {
  const parts = text.split(/\{(\w+)\}/);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        if (part === "email")
          return (
            <a key={i} href={`mailto:${content.story.enquiry.email}`}>
              {content.story.enquiry.email}
            </a>
          );
        if (part === "photographers") return <Fragment key={i}>{pagePhotographers(false).join(", ")}</Fragment>;
        if (isField(part)) {
          const value = show(facts.legal[part]);
          return value ? (
            <Fragment key={i}>{value}</Fragment>
          ) : (
            <mark key={i} className="tbc">
              {fill(l.tbc, { what: l.fields[part] })}
            </mark>
          );
        }
        return <Fragment key={i}>{`{${part}}`}</Fragment>;
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if (typeof block === "string")
    return (
      <p>
        <Filled text={block} />
      </p>
    );
  if ("list" in block)
    return (
      <ul>
        {block.list.map((item) => (
          <li key={item}>
            <Filled text={item} />
          </li>
        ))}
      </ul>
    );
  return (
    <div className="legal-table" role="region" aria-label={block.table.head.join(", ")} tabIndex={0}>
      <table>
        <thead>
          <tr>
            {block.table.head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    <code>{cell}</code>
                  </th>
                ) : (
                  <td key={i}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * One legal page: the title as large as the site's section headings, the
 * date under it, a plain lead, then short sections. It ends by pointing to
 * the other two pages.
 */
export function LegalPage({ kind }: { kind: Kind }) {
  const doc = l[kind];
  const path = LEGAL.find((p) => p.key === kind)!.path;
  const others = LEGAL.filter((p) => p.key !== kind);
  return (
    <article className="legal" aria-labelledby="legal-title">
      <header className="legal-head">
        <h1 id="legal-title" className="legal-title">
          <span className="hl">
            <span>{doc.title}</span>
          </span>
        </h1>
        <p className="legal-date">{fill(l.updated, { date: l.date })}</p>
        <p className="legal-lead">{doc.lead}</p>
      </header>
      {doc.sections.map((s) => (
        <section className="legal-section" key={s.heading}>
          <h2>{s.heading}</h2>
          {(s.blocks as readonly Block[]).map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </section>
      ))}
      <nav className="legal-more" aria-label={l.otherLabel}>
        <span>{l.other}</span>
        {others.map((o) => (
          <Link key={o.path} href={o.path}>
            {l[o.key].title}
          </Link>
        ))}
        <Link href="/">{l.back}</Link>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: inline(pageJsonLd(path, doc.title)) }} />
    </article>
  );
}
