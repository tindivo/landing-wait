"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SplitText } from "@/components/motion/SplitText";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap/register";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[5]!;

const YAPE_PURPLE = "#742B8C";
const PLIN_BLUE = "#0066CC";

export function PaymentsSection() {
  const ref = useRef<HTMLElement>(null);
  const blobRef = useRef<SVGSVGElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const yapeCardRef = useRef<HTMLDivElement>(null);
  const yapeStrokeRef = useRef<SVGTextElement>(null);
  const yapeFillRef = useRef<SVGTextElement>(null);
  const yapeBadgeRef = useRef<HTMLSpanElement>(null);
  const cashCardRef = useRef<HTMLDivElement>(null);
  const plinCardRef = useRef<HTMLDivElement>(null);
  const plinStrokeRef = useRef<SVGTextElement>(null);
  const plinFillRef = useRef<SVGTextElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useViewportTimeline(
    ref,
    (tl) => {
      // Defensive: force all cards into visible "end" state. If the timeline
      // is killed before completion (e.g. parent re-render cascade), elements
      // stay visible instead of trapped at opacity:0 from a tl.fromTo "from".
      const headerFades =
        headerRef.current?.querySelectorAll<HTMLElement>("[data-fade]") ?? [];
      gsap.set(headerFades, { opacity: 1, y: 0 });
      if (yapeCardRef.current) {
        gsap.set(yapeCardRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
        });
      }
      if (cashCardRef.current) {
        gsap.set(cashCardRef.current, { opacity: 1, y: 0 });
      }
      if (plinCardRef.current) {
        gsap.set(plinCardRef.current, { opacity: 1, y: 0 });
      }

      if (headerFades.length > 0) {
        tl.fromTo(
          headerFades,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.08,
          },
          0,
        );
      }

      if (yapeCardRef.current) {
        tl.fromTo(
          yapeCardRef.current,
          {
            opacity: 0,
            y: 36,
            scale: 0.94,
            rotateZ: -1.5,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            duration: 0.95,
            ease: "expo.out",
          },
          0.3,
        );
      }

      if (cashCardRef.current) {
        tl.fromTo(
          cashCardRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
          },
          0.55,
        );
      }

      if (plinCardRef.current) {
        tl.fromTo(
          plinCardRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
          },
          0.65,
        );
      }

      if (yapeStrokeRef.current && yapeFillRef.current) {
        gsap.set(yapeStrokeRef.current, {
          strokeDasharray: 400,
          strokeDashoffset: 400,
          opacity: 1,
        });
        gsap.set(yapeFillRef.current, { opacity: 0 });
        tl.to(
          yapeStrokeRef.current,
          { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
          0.8,
        );
        tl.to(
          yapeFillRef.current,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          1.6,
        );
      }

      if (plinStrokeRef.current && plinFillRef.current) {
        gsap.set(plinStrokeRef.current, {
          strokeDasharray: 400,
          strokeDashoffset: 400,
          opacity: 1,
        });
        gsap.set(plinFillRef.current, { opacity: 0 });
        tl.to(
          plinStrokeRef.current,
          { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" },
          1,
        );
        tl.to(
          plinFillRef.current,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          1.75,
        );
      }

      if (yapeCardRef.current && !reducedMotion) {
        tl.to(
          yapeCardRef.current,
          {
            y: -6,
            duration: 4.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
          "+=0.2",
        );
      }

      if (yapeBadgeRef.current && !reducedMotion) {
        tl.to(
          yapeBadgeRef.current,
          {
            scale: 1.06,
            duration: 1.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            transformOrigin: "50% 50%",
          },
          2,
        );
      }

      if (footerRef.current) {
        const chars =
          footerRef.current.querySelectorAll<HTMLElement>(".split-part");
        if (chars.length > 0) {
          tl.from(
            chars,
            {
              opacity: 0,
              duration: 0.001,
              ease: "steps(1)",
              stagger: 0.015,
            },
            1.8,
          );
        }
      }

      if (blobRef.current && !reducedMotion) {
        tl.to(
          blobRef.current,
          {
            rotate: 360,
            duration: 60,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          },
          0,
        );
      }
    },
    { threshold: 0.25, once: true },
  );

  return (
    <SnapSection
      ref={ref}
      id={META.id}
      index={META.index}
      label={META.label}
      theme={META.theme}
    >
      {/* Blob background decorativo */}
      <svg
        ref={blobRef}
        aria-hidden="true"
        viewBox="0 0 600 600"
        className="pointer-events-none absolute -right-32 top-1/2 z-0 h-[500px] w-[500px] -translate-y-1/2 opacity-[0.13] md:-right-20 md:h-[700px] md:w-[700px] md:opacity-[0.15]"
        style={{ willChange: "transform" }}
      >
        <defs>
          <radialGradient id="payments-blob" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="1" />
            <stop offset="60%" stopColor="var(--color-brand)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M421.3 320.9c-21.1 56.9-49.7 117.3-104.9 142.6-55.4 25.4-137.8 15.7-185.5-26.4-47.7-42.2-60.4-116.7-44.2-180.6 16.2-63.8 61.4-117 117.4-138.4 56-21.3 122.6-10.7 169.7 26.4 47.1 37 75 99.4 47.5 176.4z"
          fill="url(#payments-blob)"
        />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[var(--vh-snap)] w-full max-w-7xl flex-col justify-center gap-6 py-10 md:gap-10 md:py-16">
        <div ref={headerRef} className="flex flex-col gap-3 md:gap-4">
          <div data-fade>
            <Eyebrow>{META.eyebrow}</Eyebrow>
          </div>
          <h2
            id={`${META.id}-title`}
            data-fade
            className="font-display font-bold text-[clamp(30px,6vw,88px)] leading-[1.05] text-balance-tight max-w-3xl"
          >
            {META.headline}
          </h2>
          <p
            data-fade
            className="text-sm md:text-xl text-[var(--color-ink-soft)] max-w-xl"
          >
            Tres formas de pagar. Cero tarjetas obligatorias.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.35fr_1fr] md:gap-6">
          {/* Yape hero wrapper (no overflow-hidden — keeps the floating badge visible) */}
          <div className="relative pt-3">
            <span
              ref={yapeBadgeRef}
              className="absolute right-5 top-0 z-20 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-md md:px-3.5 md:py-1.5"
              style={{ willChange: "transform" }}
            >
              <span aria-hidden="true">🔥</span>
              Más usado
            </span>

            <article
              ref={yapeCardRef}
              className="relative flex flex-col gap-5 overflow-hidden rounded-[24px] border border-[var(--color-divider)] p-6 shadow-[0_24px_60px_-25px_rgba(249,115,22,0.4)] md:gap-7 md:rounded-[28px] md:p-10"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-card) 0%, var(--color-card) 55%, color-mix(in srgb, var(--color-brand-soft) 65%, var(--color-card)) 100%)",
                willChange: "transform",
              }}
            >
              {/* Decorative corner accent */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--color-brand)] opacity-[0.08] blur-2xl md:-right-16 md:-top-16 md:h-48 md:w-48"
              />


            <div className="flex items-end justify-between">
              <svg
                viewBox="0 0 220 64"
                className="h-[52px] w-[160px] md:h-[68px] md:w-[210px]"
                aria-label="Yape"
              >
                <text
                  ref={yapeStrokeRef}
                  x="0"
                  y="52"
                  fontSize="58"
                  fontFamily="var(--font-display)"
                  fontWeight="700"
                  fill="transparent"
                  stroke={YAPE_PURPLE}
                  strokeWidth="1.6"
                >
                  Yape
                </text>
                <text
                  ref={yapeFillRef}
                  x="0"
                  y="52"
                  fontSize="58"
                  fontFamily="var(--font-display)"
                  fontWeight="700"
                  fill={YAPE_PURPLE}
                >
                  Yape
                </text>
              </svg>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)] md:text-[11px]"
                aria-hidden="true"
              >
                Prepago
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)] md:text-3xl">
                Prepago con Yape
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)] md:text-base md:leading-relaxed">
                Escanea el QR del motorizado o paga desde tu app antes. Sale
                más rápido y aseguras tu pedido.
              </p>
            </div>
            </article>
          </div>

          {/* Right column: Cash + Plin satellites */}
          <div className="flex flex-col gap-4 md:gap-6">
            <article
              ref={cashCardRef}
              className="relative flex flex-1 flex-col gap-3 rounded-[22px] border border-[var(--color-divider)] bg-[var(--color-card)] p-5 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md md:gap-4 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-soft)] font-display text-2xl font-bold text-[var(--color-brand-deep)] md:h-14 md:w-14 md:text-3xl"
                >
                  S/
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)] md:text-[11px]">
                  Contraentrega
                </span>
              </div>
              <h3 className="font-display text-lg font-bold leading-tight text-[var(--color-ink)] md:text-xl">
                Efectivo en la puerta
              </h3>
              <p className="text-xs leading-snug text-[var(--color-ink-soft)] md:text-sm md:leading-normal">
                Pagas cuando el motorizado llega. Como toda la vida.
              </p>
            </article>

            <article
              ref={plinCardRef}
              className="relative flex flex-1 flex-col gap-3 rounded-[22px] border border-[var(--color-divider)] bg-[var(--color-card)] p-5 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md md:gap-4 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl md:h-14 md:w-14"
                  style={{ background: "rgba(0, 102, 204, 0.12)" }}
                >
                  <svg
                    viewBox="0 0 160 56"
                    className="h-[26px] w-[60px] md:h-[30px] md:w-[68px]"
                    aria-label="Plin"
                  >
                    <text
                      ref={plinStrokeRef}
                      x="0"
                      y="42"
                      fontSize="46"
                      fontFamily="var(--font-display)"
                      fontWeight="700"
                      fill="transparent"
                      stroke={PLIN_BLUE}
                      strokeWidth="1.6"
                    >
                      Plin
                    </text>
                    <text
                      ref={plinFillRef}
                      x="0"
                      y="42"
                      fontSize="46"
                      fontFamily="var(--font-display)"
                      fontWeight="700"
                      fill={PLIN_BLUE}
                    >
                      Plin
                    </text>
                  </svg>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)] md:text-[11px]">
                  Prepago
                </span>
              </div>
              <h3 className="font-display text-lg font-bold leading-tight text-[var(--color-ink)] md:text-xl">
                Prepago con Plin
              </h3>
              <p className="text-xs leading-snug text-[var(--color-ink-soft)] md:text-sm md:leading-normal">
                Misma agilidad que con Yape, si ese es tu banco.
              </p>
            </article>
          </div>
        </div>

        <div ref={footerRef}>
          <SplitText
            as="p"
            by="char"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)] md:text-[11px]"
          >
            {`Sin sorpresas. Sin propinas escondidas. Sin "para la coca del motorizado".`}
          </SplitText>
        </div>
      </div>
    </SnapSection>
  );
}
