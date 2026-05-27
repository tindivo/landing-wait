"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/data/sections";

type ActiveSection = {
  activeId: string;
  activeIndex: number;
};

const DEFAULT: ActiveSection = {
  activeId: SECTIONS[0]?.id ?? "",
  activeIndex: 0,
};

export function useActiveSection(): ActiveSection {
  const [active, setActive] = useState<ActiveSection>(DEFAULT);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window))
      return;

    const elements: HTMLElement[] = [];
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) elements.push(el);
    }
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          const idx = SECTIONS.findIndex((s) => s.id === id);
          if (idx === -1) continue;
          setActive({ activeId: id, activeIndex: idx });
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      },
    );

    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return active;
}
