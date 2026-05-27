"use client";

import { cn } from "@/lib/utils/cn";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import { whatsappLink } from "@/lib/data/brand";

const VISIBLE_FROM_INDEX = 7;

export function FloatingWhatsApp() {
  const { activeIndex } = useActiveSection();
  const mounted = useIsMounted();

  const visible = mounted && activeIndex >= VISIBLE_FROM_INDEX;

  return (
    <a
      href={whatsappLink("general")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-5 right-4 z-50 flex items-center gap-2",
        "rounded-full bg-[var(--color-brand)] px-4 py-3 cursor-pointer",
        "text-white font-mono text-[11px] uppercase tracking-[0.18em]",
        "shadow-[0_10px_30px_-10px_rgba(249,115,22,0.55)] brand-glow",
        "transition-all duration-500 ease-out",
        "hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand)]",
        "md:bottom-8 md:right-8",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.86.49 3.66 1.42 5.24L2 22l4.95-1.5c1.55.85 3.29 1.29 5.09 1.29 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.85 14.42c-.25.71-1.45 1.36-2.04 1.45-.52.08-1.18.11-1.9-.12-.44-.14-1-.32-1.72-.63-3.03-1.31-5.01-4.36-5.16-4.56-.15-.2-1.24-1.65-1.24-3.14 0-1.5.78-2.23 1.06-2.54.28-.31.61-.39.81-.39.2 0 .41 0 .58.01.19.01.45-.07.7.53.25.61.86 2.11.94 2.27.08.15.13.34.03.54-.1.2-.16.32-.31.5-.15.18-.32.4-.46.54-.15.15-.31.31-.13.61.18.31.79 1.31 1.7 2.12 1.16 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.21.76-.89.96-1.19.2-.31.4-.25.68-.15.28.1 1.77.84 2.07 1 .31.15.51.23.59.36.08.13.08.74-.17 1.46z" />
      </svg>
      <span className="hidden sm:inline">Escríbenos</span>
    </a>
  );
}
