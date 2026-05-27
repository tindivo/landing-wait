"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap/register";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[3]!;

export function RestaurantsSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useViewportTimeline(
    ref,
    (tl) => {
      if (headerRef.current) {
        tl.from(
          headerRef.current.querySelectorAll<HTMLElement>("[data-fade]"),
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.1,
          },
          0,
        );
      }

      if (cardRef.current) {
        gsap.set(cardRef.current, { transformPerspective: 900 });
        tl.from(
          cardRef.current,
          {
            opacity: 0,
            y: 40,
            scale: 0.92,
            duration: 1,
            ease: "expo.out",
          },
          0.3,
        );

        if (!reducedMotion) {
          gsap.to(cardRef.current, {
            y: -8,
            duration: 4.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1.2,
          });
        }
      }

      if (iconRef.current && !reducedMotion) {
        gsap.to(iconRef.current, {
          scale: 1.08,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.4,
          transformOrigin: "50% 50%",
        });
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
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:gap-12 md:py-28">
        <div ref={headerRef} className="flex flex-col gap-5 md:gap-6">
          <div data-fade>
            <Eyebrow>{META.eyebrow}</Eyebrow>
          </div>
          <h2
            id={`${META.id}-title`}
            data-fade
            className="font-display font-bold text-[clamp(34px,5vw,76px)] leading-[1.05] text-balance-tight"
          >
            {META.headline}
          </h2>
          <p
            data-fade
            className="text-base md:text-xl text-[var(--color-ink-soft)] max-w-md"
          >
            Estamos cerrando los acuerdos con los mejores restaurantes de San
            Jacinto. Muy pronto vas a poder pedir desde la app.
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            ref={cardRef}
            className="relative w-full max-w-[360px] overflow-hidden rounded-[22px] border-2 border-dashed border-[var(--color-ink-faint)] bg-[var(--color-card)] shadow-sm"
            style={{ aspectRatio: "3 / 4", willChange: "transform" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
              <span
                ref={iconRef}
                aria-hidden="true"
                className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-brand-soft)] font-display text-[88px] font-bold leading-none text-[var(--color-brand)] md:h-32 md:w-32 md:text-[96px]"
                style={{ willChange: "transform" }}
              >
                ?
              </span>
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-muted)]">
                  Próximamente
                </p>
                <p className="font-display text-3xl font-bold text-[var(--color-ink)]">
                  Pronto
                </p>
              </div>
              <p className="max-w-[240px] text-sm text-[var(--color-ink-soft)]">
                Estamos sumando restaurantes. Si tienes uno, escríbenos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SnapSection>
  );
}
