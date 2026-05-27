"use client";

import { useMemo, type CSSProperties, type ElementType } from "react";
import { cn } from "@/lib/utils/cn";

type SplitMode = "char" | "word";

type SplitTextProps = {
  children: string;
  by?: SplitMode;
  as?: ElementType;
  className?: string;
  itemClassName?: string;
  style?: CSSProperties;
  preserveWhitespace?: boolean;
};

const PART_BASE: CSSProperties = {
  display: "inline-block",
  willChange: "transform, opacity",
  textDecoration: "inherit",
};

function segmentBy(text: string, mode: SplitMode): string[] {
  if (mode === "char") {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      const seg = new Intl.Segmenter("es", { granularity: "grapheme" });
      return Array.from(seg.segment(text), (s) => s.segment);
    }
    return Array.from(text);
  }
  return text.split(/(\s+)/).filter(Boolean);
}

const SR_ONLY: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

export function SplitText({
  children,
  by = "char",
  as,
  className,
  itemClassName,
  style,
}: SplitTextProps) {
  const Component = (as ?? "span") as ElementType;
  const parts = useMemo(() => segmentBy(children, by), [children, by]);

  return (
    <Component className={cn("inline-block", className)} style={style}>
      <span style={SR_ONLY}>{children}</span>
      <span
        aria-hidden="true"
        className="inline-block"
        style={{ textDecoration: "inherit" }}
      >
        {parts.map((part, i) => {
          const isWhitespace = /^\s+$/.test(part);
          if (isWhitespace) {
            return <span key={i}>{part}</span>;
          }
          return (
            <span
              key={i}
              data-split-index={i}
              className={cn("split-part", itemClassName)}
              style={PART_BASE}
            >
              {part}
            </span>
          );
        })}
      </span>
    </Component>
  );
}
