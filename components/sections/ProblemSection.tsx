"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SplitText } from "@/components/motion/SplitText";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { gsap } from "@/lib/gsap/register";
import { SECTIONS } from "@/lib/data/sections";

const META = SECTIONS[2]!;

const LINES = [
  "Llamabas.",
  "Repetías.",
  "Repetías de nuevo.",
  "Esperabas sin saber.",
];

const CHAT = [
  { time: "7:42 PM", text: "¿Aló, restaurante? ¿Su negocio está abierto?" },
  { time: "7:58 PM", text: "¿Cuánto demora el pedido?" },
  { time: "8:23 PM", text: "¿Ya salió?" },
];

const STRIKE_INITIAL = {
  textDecorationLine: "line-through" as const,
  textDecorationColor: "transparent",
  textDecorationThickness: "6px",
  textDecorationSkipInk: "none" as const,
};

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useViewportTimeline(
    ref,
    (tl) => {
      if (eyebrowRef.current) {
        tl.from(
          eyebrowRef.current,
          { opacity: 0, y: -8, duration: 0.5, ease: "expo.out" },
          0,
        );
      }

      const lines =
        linesRef.current?.querySelectorAll<HTMLElement>("[data-line]") ?? [];
      const messages =
        chatRef.current?.querySelectorAll<HTMLElement>("[data-msg]") ?? [];

      const lineDelay = 0.4;
      const lineDuration = 0.55;
      const lineSpacing = 0.18;

      lines.forEach((line, i) => {
        const chars = line.querySelectorAll<HTMLElement>(".split-part");
        const start = lineDelay + i * (lineDuration + lineSpacing);

        gsap.set(line, { opacity: 1 });
        if (chars.length > 0) {
          gsap.set(chars, STRIKE_INITIAL);
          tl.from(
            chars,
            {
              opacity: 0,
              duration: 0.001,
              stagger: { each: lineDuration / Math.max(chars.length, 1), from: "start" },
              ease: "steps(1)",
            },
            start,
          );
          tl.to(
            chars,
            {
              textDecorationColor: "rgb(249, 115, 22)",
              duration: 0.55,
              ease: "expo.out",
            },
            start + lineDuration + 0.05,
          );
        }

        const msg = messages[i] as HTMLElement | undefined;
        if (msg) {
          tl.from(
            msg,
            {
              opacity: 0,
              x: 40,
              duration: 0.45,
              ease: "expo.out",
            },
            start + 0.2,
          );
        }
      });

      if (subRef.current) {
        const total =
          lineDelay + LINES.length * (lineDuration + lineSpacing) + 0.2;
        tl.from(
          subRef.current,
          { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" },
          total,
        );
      }
    },
    { threshold: 0.15, once: true },
  );

  return (
    <SnapSection
      ref={ref}
      id={META.id}
      index={META.index}
      label={META.label}
      theme={META.theme}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 py-12 md:grid-cols-5 md:gap-12 md:py-28">
        <div className="flex flex-col gap-5 md:col-span-3 md:gap-6">
          <div ref={eyebrowRef}>
            <Eyebrow>{META.eyebrow}</Eyebrow>
          </div>
          <h2
            id={`${META.id}-title`}
            ref={linesRef}
            className="font-display font-bold text-[clamp(40px,5.6vw,84px)] leading-[1.15]"
          >
            {LINES.map((line) => (
              <span key={line} data-line className="block">
                <SplitText as="span" by="word" className="block">
                  {line}
                </SplitText>
              </span>
            ))}
          </h2>
          <p
            ref={subRef}
            className="text-lg md:text-xl text-[var(--color-ink-soft)] max-w-md"
          >
            Pedir en San Jacinto siempre fue un acto de fe. Ahora ya no.
          </p>
        </div>

        <div
          ref={chatRef}
          className="md:col-span-2 flex flex-col gap-3 justify-end"
        >
          {CHAT.map((msg) => (
            <div
              key={msg.time}
              data-msg
              className="rounded-2xl bg-[var(--color-ink-faint)] px-5 py-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                {msg.time}
              </p>
              <p className="mt-1 text-base text-[var(--color-ink)]">
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SnapSection>
  );
}
