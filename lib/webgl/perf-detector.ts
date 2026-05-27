export type PerfTier = "low" | "mid" | "high";

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

export function detectPerfTier(): PerfTier {
  if (typeof navigator === "undefined") return "mid";

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const ua = nav.userAgent ?? "";
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  if (isMobileUA && (cores < 4 || memory < 4)) return "low";
  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4 && memory >= 4) return "mid";
  return "low";
}
