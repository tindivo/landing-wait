"use client";

import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "./register";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type TimelineBuilder = (timeline: gsap.core.Timeline) => void;

type ViewportTimelineOptions = {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
};

export function useViewportTimeline<T extends HTMLElement>(
  ref: RefObject<T | null>,
  build: TimelineBuilder,
  options?: ViewportTimelineOptions,
): void {
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      if (reducedMotion) return;
      if (typeof IntersectionObserver === "undefined") {
        const tl = gsap.timeline();
        build(tl);
        timelineRef.current = tl;
        return () => {
          tl.kill();
          timelineRef.current = null;
        };
      }

      const threshold = options?.threshold ?? 0.3;
      const once = options?.once ?? true;
      const rootMargin = options?.rootMargin ?? "0px";

      const timeline = gsap.timeline({ paused: true });
      build(timeline);
      timelineRef.current = timeline;

      let played = false;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
              if (once && played) continue;
              played = true;
              timeline.play(0);
              if (once) observer.unobserve(element);
            } else if (!once && !entry.isIntersecting) {
              timeline.pause(0);
            }
          }
        },
        { threshold: [0, threshold, 1], rootMargin },
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
        timeline.kill();
        timelineRef.current = null;
      };
    },
    { scope: ref, dependencies: [reducedMotion] },
  );
}
