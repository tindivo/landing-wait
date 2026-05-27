"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { SECTION_COUNT } from "@/lib/data/sections";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

const SNAP_DURATION = 0.95;
const SNAP_EASING = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function clamp(index: number, count: number): number {
  return Math.max(0, Math.min(count - 1, index));
}

// Resolve the real top offset of section[index]. Falls back to index*vh only
// if the DOM hasn't laid out the sections yet — but with real DOM available
// this is what makes snap land EXACTLY at the section top regardless of
// per-section height variance (mobile sections often exceed vh).
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

// Resolve the section index currently in view by finding the section whose
// offsetTop is closest to (and not past) the current scrollY. Uses real DOM
// positions so it stays accurate even when sections vary in height.
function getCurrentIndex(): number {
  if (typeof document === "undefined" || typeof window === "undefined") return 0;
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

export function scrollToSection(lenis: Lenis | null, index: number): void {
  if (typeof window === "undefined") return;
  const clamped = clamp(index, SECTION_COUNT);
  const target = getSectionTop(clamped);
  if (lenis) {
    lenis.scrollTo(target, { duration: SNAP_DURATION, easing: SNAP_EASING });
    return;
  }
  window.scrollTo({ top: target, behavior: "smooth" });
}

// Legacy passive-snap. New code should prefer useFullpageSnap.
export function setupSnap(
  lenis: Lenis | null,
  sectionCount: number,
): () => void {
  if (!lenis || typeof window === "undefined") return () => {};

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastScrollY = window.scrollY;

  const snapToNearest = () => {
    const idx = clamp(getCurrentIndex(), sectionCount);
    const target = getSectionTop(idx);
    if (Math.abs(window.scrollY - target) < 4) return;
    lenis.scrollTo(target, { duration: 0.9 });
  };

  const schedule = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      if (delta < 2) snapToNearest();
    }, 180);
  };

  const onWheel = () => schedule();
  const onTouchEnd = () => schedule();
  const onScroll = () => {
    lastScrollY = window.scrollY;
    schedule();
  };

  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("scroll", onScroll);
  };
}

type FullpageSnapOptions = {
  enabled?: boolean;
  lockMs?: number;
  wheelAccumulatorThreshold?: number;
  wheelResetMs?: number;
  touchThreshold?: number;
};

const DEFAULTS = {
  lockMs: 950,
  // Accumulator threshold (px). Trackpads tick at 3–15px per wheel event;
  // a mouse wheel fires ~100px in a single event. 30 captures both: 3–4 fast
  // trackpad ticks accumulate past it, a single mouse wheel exceeds it instantly.
  wheelAccumulatorThreshold: 30,
  // If no wheel event arrives within this window, the accumulator resets —
  // prevents stale deltas from triggering snap minutes later.
  wheelResetMs: 150,
  touchThreshold: 48,
};

// Fullpage-style snap: a single wheel tick / swipe jumps exactly one section.
// Lenis handles the smooth animation; we lock further input until it lands
// so cumulative scrolls don't fly past targets.
export function useFullpageSnap(
  lenis: Lenis | null,
  options?: FullpageSnapOptions,
): void {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const enabled = options?.enabled ?? true;
  const lockMs = options?.lockMs ?? DEFAULTS.lockMs;
  const wheelAccumulatorThreshold =
    options?.wheelAccumulatorThreshold ?? DEFAULTS.wheelAccumulatorThreshold;
  const wheelResetMs = options?.wheelResetMs ?? DEFAULTS.wheelResetMs;
  const touchThreshold = options?.touchThreshold ?? DEFAULTS.touchThreshold;

  useEffect(() => {
    if (!enabled) return;
    if (reducedMotion) return;
    if (isMobile) return;
    if (typeof window === "undefined") return;

    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;
    let touchStartY: number | null = null;

    // Wheel accumulator: small trackpad deltas sum into a buffer until they
    // cross the threshold. A single big mouse wheel also crosses instantly.
    let wheelAccumulator = 0;
    let wheelResetTimer: ReturnType<typeof setTimeout> | null = null;

    const resetAccumulator = () => {
      wheelAccumulator = 0;
      if (wheelResetTimer !== null) {
        clearTimeout(wheelResetTimer);
        wheelResetTimer = null;
      }
    };

    const acquireLock = () => {
      locked = true;
      if (lockTimer !== null) clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        locked = false;
        lockTimer = null;
      }, lockMs);
    };

    const goTo = (direction: 1 | -1) => {
      const current = getCurrentIndex();
      const target = clamp(current + direction, SECTION_COUNT);
      if (target === current) return;
      acquireLock();
      scrollToSection(lenis, target);
    };

    const isScrollableInside = (target: EventTarget | null): boolean => {
      let node = target as HTMLElement | null;
      while (node && node !== document.body) {
        const tag = node.tagName;
        if (tag === "TEXTAREA" || tag === "SELECT") return true;
        if (node.hasAttribute?.("data-allow-scroll")) return true;
        node = node.parentElement;
      }
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (isScrollableInside(event.target)) return;
      // Always preempt the event so Lenis (its own wheel listener) doesn't
      // double-process this delta and fight the in-flight snap scroll.
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (locked) return;

      wheelAccumulator += event.deltaY;

      if (wheelResetTimer !== null) clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(resetAccumulator, wheelResetMs);

      if (Math.abs(wheelAccumulator) >= wheelAccumulatorThreshold) {
        const direction = wheelAccumulator > 0 ? 1 : -1;
        resetAccumulator();
        goTo(direction);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      const t = event.touches[0];
      touchStartY = t ? t.clientY : null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const t = event.changedTouches[0];
      if (!t) return;
      const dy = touchStartY - t.clientY;
      touchStartY = null;
      if (Math.abs(dy) < touchThreshold) return;
      if (locked) return;
      goTo(dy > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (lockTimer !== null) clearTimeout(lockTimer);
      if (wheelResetTimer !== null) clearTimeout(wheelResetTimer);
    };
  }, [
    lenis,
    enabled,
    reducedMotion,
    isMobile,
    lockMs,
    wheelAccumulatorThreshold,
    wheelResetMs,
    touchThreshold,
  ]);
}
