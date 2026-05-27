"use client";

import { m, type Transition } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
};

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.8,
  once = true,
}: RevealProps) {
  return (
    <m.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10%" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
