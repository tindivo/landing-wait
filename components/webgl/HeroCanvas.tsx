"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useWebGLSupport } from "@/lib/webgl/useWebGLSupport";
import { detectPerfTier, type PerfTier } from "@/lib/webgl/perf-detector";
import { WebGLFallback } from "./WebGLFallback";

const HeroShader = dynamic(() => import("./HeroShader"), {
  ssr: false,
  loading: () => null,
});

let cachedTier: PerfTier | null = null;
function getTier(): PerfTier {
  if (cachedTier !== null) return cachedTier;
  cachedTier = detectPerfTier();
  return cachedTier;
}
function subscribeTier(): () => void {
  return () => {};
}
function getServerTier(): PerfTier {
  return "mid";
}

type HeroCanvasProps = {
  className?: string;
};

export function HeroCanvas({ className }: HeroCanvasProps) {
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebGLSupport();
  const tier = useSyncExternalStore(subscribeTier, getTier, getServerTier);

  const useShader = !reducedMotion && webglSupported && tier !== "low";

  return (
    <div className={className} style={{ position: "absolute", inset: 0 }}>
      <WebGLFallback />
      {useShader && <HeroShader />}
    </div>
  );
}
