"use client";

import { useEffect } from "react";

export function useViewportHeight(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const set = () => {
      document.documentElement.style.setProperty(
        "--vh-snap",
        `${window.innerHeight}px`,
      );
    };

    const onResize = () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      timeoutId = setTimeout(set, 150);
    };

    set();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
}
