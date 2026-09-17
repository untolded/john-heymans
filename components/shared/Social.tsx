import { content } from "@/lib/content";

const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4z" />
    </svg>
  ),
};

/** Social links for nav and footer. Icons only in the nav, icon plus handle in the footer. */
export function Social({ variant = "icons", className }: { variant?: "icons" | "full"; className?: string }) {
  return (
    <ul className={`social social-${variant} ${className ?? ""}`}>
      {content.social.map((s) => (
        <li key={s.name}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={variant === "icons" ? `${s.name}, ${s.handle}` : undefined}>
            {ICONS[s.name]}
            {variant === "full" && <span>{s.handle}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
