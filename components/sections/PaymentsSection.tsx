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

type Step = {
  id: string;
  number: string;
  title: string;
  body: string;
  icon: string;
};

const STEPS: Step[] = [
  {
    id: "order",
    number: "01",
    title: "Pides tu comida",
    body: "Eliges desde tindivo.com lo que quieres pedir del restaurante.",
    icon: "🍕",
  },
  {
    id: "pay",
    number: "02",
    title: "Pagas con Yape o Plin",
    body: "Escaneas el QR del restaurante y pagas en segundos.",
    icon: "💸",
  },
  {
    id: "capture",
    number: "03",
    title: "Mandas la captura",
    body: "Envías el pantallazo de Yape o Plin para confirmar tu pago.",
    icon: "📸",
  },
  {
    id: "prepare",
    number: "04",
    title: "El restaurante prepara",
    body: "Con el pago confirmado salen a cocinar. Tu motorizado sale apenas esté listo.",
    icon: "👨‍🍳",
  },
];

export function PaymentsSection() {
  const ref = useRef<HTMLElement>(null);
  const blobRef = useRef<SVGSVGElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLOListElement>(null);
  const yapeStrokeRef = useRef<SVGTextElement>(null);
  const yapeFillRef = useRef<SVGTextElement>(null);
  const plinStrokeRef = useRef<SVGTextElement>(null);
  const plinFillRef = useRef<SVGTextElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useViewportTimeline(
    ref,
    (tl) => {
      // Defensive end-state so cards never get stuck invisible if timeline kills early.
      const headerFades =
        headerRef.current?.querySelectorAll<HTMLElement>("[data-fade]") ?? [];
      const steps = flowRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [];
      const numbers = flowRef.current?.querySelectorAll<HTMLElement>("[data-step-number]") ?? [];

      gsap.set(headerFades, { opacity: 1, y: 0 });
      gsap.set(steps, { opacity: 1, y: 0 });
      gsap.set(numbers, { opacity: 1, scale: 1 });

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

      if (lineRef.current) {
        const length = 600;
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(
          lineRef.current,
          {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: "power1.inOut",
          },
          0.35,
        );
      }

      steps.forEach((step, i) => {
        const number = numbers[i];
        const start = 0.45 + i * 0.4;

        if (number) {
          tl.fromTo(
            number,
            { opacity: 0, scale: 0.55 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: "back.out(1.6)",
              transformOrigin: "50% 50%",
            },
            start,
          );
        }

        tl.fromTo(
          step,
          { opacity: 0, x: -18 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "expo.out",
          },
          start + 0.1,
        );
      });

      if (yapeStrokeRef.current && yapeFillRef.current) {
        gsap.set(yapeStrokeRef.current, {
          strokeDasharray: 400,
          strokeDashoffset: 400,
          opacity: 1,
        });
        gsap.set(yapeFillRef.current, { opacity: 1 });
        tl.to(
          yapeStrokeRef.current,
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
          1.05,
        );
      }

      if (plinStrokeRef.current && plinFillRef.current) {
        gsap.set(plinStrokeRef.current, {
          strokeDasharray: 400,
          strokeDashoffset: 400,
          opacity: 1,
        });
        gsap.set(plinFillRef.current, { opacity: 1 });
        tl.to(
          plinStrokeRef.current,
          { strokeDashoffset: 0, duration: 0.85, ease: "power2.inOut" },
          1.2,
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
              stagger: 0.012,
            },
            2.3,
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
    { threshold: 0.2, once: true },
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
        className="pointer-events-none absolute -right-32 top-1/2 z-0 h-[500px] w-[500px] -translate-y-1/2 opacity-[0.12] md:-right-24 md:h-[760px] md:w-[760px] md:opacity-[0.14]"
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

      <div className="relative z-10 mx-auto flex min-h-[var(--vh-snap)] w-full max-w-6xl flex-col justify-center gap-6 py-10 md:gap-10 md:py-16">
        <div ref={headerRef} className="flex flex-col gap-3 md:gap-4">
          <div data-fade>
            <Eyebrow>{META.eyebrow}</Eyebrow>
          </div>
          <h2
            id={`${META.id}-title`}
            data-fade
            className="font-display font-bold text-[clamp(28px,5.4vw,76px)] leading-[1.05] text-balance-tight max-w-3xl"
          >
            Asegura tu pedido con
            {" "}
            <span className="inline-flex items-baseline gap-1">
              <span style={{ color: YAPE_PURPLE }}>Yape</span>
              <span className="text-[var(--color-ink-muted)]">·</span>
              <span style={{ color: PLIN_BLUE }}>Plin</span>
            </span>
            .
          </h2>
          <p
            data-fade
            className="text-sm md:text-lg text-[var(--color-ink-soft)] max-w-xl"
          >
            Pagas, mandas tu captura, y el restaurante ya empieza a preparar.
            Tan simple como eso.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector line — visible across all viewports */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[28px] top-2 -z-0 h-[calc(100%-1rem)] w-[2px] md:left-[34px]"
            preserveAspectRatio="none"
            viewBox="0 0 2 600"
          >
            <line
              ref={lineRef}
              x1="1"
              y1="0"
              x2="1"
              y2="600"
              stroke="var(--color-brand)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="0"
              strokeOpacity="0.35"
            />
          </svg>

          <ol ref={flowRef} className="relative z-10 flex flex-col gap-6 md:gap-8">
            {STEPS.map((step, i) => (
              <li
                key={step.id}
                data-step
                className="flex items-start gap-4 md:gap-6"
              >
                <span
                  data-step-number
                  aria-hidden="true"
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] font-display text-xl font-bold text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.55)] md:h-[68px] md:w-[68px] md:text-2xl"
                >
                  {step.number}
                </span>

                <div className="flex flex-1 flex-col gap-1.5 pt-1.5 md:gap-2 md:pt-2.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-bold leading-tight text-[var(--color-ink)] md:text-2xl">
                      <span aria-hidden="true" className="mr-2 md:mr-2.5">
                        {step.icon}
                      </span>
                      {step.title}
                    </h3>
                    {i === 1 && (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          viewBox="0 0 160 56"
                          className="h-[22px] w-[64px] md:h-[26px] md:w-[80px]"
                          aria-label="Yape"
                        >
                          <text
                            ref={yapeStrokeRef}
                            x="0"
                            y="42"
                            fontSize="46"
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
                            y="42"
                            fontSize="46"
                            fontFamily="var(--font-display)"
                            fontWeight="700"
                            fill={YAPE_PURPLE}
                          >
                            Yape
                          </text>
                        </svg>
                        <svg
                          viewBox="0 0 160 56"
                          className="h-[22px] w-[60px] md:h-[26px] md:w-[72px]"
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
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-ink-soft)] md:text-base">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
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
