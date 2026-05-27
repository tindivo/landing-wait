"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type GradientTextProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  from?: string;
  to?: string;
  animated?: boolean;
};

export function GradientText({
  children,
  as,
  className,
  from = "var(--color-brand)",
  to = "var(--color-brand-glow)",
  animated = false,
}: GradientTextProps) {
  const Component = (as ?? "span") as ElementType;
  return (
    <Component
      className={cn(
        "bg-clip-text text-transparent inline-block",
        animated && "bg-[length:200%_100%] animate-[shimmer_4s_linear_infinite]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(120deg, ${from}, ${to}, ${from})`,
      }}
    >
      {children}
    </Component>
  );
}
