"use client";

import { useMemo, useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[7]!;

type Node = { x: number; y: number; r: number };
type Edge = { a: number; b: number };

const TESTIMONIALS = [
  {
    quote: "Esto era lo que faltaba aquí.",
    author: "Don Carlos",
    role: "dueño de Priamo",
    pos: "top-[18%] left-[6%]",
    delay: 0.5,
  },
  {
    quote: "Pedir es más rápido que la llamada.",
    author: "María",
    role: "vecina del centro",
    pos: "bottom-[24%] right-[6%]",
    delay: 0.8,
  },
  {
    quote: "Ya no me pierdo en direcciones.",
    author: "Luis",
    role: "motorizado",
    pos: "top-[58%] left-[56%]",
    delay: 1.1,
  },
];

function buildConstellation(): { nodes: Node[]; edges: Edge[] } {
  let s = 1337;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const count = 14;
  const nodes: Node[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: 80 + rnd() * 840,
      y: 60 + rnd() * 480,
      r: 2.5 + rnd() * 2.5,
    });
  }

  const edges: Edge[] = [];
  for (let i = 0; i < count; i++) {
    let nearest = -1;
    let nearestDist = Infinity;
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const dx = nodes[i]!.x - nodes[j]!.x;
      const dy = nodes[i]!.y - nodes[j]!.y;
      const d = dx * dx + dy * dy;
      if (d < nearestDist) {
        nearestDist = d;
        nearest = j;
      }
    }
    if (nearest >= 0) {
      const exists = edges.some(
        (e) =>
          (e.a === i && e.b === nearest) || (e.a === nearest && e.b === i),
      );
      if (!exists) edges.push({ a: i, b: nearest });
    }
  }

  return { nodes, edges };
}

export function ConnectedSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const { nodes, edges } = useMemo(() => buildConstellation(), []);

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

      const dots = svgRef.current?.querySelectorAll<SVGCircleElement>("[data-dot]") ?? [];
      if (dots.length > 0) {
        tl.from(
          dots,
          {
            opacity: 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.04,
          },
          0.2,
        );
      }

      const lines = svgRef.current?.querySelectorAll<SVGLineElement>("[data-line]") ?? [];
      if (lines.length > 0) {
        tl.from(
          lines,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.03,
          },
          0.5,
        );
      }

      const cards =
        testimonialsRef.current?.querySelectorAll<HTMLElement>("[data-testimonial]") ?? [];
      cards.forEach((card, i) => {
        const delay = TESTIMONIALS[i]?.delay ?? 0.6 + i * 0.2;
        tl.from(
          card,
          {
            opacity: 0,
            y: 18,
            duration: 0.7,
            ease: "expo.out",
          },
          delay,
        );
      });
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
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
        aria-hidden="true"
      >
        {edges.map((edge, i) => {
          const a = nodes[edge.a]!;
          const b = nodes[edge.b]!;
          return (
            <line
              key={i}
              data-line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--color-brand)"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
          );
        })}
        {nodes.map((n, i) => (
          <circle
            key={i}
            data-dot
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="var(--color-brand)"
            opacity={0.85}
          />
        ))}
      </svg>

      <div
        ref={headerRef}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 py-20 md:py-28 text-center"
      >
        <div data-fade>
          <Eyebrow className="text-[#FAF6F1]/70">{META.eyebrow}</Eyebrow>
        </div>
        <h2
          id={`${META.id}-title`}
          data-fade
          className="font-display font-bold text-[clamp(34px,4.8vw,72px)] leading-[1.1] text-balance-tight max-w-4xl"
        >
          {META.headline}
        </h2>
        <p
          data-fade
          className="max-w-xl text-base md:text-lg text-[#FAF6F1]/80"
        >
          Cuando San Jacinto pide por Tindivo, gana todo el barrio.
        </p>
      </div>

      <div ref={testimonialsRef} className="absolute inset-0 pointer-events-none">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.author}
            data-testimonial
            className={`absolute hidden md:block max-w-[240px] font-sans italic text-sm text-[#FAF6F1]/85 ${t.pos}`}
          >
            <p>&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-1 not-italic font-mono text-[10px] uppercase tracking-[0.18em] text-[#FAF6F1]/60">
              — {t.author}, {t.role}
            </p>
          </div>
        ))}
      </div>
    </SnapSection>
  );
}
