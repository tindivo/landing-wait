"use client";

import { useRef } from "react";
import { SnapSection } from "@/components/layout/SnapSection";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { Wordmark } from "@/components/brand/Wordmark";
import { SplitText } from "@/components/motion/SplitText";
import { useViewportTimeline } from "@/lib/gsap/useViewportTimeline";
import { gsap } from "@/lib/gsap/register";
import { SECTIONS } from "@/lib/data/sections";
import { BRAND, whatsappLink, FACEBOOK_URL } from "@/lib/data/brand";

const META = SECTIONS[8]!;

const LINKS = [
  { href: whatsappLink("general"), label: "→ Escríbenos por WhatsApp" },
  { href: FACEBOOK_URL, label: "→ Síguenos en Facebook" },
  { href: whatsappLink("vendor"), label: "→ Si tienes un restaurante, hablemos" },
];

export function ClosingSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  useViewportTimeline(
    ref,
    (tl) => {
      // Defensive: force end-state visibility for all animated elements. If
      // the timeline is killed before completion, items stay visible instead
      // of trapped at opacity:0 from a tl.from "from" state.
      const headerFades =
        headerRef.current?.querySelectorAll<HTMLElement>("[data-fade]") ?? [];
      const chars =
        titleRef.current?.querySelectorAll<HTMLElement>(".split-part") ?? [];
      const dot = titleRef.current?.querySelector<HTMLElement>("[data-dot]");
      const linkEls =
        linksRef.current?.querySelectorAll<HTMLElement>("[data-link]") ?? [];

      gsap.set(headerFades, { opacity: 1, y: 0 });
      if (chars.length > 0) {
        gsap.set(chars, { transformOrigin: "50% 100%", opacity: 1, scale: 1 });
      }
      if (dot) gsap.set(dot, { opacity: 1, scale: 1 });
      if (subRef.current) gsap.set(subRef.current, { opacity: 1, y: 0 });
      linkEls.forEach((link) => {
        gsap.set(link, { opacity: 1, x: 0 });
      });
      if (footerRef.current) gsap.set(footerRef.current, { opacity: 1, y: 0 });

      if (headerFades.length > 0) {
        tl.fromTo(
          headerFades,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.1, immediateRender: false },
          0,
        );
      }

      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(2)",
            stagger: 0.06,
            immediateRender: false,
          },
          0.2,
        );
      }

      if (dot) {
        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.55,
            ease: "back.out(2.4)",
            immediateRender: false,
          },
          0.2 + chars.length * 0.06,
        );
      }

      if (subRef.current) {
        tl.fromTo(
          subRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", immediateRender: false },
          1.1,
        );
      }

      // CTAs always visible — animation only on underlines (decorative).
      // Avoids the timeline-interruption bug that leaves links at opacity:0.
      linkEls.forEach((link, i) => {
        const underline = link.querySelector<HTMLElement>("[data-underline]");
        if (underline) {
          gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
          tl.to(
            underline,
            { scaleX: 1, duration: 0.6, ease: "expo.out" },
            1.55 + i * 0.18,
          );
        }
      });

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", immediateRender: false },
          2.4,
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-brand-glow) 35%, transparent), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-7xl flex-col justify-between gap-8 py-10 md:gap-0 md:py-16">
        <div ref={headerRef} className="flex items-start justify-between">
          <div data-fade>
            <Wordmark
              size="md"
              withDot={false}
              href="#inicio"
              className="text-white"
            />
          </div>
          <div data-fade>
            <Eyebrow className="text-white/80 text-right">{META.eyebrow}</Eyebrow>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 md:gap-12 text-center">
          <h2
            id={`${META.id}-title`}
            ref={titleRef}
            className="font-display font-bold text-white text-[clamp(96px,24vw,360px)] leading-[0.85] tracking-[-0.04em]"
          >
            <SplitText as="span" by="char" className="inline-block">
              Pronto
            </SplitText>
            <span
              data-dot
              className="inline-block text-white"
              style={{ animation: "heartbeat 1.4s ease-in-out infinite" }}
            >
              .
            </span>
          </h2>
          <p ref={subRef} className="max-w-xl text-base md:text-2xl text-white/90">
            Estamos puliendo los últimos detalles. Muy pronto en tindivo.com
            vas a poder pedir comida del barrio sin moverte.
          </p>

          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/85">
            Escríbenos directo al WhatsApp{" "}
            <span className="text-white font-semibold tracking-normal normal-case">
              {BRAND.supportPhone}
            </span>
          </p>

          <div
            ref={linksRef}
            className="flex flex-col gap-3 md:gap-4 text-white font-display text-lg md:text-2xl"
          >
            {LINKS.map((link) => (
              <a
                key={link.label}
                data-link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block self-start pb-1 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand)] rounded-sm"
              >
                {link.label}
                <span
                  data-underline
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-white"
                  style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
                />
              </a>
            ))}
          </div>
        </div>

        <p
          ref={footerRef}
          className="text-center font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] text-white/70"
        >
          San Jacinto, Áncash · Perú · 2026 · Hecho con 🍕 desde acá.
        </p>
      </div>
    </SnapSection>
  );
}
