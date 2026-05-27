"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { BRAND } from "@/lib/data/brand";

type WordmarkProps = {
  className?: string;
  withCursor?: boolean;
  withDot?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  href?: string;
};

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-5xl md:text-6xl",
  hero:
    "text-[clamp(96px,18vw,260px)] leading-[0.92] tracking-[-0.04em]",
};

export function Wordmark({
  className,
  withCursor = false,
  withDot = true,
  size = "md",
  href = "#inicio",
}: WordmarkProps) {
  const content = (
    <span
      className={cn(
        "font-display font-bold tracking-tight",
        sizeMap[size],
        className,
      )}
    >
      {BRAND.wordmark}
      {withDot && (
        <span className="text-[var(--color-brand)]">.</span>
      )}
      {withCursor && (
        <span
          aria-hidden="true"
          className="ml-1 inline-block w-[0.08em] bg-current align-baseline animate-blink"
          style={{ height: "0.85em" }}
        />
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${BRAND.name} — ir al inicio`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] rounded-md"
      >
        {content}
      </Link>
    );
  }

  return content;
}
