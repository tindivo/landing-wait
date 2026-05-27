"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { gsap } from "@/lib/gsap/register";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[6]!;

const SEGMENTS = [
  "2x1 Pizza",
  "S/ 5 OFF",
  "Delivery GRATIS",
  "+10 puntos",
  "Combo Familiar",
  "Postre GRATIS",
];

export function RewardsSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLHeadingElement>(null);
  const pointsCardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const mounted = useIsMounted();
  const wheelAnimating = mounted && !reducedMotion;

  useViewportTimeline(
    ref,
    (tl) => {
      if (headerRef.current) {
        tl.from(
          headerRef.current.querySelectorAll<HTMLElement>("[data-fade]"),
          { opacity: 0, y: 20, duration: 0.7, ease: "expo.out", stagger: 0.1 },
          0,
        );
      }

      const lines =
        linesRef.current?.querySelectorAll<HTMLElement>("[data-line]") ?? [];
      if (lines.length > 0) {
        tl.from(
          lines,
          {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "expo.out",
            stagger: 0.12,
          },
          0.2,
        );
      }

      if (pointsCardRef.current) {
        tl.from(
          pointsCardRef.current,
          { opacity: 0, y: 24, duration: 0.7, ease: "expo.out" },
          0.7,
        );
      }

      if (counterRef.current) {
        const counter = { val: 0 };
        tl.to(
          counter,
          {
            val: 240,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = Math.round(counter.val).toString();
              }
            },
          },
          0.9,
        );
      }

      if (barRef.current) {
        gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left center" });
        tl.to(
          barRef.current,
          { scaleX: 0.75, duration: 1.2, ease: "expo.out" },
          0.9,
        );
      }

      if (wheelRef.current) {
        gsap.set(wheelRef.current, { transformOrigin: "50% 50%" });
        tl.from(
          wheelRef.current,
          {
            scale: 0.5,
            rotate: -45,
            opacity: 0,
            duration: 1.4,
            ease: "back.out(1.4)",
          },
          0.4,
        );
      }

      const segments =
        segmentsRef.current?.querySelectorAll<HTMLElement>("[data-segment]") ?? [];
      if (segments.length > 0) {
        tl.from(
          segments,
          {
            opacity: 0,
            scale: 0.6,
            duration: 0.5,
            ease: "back.out(1.6)",
            stagger: 0.06,
          },
          1.1,
        );
      }
    },
    { threshold: 0.3, once: true },
  );

  return (
    <SnapSection
      ref={ref}
      id={META.id}
      index={META.index}
      label={META.label}
      theme={META.theme}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 py-10 md:grid-cols-2 md:gap-12 md:py-28">
        <div className="flex flex-col gap-4 md:gap-6">
          <div ref={headerRef}>
            <div data-fade>
              <Eyebrow>{META.eyebrow}</Eyebrow>
            </div>
          </div>
          <h2
            id={`${META.id}-title`}
            ref={linesRef}
            className="font-display font-bold text-[clamp(30px,6.2vw,92px)] leading-[1.02]"
          >
            <span data-line className="block">Pide más.</span>
            <span data-line className="block">Paga menos.</span>
            <span data-line className="block">Repite.</span>
          </h2>
          <p className="text-sm md:text-xl text-[var(--color-ink-soft)] max-w-md">
            Promos semanales, descuentos por barrio y un sistema de
            fidelización que te premia por volver. Porque aquí te conocemos.
          </p>

          <div
            ref={pointsCardRef}
            className="rounded-[18px] bg-[var(--color-card)] p-4 shadow-sm border border-[var(--color-divider)] w-full md:rounded-[22px] md:p-5 md:max-w-sm"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Tus puntos
            </p>
            <p
              ref={counterRef}
              className="font-display text-4xl font-bold text-[var(--color-brand)] mt-1 md:text-5xl"
              aria-live="polite"
            >
              0
            </p>
            <div className="mt-3 h-2 rounded-full bg-[var(--color-ink-faint)] overflow-hidden">
              <div
                ref={barRef}
                className="h-full w-full bg-[var(--color-brand)] rounded-full"
                style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
              Próxima recompensa: Postre GRATIS · 60 puntos restantes
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            ref={wheelRef}
            className="relative aspect-square"
            style={{ width: "min(280px, 70vw)", maxWidth: 420, height: "auto" }}
          >
            <div
              className="absolute inset-0 rounded-full border-[10px] border-[var(--color-brand)]"
              style={{
                background: `conic-gradient(from 0deg, var(--color-brand-soft), var(--color-card), var(--color-brand-soft), var(--color-card), var(--color-brand-soft), var(--color-card))`,
                animation: "spin 30s linear infinite",
                animationPlayState: wheelAnimating ? "running" : "paused",
                willChange: wheelAnimating ? "transform" : "auto",
              }}
            />
            <div className="absolute inset-12 rounded-full bg-[var(--color-card)] flex items-center justify-center shadow-inner">
              <p className="font-display text-xl md:text-2xl font-bold text-center px-6">
                Gira y gana
              </p>
            </div>
            <div ref={segmentsRef} className="absolute inset-0">
              {SEGMENTS.map((seg, i) => {
                const angle = (i / SEGMENTS.length) * 360;
                return (
                  <div
                    key={seg}
                    data-segment
                    className="absolute left-1/2 top-1/2 rounded-full bg-[#1A1614] px-2 py-0.5 md:px-3 md:py-1.5 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.14em] text-[#FAF6F1] whitespace-nowrap"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`,
                    }}
                  >
                    {seg}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SnapSection>
  );
}
