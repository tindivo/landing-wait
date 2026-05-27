"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

function check(): boolean {
  if (cached !== null) return cached;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return check();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
