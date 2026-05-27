"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { SectionTheme } from "@/lib/data/sections";

type SnapSectionProps = {
  id: string;
  index: number;
  label: string;
  theme?: SectionTheme;
  children: ReactNode;
  className?: string;
  fullBleed?: boolean;
};

const themeBg: Record<SectionTheme, string> = {
  light: "bg-[#FAF6F1] text-[#1A1614]",
  dark: "bg-[#1A1614] text-[#FAF6F1]",
  brand: "bg-[var(--color-brand)] text-white",
};

export const SnapSection = forwardRef<HTMLElement, SnapSectionProps>(
  function SnapSection(
    { id, index, label, theme = "light", children, className, fullBleed },
    ref,
  ) {
    const titleId = `${id}-title`;
    return (
      <section
        ref={ref}
        id={id}
        data-snap-index={index}
        data-section-theme={theme}
        role="region"
        aria-labelledby={titleId}
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "relative flex w-full snap-start snap-always overflow-hidden",
          "min-h-[var(--vh-snap)]",
          themeBg[theme],
          !fullBleed && "px-5 md:px-10 lg:px-16",
          className,
        )}
      >
        {children}
      </section>
    );
  },
);
