"use client";

import { useEffect, useRef } from "react";
import {
  SECTIONS,
  getSectionByHash,
  getSectionByIndex,
} from "@/lib/data/sections";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useLenis } from "@/components/providers/LenisProvider";

export function HashSync() {
  const { activeIndex } = useActiveSection();
  const lenis = useLenis();
  const lastHashRef = useRef<string>("");

  // Initial hash → scroll on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawHash = window.location.hash;
    if (!rawHash) return;

    const section = getSectionByHash(rawHash);
    if (!section) return;

    lastHashRef.current = section.hash;

    const jump = () => {
      const target = section.index * window.innerHeight;
      if (lenis) {
        lenis.scrollTo(target, { immediate: true });
      } else {
        window.scrollTo({ top: target, behavior: "auto" });
      }
    };

    const id = window.setTimeout(jump, 50);
    return () => window.clearTimeout(id);
  }, [lenis]);

  // Active section → update URL hash (replaceState, never push).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = getSectionByIndex(activeIndex);
    if (!section) return;
    if (lastHashRef.current === section.hash) return;

    lastHashRef.current = section.hash;
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}#${section.hash}`);
  }, [activeIndex]);

  // External hash changes (manual edit, browser back) → scroll.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onHashChange = () => {
      const section = getSectionByHash(window.location.hash);
      if (!section) return;
      if (lastHashRef.current === section.hash) return;
      lastHashRef.current = section.hash;
      const target = section.index * window.innerHeight;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.2 });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [lenis]);

  // No render: ensure SECTIONS reference is used to keep TS happy.
  void SECTIONS;
  return null;
}
