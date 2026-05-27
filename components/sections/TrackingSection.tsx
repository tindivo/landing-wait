"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { gsap } from "@/lib/gsap/register";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[4]!;

const STATES = [
  { icon: "📋", label: "Recibido" },
  { icon: "👨‍🍳", label: "Cocinando" },
  { icon: "🛵", label: "En camino" },
  { icon: "🏠", label: "Entregado" },
];

const PATH_D = "M 30 280 Q 100 220, 80 150 T 170 40";

export function TrackingSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<SVGTextElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathProgressRef = useRef<SVGPathElement>(null);
  const statesRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

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

      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(
          pathRef.current,
          { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" },
          0.4,
        );
      }
    },
    { threshold: 0.25, once: true },
  );

  useViewportTimeline(
    ref,
    (tl) => {
      const states =
        statesRef.current?.querySelectorAll<HTMLElement>("[data-state]") ?? [];
      const confettiParticles =
        confettiRef.current?.querySelectorAll<HTMLElement>("[data-particle]") ?? [];

      gsap.set(states, {
        backgroundColor: "var(--color-ink-faint)",
        color: "var(--color-ink-soft)",
      });
      gsap.set(confettiParticles, { opacity: 0, scale: 0, x: 0, y: 0 });

      let progressLength = 0;
      if (pathProgressRef.current) {
        progressLength = pathProgressRef.current.getTotalLength();
        gsap.set(pathProgressRef.current, {
          strokeDasharray: progressLength,
          strokeDashoffset: progressLength,
        });
      }

      const RUN_DURATION = 3.5;
      const PAUSE_END = 1.2;
      const TOTAL = RUN_DURATION + PAUSE_END;

      tl.repeat(-1).repeatDelay(0);

      tl.add("start", 0);

      if (moverRef.current && pathRef.current) {
        // Drive the mover along the real SVG path using getPointAtLength.
        // Anchor via x/y SVG attrs (text element) reset to 0 so we can use
        // gsap transforms cleanly; mover stays as an SVG <text> for the emoji.
        gsap.set(moverRef.current, { attr: { x: 0, y: 0 } });
        const pathEl = pathRef.current;
        const totalLength = pathEl.getTotalLength();
        const proxy = { t: 0 };
        tl.to(
          proxy,
          {
            t: 1,
            duration: RUN_DURATION,
            ease: "power1.inOut",
            onUpdate: () => {
              const point = pathEl.getPointAtLength(proxy.t * totalLength);
              if (moverRef.current) {
                gsap.set(moverRef.current, { x: point.x, y: point.y });
              }
              if (pathProgressRef.current && progressLength > 0) {
                gsap.set(pathProgressRef.current, {
                  strokeDashoffset: progressLength * (1 - proxy.t),
                });
              }
            },
            onComplete: () => {
              proxy.t = 0;
            },
          },
          "start",
        );
      }

      states.forEach((card, i) => {
        const triggerTime = (i + 1) * (RUN_DURATION / states.length) * 0.95;
        tl.to(
          card,
          {
            backgroundColor: "var(--color-brand)",
            color: "#ffffff",
            duration: 0.001,
            ease: "steps(1)",
          },
          triggerTime,
        );
      });

      if (confettiParticles.length > 0) {
        tl.to(
          confettiParticles,
          {
            opacity: 1,
            scale: 1,
            duration: 0.001,
            stagger: 0.02,
          },
          RUN_DURATION - 0.1,
        );
        confettiParticles.forEach((p, i) => {
          const angle = (i / confettiParticles.length) * Math.PI * 2;
          tl.to(
            p,
            {
              x: Math.cos(angle) * 50,
              y: Math.sin(angle) * 50 - 24,
              opacity: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            RUN_DURATION - 0.05,
          );
        });
      }

      tl.to(
        states,
        {
          backgroundColor: "var(--color-ink-faint)",
          color: "var(--color-ink-soft)",
          duration: 0.001,
          ease: "steps(1)",
        },
        TOTAL - 0.001,
      );
      tl.set(confettiParticles, { opacity: 0, scale: 0, x: 0, y: 0 }, TOTAL - 0.001);
      if (pathProgressRef.current && progressLength > 0) {
        tl.set(
          pathProgressRef.current,
          { strokeDashoffset: progressLength },
          TOTAL - 0.001,
        );
      }
    },
    { threshold: 0.25, once: false },
  );

  return (
    <SnapSection
      ref={ref}
      id={META.id}
      index={META.index}
      label={META.label}
      theme={META.theme}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 py-12 md:grid-cols-2 md:gap-16 md:py-28">
        <div ref={headerRef} className="flex flex-col gap-4 md:gap-6">
          <div data-fade>
            <Eyebrow>{META.eyebrow}</Eyebrow>
          </div>
          <h2
            id={`${META.id}-title`}
            data-fade
            className="font-display font-bold text-[clamp(32px,6.2vw,92px)] leading-[1.05] text-balance-tight"
          >
            {META.headline}
          </h2>
          <p
            data-fade
            className="text-sm md:text-xl text-[var(--color-ink-soft)] max-w-md"
          >
            Desde que el restaurante recibe el pedido hasta que el motorizado
            toca tu puerta. Sin &quot;¿ya salió?&quot;, sin &quot;¿cuánto
            falta?&quot;. Ya sabes.
          </p>
        </div>

        <div className="flex justify-center">
          <div
            className="relative aspect-[9/19] w-[220px] md:w-[300px] rounded-[48px] border-[10px] border-[#0A0908] bg-[#0F0D0B] p-0 overflow-hidden"
            style={{
              boxShadow:
                "0 25px 60px -20px rgba(0,0,0,0.5), 0 8px 20px -8px rgba(249,115,22,0.18)",
            }}
          >
            {/* Side buttons */}
            <span
              aria-hidden="true"
              className="absolute -left-[12px] top-[80px] h-[34px] w-[3px] rounded-l-sm bg-[#0A0908]"
            />
            <span
              aria-hidden="true"
              className="absolute -left-[12px] top-[126px] h-[52px] w-[3px] rounded-l-sm bg-[#0A0908]"
            />
            <span
              aria-hidden="true"
              className="absolute -left-[12px] top-[188px] h-[52px] w-[3px] rounded-l-sm bg-[#0A0908]"
            />
            <span
              aria-hidden="true"
              className="absolute -right-[12px] top-[140px] h-[72px] w-[3px] rounded-r-sm bg-[#0A0908]"
            />

            {/* Screen */}
            <div className="absolute inset-0 flex flex-col rounded-[38px] bg-[#FAF6F1] overflow-hidden">
              {/* Status bar + Dynamic Island */}
              <div className="relative h-[34px] shrink-0 px-5 pt-2.5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#1A1614]">
                  <span>9:41</span>
                  <span className="flex items-center gap-1" aria-hidden="true">
                    <svg viewBox="0 0 14 10" className="h-2.5 w-3.5 fill-current">
                      <path d="M1 8h2v1H1zm3-2h2v3H4zm3-2h2v5H7zm3-2h2v7h-2z" />
                    </svg>
                    <svg viewBox="0 0 16 11" className="h-2.5 w-4 fill-current">
                      <path d="M8 3.5C5.7 3.5 3.6 4.4 2 5.9L0 4C2.2 1.9 5 .8 8 .8s5.8 1.1 8 3.2l-2 1.9c-1.6-1.5-3.7-2.4-6-2.4zm0 3.5c-1.4 0-2.7.5-3.7 1.4l3.7 3.6L11.7 8.4C10.7 7.5 9.4 7 8 7z" />
                    </svg>
                    <span className="flex items-center gap-0.5">
                      <span className="relative inline-block h-2.5 w-5 rounded-[3px] border border-current">
                        <span className="absolute left-0.5 top-0.5 bottom-0.5 right-0.5 rounded-[1px] bg-current" />
                      </span>
                    </span>
                  </span>
                </div>
                {/* Dynamic Island */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-2 h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-[#0A0908]"
                />
              </div>

              {/* App content */}
              <div className="flex flex-1 flex-col gap-2.5 px-3 pb-2">
                {/* App header */}
                <div className="flex items-center justify-between px-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] leading-none text-[#1A1614]">←</span>
                    <span className="font-display text-[12px] font-bold text-[#1A1614]">
                      Tu pedido
                    </span>
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#1A1614]/55">
                    #4821
                  </span>
                </div>

                {/* ETA card */}
                <div className="rounded-[14px] bg-[#FFEDD5] px-3 py-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#C2410C]">
                    Llega en
                  </p>
                  <p className="font-display text-[24px] font-bold leading-none text-[#1A1614]">
                    ~4 min
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#1A1614]/60">
                    Av. Túpac Amaru 184
                  </p>
                </div>

                {/* States stepper */}
                <div
                  ref={statesRef}
                  className="grid grid-cols-4 gap-1"
                >
                  {STATES.map((s) => (
                    <div
                      key={s.label}
                      data-state
                      className="flex flex-col items-center gap-0.5 rounded-lg p-1.5 bg-[var(--color-ink-faint)] text-[var(--color-ink-soft)]"
                    >
                      <span className="text-[12px]">{s.icon}</span>
                      <span className="text-[6px] font-mono font-semibold uppercase tracking-wide leading-tight text-center">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div className="flex-1 rounded-[12px] bg-[#ECEAE5] relative overflow-hidden">
                  {/* Subtle map grid */}
                  <svg
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full opacity-40"
                    viewBox="0 0 200 320"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1A1614" strokeWidth="0.3" strokeOpacity="0.25" />
                      </pattern>
                    </defs>
                    <rect width="200" height="320" fill="url(#map-grid)" />
                  </svg>
                  {/* Path & mover */}
                  <svg
                    viewBox="0 0 200 320"
                    className="absolute inset-0 h-full w-full"
                  >
                    <path
                      ref={pathRef}
                      d={PATH_D}
                      stroke="rgba(249, 115, 22, 0.25)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      ref={pathProgressRef}
                      d={PATH_D}
                      stroke="var(--color-brand)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle cx="30" cy="280" r="5" fill="#1A1614" />
                    <circle cx="170" cy="40" r="7" fill="var(--color-brand)" />
                    <circle cx="170" cy="40" r="11" fill="var(--color-brand)" opacity="0.25" />
                    <text
                      ref={moverRef}
                      x="30"
                      y="280"
                      fill="var(--color-brand)"
                      fontSize="20"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ willChange: "transform" }}
                    >
                      🛵
                    </text>
                  </svg>
                  <div
                    ref={confettiRef}
                    className="pointer-events-none absolute"
                    style={{ left: "85%", top: "12%" }}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        data-particle
                        className="absolute h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]"
                        style={{ willChange: "transform, opacity" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Driver card */}
                <div className="flex items-center gap-2 rounded-[12px] bg-white p-2 shadow-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[12px] font-display font-bold text-white">
                    L
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-display text-[10px] font-bold text-[#1A1614] leading-tight">
                      Luis · 4.9 ★
                    </p>
                    <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#1A1614]/55">
                      En camino
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Llamar al motorizado"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] text-white"
                    tabIndex={-1}
                  >
                    📞
                  </button>
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex h-[12px] shrink-0 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="h-[3px] w-[80px] rounded-full bg-[#1A1614]/60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SnapSection>
  );
}
