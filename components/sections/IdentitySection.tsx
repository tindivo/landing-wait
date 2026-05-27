"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SplitText } from "@/components/motion/SplitText";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { gsap } from "@/lib/gsap/register";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[1]!;

const CHIPS = ["🍕 Pronto", "🛵 Pronto", "📱 Pronto"];

export function IdentitySection() {
  const ref = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const dotGlowRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useViewportTimeline(
    ref,
    (tl) => {
      if (eyebrowRef.current) {
        tl.from(
          eyebrowRef.current,
          { opacity: 0, y: -10, duration: 0.5, ease: "expo.out" },
          0,
        );
      }
      const chars = wordRef.current?.querySelectorAll<HTMLElement>(".split-part");
      if (chars && chars.length > 0) {
        gsap.set(chars, { transformOrigin: "50% 100%" });
        tl.from(
          chars,
          {
            scale: 0.3,
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: "back.out(1.6)",
            stagger: 0.08,
          },
          0.1,
        );
      }
      if (dotRef.current) {
        tl.from(
          dotRef.current,
          {
            scale: 0,
            opacity: 0,
            duration: 0.55,
            ease: "back.out(2.2)",
          },
          0.7,
        );
      }
      if (subRef.current) {
        tl.from(
          subRef.current,
          { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" },
          1.1,
        );
      }
      const chips = chipsRef.current?.querySelectorAll<HTMLElement>("[data-chip]");
      if (chips && chips.length > 0) {
        tl.from(
          chips,
          {
            opacity: 0,
            y: 16,
            scale: 0.92,
            duration: 0.45,
            ease: "back.out(1.4)",
            stagger: 0.08,
          },
          1.3,
        );
      }
    },
    { threshold: 0.3, once: true },
  );

  useViewportTimeline(
    ref,
    (tl) => {
      if (dotRef.current && dotGlowRef.current) {
        tl.to(
          dotRef.current,
          {
            scale: 1.55,
            duration: 0.18,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          },
          0.55,
        );
        tl.fromTo(
          dotGlowRef.current,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 3, duration: 0.4, ease: "power2.out" },
          0.55,
        );
        tl.to(
          dotGlowRef.current,
          { opacity: 0, duration: 0.5, ease: "power2.in" },
          0.95,
        );
      }
    },
    { threshold: 0.5, once: true },
  );

  return (
    <SnapSection
      ref={ref}
      id={META.id}
      index={META.index}
      label={META.label}
      theme={META.theme}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 py-20 md:py-28 text-center">
        <div ref={eyebrowRef}>
          <Eyebrow className="text-[#FAF6F1]/70">
            {META.eyebrow}
          </Eyebrow>
        </div>
        <h2
          id={`${META.id}-title`}
          className="relative font-display font-bold text-[clamp(88px,18vw,240px)] leading-[0.85] tracking-[-0.04em]"
        >
          <span ref={wordRef} className="inline-block">
            <SplitText as="span" by="char">tindivo</SplitText>
          </span>
          <span ref={dotRef} className="relative inline-block text-[var(--color-brand)]">
            .
            <span
              ref={dotGlowRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[0.6em] w-[0.6em] rounded-full bg-[var(--color-brand)] opacity-0 blur-[40px]"
            />
          </span>
        </h2>
        <p
          ref={subRef}
          className="max-w-2xl text-base md:text-2xl text-[#FAF6F1]/85"
        >
          Delivery hiperlocal para San Jacinto, Áncash. Hecho por gente del
          barrio, para gente del barrio.
        </p>
        <div
          ref={chipsRef}
          className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#FAF6F1]/80"
        >
          {CHIPS.map((chip) => (
            <span
              key={chip}
              data-chip
              className="rounded-full bg-[#FAF6F1]/10 px-4 py-2"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </SnapSection>
  );
}
