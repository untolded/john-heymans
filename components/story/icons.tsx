/** Small icons. Always decorative: the control around them carries the label. */

export const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3.5 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.4 1.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
  </svg>
);

export const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="3" y="2" width="3" height="10" rx="0.6" fill="currentColor" />
    <rect x="8" y="2" width="3" height="10" rx="0.6" fill="currentColor" />
  </svg>
);

export const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 13V3.5M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M9.2 2.3 11.7 4.8 5 11.5l-3 .5.5-3 6.7-6.7Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/** The ChatGPT knot, for the chat mockups. A reference to how the season was planned. */
export const GptMark = ({ size = 18 }: { size?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element -- a 96px PNG; the optimiser adds nothing
  <img className="gpt-mark" src="/story/brand/chatgpt-white.png" alt="" width={size} height={size} decoding="async" />
);

export const SoundOnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M3 7h2.5L9 4v10l-3.5-3H3Z" fill="currentColor" />
    <path d="M12 6.2a4 4 0 0 1 0 5.6M14.1 4.3a6.8 6.8 0 0 1 0 9.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SoundOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M3 7h2.5L9 4v10l-3.5-3H3Z" fill="currentColor" />
    <path d="m12 7 4 4m0-4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
