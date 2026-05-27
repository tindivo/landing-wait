"use client";

import { type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./register";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type ScrollOptions = Omit<ScrollTrigger.Vars, "trigger" | "animation">;

type TimelineBuilder = (timeline: gsap.core.Timeline) => void;

export function useSectionTimeline<T extends HTMLElement>(
  ref: RefObject<T | null>,
  build: TimelineBuilder,
  scrollTriggerOptions?: ScrollOptions,
): void {
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reducedMotion) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          ...scrollTriggerOptions,
        },
      });

      build(timeline);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: ref, dependencies: [reducedMotion] },
  );
}
