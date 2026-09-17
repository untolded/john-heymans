"use client";

/**
 * Marks a numeral for the concept root to count up on load. Purely
 * declarative: the root's GSAP context reads data-odometer and animates
 * textContent, so reduced-motion users simply see the final value.
 */
export function Odometer({ value, unit }: { value: string; unit?: string }) {
  const numeric = /^\d+$/.test(value);
  return (
    <span className="numeral">
      <span data-odometer={numeric ? value : undefined}>{value}</span>
      {unit ? <small>{unit}</small> : null}
    </span>
  );
}
