"use client";

import { cn } from "@/lib/utils/cn";
import { SECTIONS } from "@/lib/data/sections";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useLenis } from "@/components/providers/LenisProvider";
import { scrollToSection } from "@/lib/gsap/snap";

type Layout = "desktop" | "mobile";

type ProgressDotsProps = {
  className?: string;
  layout?: Layout;
};

export function ProgressDots({ className, layout = "desktop" }: ProgressDotsProps) {
  const { activeIndex } = useActiveSection();
  const lenis = useLenis();

  const handleJump = (index: number) => {
    scrollToSection(lenis, index);
  };

  if (layout === "mobile") {
    return (
      <nav
        aria-label="Navegación de secciones"
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex justify-center gap-2 px-6 pt-3 md:hidden",
          "pointer-events-none",
          className,
        )}
      >
        <ul className="pointer-events-auto flex items-center gap-2 rounded-full glass-card px-3 py-1.5">
          {SECTIONS.map((section, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  aria-label={`Ir a ${section.label}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => handleJump(index)}
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]",
                    isActive
                      ? "w-5 bg-[var(--color-brand)]"
                      : "w-1.5 bg-[var(--color-ink-faint)] hover:bg-[var(--color-ink-soft)]",
                  )}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Navegación de secciones"
      className={cn(
        "fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block",
        className,
      )}
    >
      <ul className="flex flex-col items-center gap-[18px]">
        {SECTIONS.map((section, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={section.id} className="group relative flex items-center">
              <button
                type="button"
                aria-label={`Ir a ${section.label}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => handleJump(index)}
                className={cn(
                  "relative w-[6px] rounded-full transition-all duration-300 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
                  isActive
                    ? "h-6 bg-[var(--color-brand)]"
                    : "h-[6px] bg-current opacity-30 hover:opacity-70 hover:h-[10px]",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 whitespace-nowrap",
                  "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                  "glass-card text-[var(--color-ink)]",
                  "opacity-0 translate-x-2 transition-all duration-200 ease-out",
                  "group-hover:opacity-100 group-hover:translate-x-0",
                )}
              >
                {section.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
