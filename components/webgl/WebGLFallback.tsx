"use client";

import { cn } from "@/lib/utils/cn";

type WebGLFallbackProps = {
  className?: string;
};

// LCP-friendly: hero-poster.webp paints first, CSS gradient + grain layer on top.
// Each layer degrades gracefully if any asset is missing.
export function WebGLFallback({ className }: WebGLFallbackProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-poster.webp)" }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-90"
        style={{
          background:
            "radial-gradient(120% 80% at 22% 28%, #FBBF24 0%, transparent 55%), radial-gradient(110% 90% at 78% 70%, #C2410C 0%, transparent 60%), linear-gradient(135deg, #F97316 0%, #EA580C 55%, #FAF6F1 120%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
        style={{
          backgroundImage: "url(/textures/grain.png)",
          backgroundSize: "180px 180px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 120% at 50% 100%, rgba(26,22,20,0) 50%, rgba(26,22,20,0.35) 100%)",
        }}
      />
    </div>
  );
}
