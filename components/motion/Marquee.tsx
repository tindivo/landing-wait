"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
};

export function Marquee({
  children,
  className,
  itemClassName,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
}: MarqueeProps) {
  const style: CSSProperties = {
    ["--marquee-duration" as string]: `${speed}s`,
    ["--marquee-direction" as string]:
      direction === "left" ? "normal" : "reverse",
  };

  return (
    <div
      className={cn(
        "marquee-root group relative overflow-hidden",
        className,
      )}
      style={style}
      aria-hidden="true"
    >
      <div
        className={cn(
          "marquee-track flex w-max items-center gap-12",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          itemClassName,
        )}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12" aria-hidden="true">
          {children}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll var(--marquee-duration) linear infinite;
          animation-direction: var(--marquee-direction);
        }
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
