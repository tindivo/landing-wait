"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const current = (theme === "system" ? resolvedTheme : theme) ?? "light";
  const isDark = current === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Cambiar tema"
      aria-pressed={mounted ? isDark : undefined}
      className={cn(
        "fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center",
        "rounded-full glass-card cursor-pointer",
        "text-[var(--color-ink)] transition-transform duration-300 ease-out",
        "hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]",
        "md:right-6 md:top-6",
        className,
      )}
    >
      <span
        className="relative h-5 w-5"
        style={{
          transform: mounted && isDark ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.45s var(--ease-brand)",
        }}
      >
        <Sun
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-5 w-5 transition-opacity duration-300",
            mounted && isDark ? "opacity-0" : "opacity-100",
          )}
        />
        <Moon
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-5 w-5 transition-opacity duration-300",
            mounted && isDark ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </button>
  );
}
