"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useViewportHeight } from "@/lib/hooks/useViewportHeight";
import { useTapToNavigate } from "@/lib/hooks/useTapToNavigate";
import { useLenisGsapBridge } from "@/lib/gsap/useLenisGsapBridge";
import { useFullpageSnap } from "@/lib/gsap/snap";
import { ScrollTrigger } from "@/lib/gsap/register";

type LenisStore = {
  instance: Lenis | null;
  listeners: Set<() => void>;
};

const store: LenisStore = {
  instance: null,
  listeners: new Set(),
};

function subscribe(notify: () => void): () => void {
  store.listeners.add(notify);
  return () => store.listeners.delete(notify);
}

function getSnapshot(): Lenis | null {
  return store.instance;
}

function getServerSnapshot(): Lenis | null {
  return null;
}

function setInstance(instance: Lenis | null) {
  store.instance = instance;
  store.listeners.forEach((notify) => notify());
}

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  const fromContext = useContext(LenisContext);
  const fromStore = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return fromContext ?? fromStore;
}

type LenisProviderProps = {
  children: ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lenis = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useViewportHeight();

  useEffect(() => {
    if (reducedMotion || isMobile) {
      if (store.instance) {
        store.instance.destroy();
        setInstance(null);
      }
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    setInstance(instance);

    return () => {
      instance.destroy();
      if (store.instance === instance) setInstance(null);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [reducedMotion, isMobile]);

  useLenisGsapBridge(lenis);
  useFullpageSnap(lenis);
  useTapToNavigate(lenis);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
