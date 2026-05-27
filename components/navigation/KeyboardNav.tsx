"use client";

import { useEffect } from "react";
import { SECTION_COUNT } from "@/lib/data/sections";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useLenis } from "@/components/providers/LenisProvider";
import { scrollToSection } from "@/lib/gsap/snap";

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (target.isContentEditable) return true;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "BUTTON"
  );
}

export function KeyboardNav() {
  const { activeIndex } = useActiveSection();
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const goTo = (index: number) => {
      const clamped = Math.max(0, Math.min(SECTION_COUNT - 1, index));
      scrollToSection(lenis, clamped);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isInteractiveTarget(event.target)) return;

      const { key } = event;

      if (key === "ArrowDown" || key === "PageDown") {
        event.preventDefault();
        goTo(activeIndex + 1);
        return;
      }
      if (key === "ArrowUp" || key === "PageUp") {
        event.preventDefault();
        goTo(activeIndex - 1);
        return;
      }
      if (key === "Home") {
        event.preventDefault();
        goTo(0);
        return;
      }
      if (key === "End") {
        event.preventDefault();
        goTo(SECTION_COUNT - 1);
        return;
      }
      if (/^[1-9]$/.test(key)) {
        const target = Number.parseInt(key, 10) - 1;
        if (target < SECTION_COUNT) {
          event.preventDefault();
          goTo(target);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, lenis]);

  return null;
}
