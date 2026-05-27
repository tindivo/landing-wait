import { cn } from "@/lib/utils/cn";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] md:text-[11px] uppercase",
        "tracking-[0.22em] text-[var(--color-ink-soft)]",
        className,
      )}
    >
      {children}
    </p>
  );
}
