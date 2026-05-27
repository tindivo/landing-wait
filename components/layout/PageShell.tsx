"use client";

import type { ReactNode } from "react";
import {
  ProgressDots,
  KeyboardNav,
  HashSync,
  ScrollProgressBar,
  FloatingWhatsApp,
} from "@/components/navigation";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <>
      <ScrollProgressBar />
      <ProgressDots layout="desktop" />
      <ProgressDots layout="mobile" />
      <KeyboardNav />
      <HashSync />
      {children}
      <FloatingWhatsApp />
    </>
  );
}
