"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Wordmark } from "@/components/brand/Wordmark";
import { SplitText } from "@/components/motion/SplitText";
import { HeroCanvas } from "@/components/webgl/HeroCanvas";
import { useSectionTimeline } from "@/lib/gsap/useSectionTimeline";
import { gsap, useGSAP } from "@/lib/gsap/register";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[0]!;

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      const tl = gsap.timeline({ delay: 0.1 });

      if (wordmarkRef.current) {
        tl.from(
          wordmarkRef.current,
          { opacity: 0, y: -12, duration: 0.7, ease: "expo.out" },
          0,
        );
      }
      if (eyebrowRef.current) {
        tl.from(
          eyebrowRef.current,
          { opacity: 0, y: -8, duration: 0.7, ease: "expo.out" },
          0.1,
        );
      }
      const chars = headlineRef.current?.querySelectorAll<HTMLElement>(".split-part");
      if (chars && chars.length > 0) {
        gsap.set(chars, { transformPerspective: 900, transformOrigin: "50% 100%" });
        tl.from(
          chars,
          {
            y: 80,
            rotateX: -90,
            opacity: 0,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.025,
          },
          0.4,
        );
      }
      if (subRef.current) {
        tl.from(
          subRef.current,
          {
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.8,
            ease: "power2.out",
          },
          1.6,
        );
      }
      if (scrollCueRef.current) {
        tl.from(
          scrollCueRef.current,
          { opacity: 0, y: 10, duration: 0.6, ease: "power2.out" },
          3,
        );
      }
    },
    { scope: ref, dependencies: [reducedMotion] },
  );

  useSectionTimeline(
    ref,
    (tl) => {
      if (contentRef.current) {
        tl.to(contentRef.current, {
          y: -80,
          opacity: 0.4,
          ease: "none",
        });
      }
    },
    { start: "top top", end: "bottom top", scrub: 0.6 },
  );

  return (
    <SnapSection
      ref={ref}
      id={META.id}
      index={META.index}
      label={META.label}
      theme={META.theme}
      fullBleed
    >
      <HeroCanvas className="absolute inset-0" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--color-surface)]/55 to-transparent"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between px-5 py-16 md:px-10 md:py-28 lg:px-16"
      >
        <div className="flex items-start justify-between">
          <div ref={wordmarkRef}>
            <Wordmark size="md" withCursor href="#inicio" />
          </div>
          <div ref={eyebrowRef}>
            <Eyebrow className="text-right">{META.eyebrow}</Eyebrow>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h1 id={`${META.id}-title`} className="sr-only">
            {META.headline}
          </h1>
          <div ref={headlineRef}>
            <SplitText
              as="span"
              by="char"
              className="font-display font-bold text-balance-tight block max-w-5xl text-[clamp(40px,11vw,160px)] leading-[0.92]"
            >
              {META.headline}
            </SplitText>
          </div>
          <p
            ref={subRef}
            className="font-sans text-base md:text-2xl text-[var(--color-ink-soft)] max-w-xl"
          >
            Una manera nueva de pedir lo que ya pedías siempre.
          </p>
        </div>

        <div className="flex items-end justify-end">
          <p
            ref={scrollCueRef}
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.22em] text-[var(--color-ink-soft)]"
            style={{ animation: "scroll-cue 2s ease-in-out infinite" }}
          >
            ↓ Descubre más
          </p>
        </div>
      </div>
    </SnapSection>
  );
}
