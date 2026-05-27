"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { SECTION_COUNT } from "@/lib/data/sections";
import { useReducedMotion } from "./useReducedMotion";
import { useIsMobile } from "./useIsMobile";

const INTERACTIVE_TAGS = new Set([
  "A",
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "LABEL",
  "SUMMARY",
]);

const TAP_DURATION_MS = 600;
const TAP_EASING = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// CSS `snap-y snap-mandatory` on `<main>` blocks `window.scrollTo({behavior:'smooth'})`
// because the snap container yanks the scroll back to the nearest snap point.
// We animate scrollTop manually with rAF + `behavior:'instant'` so each frame
// just sets a position (no smooth attempt for the browser to fight).
function animateScroll(top: number, durationMs: number): void {
  if (typeof window === "undefined") return;
  const startY = window.scrollY;
  const dy = top - startY;
  if (Math.abs(dy) < 1) return;
  const startT = performance.now();
  const step = () => {
    const elapsed = performance.now() - startT;
    const t = Math.min(1, elapsed / durationMs);
    const eased = TAP_EASING(t);
    window.scrollTo({ top: startY + dy * eased, behavior: "instant" as ScrollBehavior });
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function isInteractive(target: EventTarget | null): boolean {
  let node = target as HTMLElement | null;
  while (node && node !== document.body) {
    if (INTERACTIVE_TAGS.has(node.tagName)) return true;
    if (node.hasAttribute?.("data-allow-tap")) return true;
    if (node.hasAttribute?.("data-allow-scroll")) return true;
    if (node.getAttribute?.("role") === "button") return true;
    if (node.getAttribute?.("role") === "link") return true;
    const tabIndex = node.getAttribute?.("tabindex");
    if (tabIndex && tabIndex !== "-1") return true;
    if (node.isContentEditable) return true;
    node = node.parentElement;
  }
  return false;
}

// Resolve the section currently in view by closest center distance.
// Uses real DOM offsetTop so it stays accurate when sections vary in height.
function currentSectionIndex(): number {
  if (typeof document === "undefined") return 0;
  const sections = document.querySelectorAll<HTMLElement>(
    "section[data-snap-index]",
  );
  if (sections.length === 0) {
    const vh = window.innerHeight || 1;
    return Math.round(window.scrollY / vh);
  }
  const y = window.scrollY + (window.innerHeight || 0) / 2;
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]!;
    const center = section.offsetTop + section.offsetHeight / 2;
    const d = Math.abs(center - y);
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  }
  return best;
}

function getSectionTop(index: number): number {
  if (typeof document === "undefined") return 0;
  const sections = document.querySelectorAll<HTMLElement>(
    "section[data-snap-index]",
  );
  const target = sections[index];
  if (target) return target.offsetTop;
  if (typeof window === "undefined") return 0;
  return index * (window.innerHeight || 1);
}

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max - 1, value));
}

type TapNavigateOptions = {
  enabled?: boolean;
  loop?: boolean;
};

export function useTapToNavigate(
  lenis: Lenis | null,
  options?: TapNavigateOptions,
): void {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const enabled = options?.enabled ?? true;
  const loop = options?.loop ?? false;

  useEffect(() => {
    if (!enabled) return;
    if (!isMobile) return;
    if (reducedMotion) return;
    if (typeof window === "undefined") return;

    let pointerDownX: number | null = null;
    let pointerDownY: number | null = null;
    let pointerDownTime = 0;

    const SWIPE_THRESHOLD = 12;
    const MAX_TAP_DURATION = 380;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
      pointerDownTime = performance.now();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      if (pointerDownX === null || pointerDownY === null) return;

      const dx = Math.abs(event.clientX - pointerDownX);
      const dy = Math.abs(event.clientY - pointerDownY);
      const duration = performance.now() - pointerDownTime;
      const startX = pointerDownX;
      pointerDownX = null;
      pointerDownY = null;

      // Reject anything that looks like a swipe or a long-press
      if (dx > SWIPE_THRESHOLD || dy > SWIPE_THRESHOLD) return;
      if (duration > MAX_TAP_DURATION) return;
      if (isInteractive(event.target)) return;

      const vw = window.innerWidth || 1;
      const goNext = startX >= vw / 2;
      const current = currentSectionIndex();
      let target: number;
      if (goNext) {
        target = current + 1;
        if (target >= SECTION_COUNT) target = loop ? 0 : current;
      } else {
        target = current - 1;
        if (target < 0) target = loop ? SECTION_COUNT - 1 : current;
      }
      if (target === current) return;

      const top = getSectionTop(clamp(target, SECTION_COUNT));
      if (lenis) {
        lenis.scrollTo(top, { duration: TAP_DURATION_MS / 1000, easing: TAP_EASING });
      } else {
        animateScroll(top, TAP_DURATION_MS);
      }
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointercancel", () => {
      pointerDownX = null;
      pointerDownY = null;
    });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [lenis, enabled, isMobile, reducedMotion, loop]);
}
